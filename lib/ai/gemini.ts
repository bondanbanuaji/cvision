import { GoogleGenerativeAI } from "@google/generative-ai"

if (!process.env.GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY is not set in environment variables.")
} else {
  console.log("GEMINI_API_KEY is loaded (prefix:", process.env.GEMINI_API_KEY.substring(0, 7) + "...)")
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy-key-for-build")

// Model fallback chain
const MODEL_FALLBACK_CHAIN = (process.env.GEMINI_MODEL || "gemini-2.5-flash,gemini-2.0-flash,gemini-flash-latest")
  .split(",")
  .map((m) => m.trim())
  .filter(Boolean)

console.log("[Gemini] Model chain:", MODEL_FALLBACK_CHAIN)

function extractJSON(text: string): string {
  let cleaned = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim()
  if (cleaned.startsWith("{")) return cleaned
  const start = cleaned.indexOf("{")
  const end = cleaned.lastIndexOf("}")
  if (start !== -1 && end !== -1 && end > start) {
    return cleaned.slice(start, end + 1)
  }
  return cleaned
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function getRetryDelayMs(error: any): number {
  try {
    const details = error?.errorDetails as any[]
    if (!details) return 10_000
    for (const d of details) {
      if (d["@type"] === "type.googleapis.com/google.rpc.RetryInfo") {
        const delaySec = parseInt(d.retryDelay?.replace("s", "") || "10", 10)
        return (delaySec + 2) * 1000 // add 2s buffer
      }
    }
  } catch {}
  return 10_000
}

export async function analyzeResume(resumeText: string, jobDescription?: string) {
  const targetJobContext = jobDescription
    ? `Kandidat ini melamar dengan mengacu pada deskripsi lowongan kerja berikut:\n"""\n${jobDescription}\n"""\n\nTugas Khusus: Lakukan evaluasi secara spesifik seberapa cocok isi CV ini dengan KUALIFIKASI dan TANGGUNG JAWAB pada deskripsi lowongan kerja di atas. Pastikan bagian "keywords", "strengths", dan "weaknesses" sangat relevan dengan deskripsi pekerjaan tersebut.`
    : "Evaluasi CV ini untuk posisi profesional umum berdasarkan tingkat pengalaman yang terlihat dari isi CV."

  const prompt = `Kamu adalah Chief HR Officer & Talent Acquisition Expert tingkat global dengan pengalaman lebih dari 20 tahun merekrut talenta top-tier. Karaktermu sangat cerdas, sangat objektif (berbasis data dan standar industri nyata, tanpa bias subjektif), tajam dalam menganalisis, namun tetap bijaksana dan suportif layaknya mentor karir papan atas.
Tugas kamu adalah menganalisis teks CV berikut secara mendalam, kritis, dan memberikan penilaian yang terstruktur dalam format JSON.

PENTING: SELURUH JAWABAN (SUMMARY, STRENGTHS, WEAKNESSES, CRITICAL_ERRORS, SUGGESTIONS) HARUS DITULIS DALAM BAHASA INDONESIA YANG BAIK, BENAR, DAN MUDAH DIPAHAMI OLEH ORANG AWAM. GUNAKAN BAHASA YANG MEMOTIVASI, BUKAN MENGHAKIMI.

${targetJobContext}

Kembalikan HANYA format JSON murni (tanpa markdown, tanpa penjelasan di luar JSON) dengan struktur persis seperti ini:
{
  "score": {
    "overall": <angka 0-100, mewakili kualitas keseluruhan CV>,
    "impact": <angka 0-100, seberapa kuat dampaknya/kesan pertama>,
    "brevity": <angka 0-100, seberapa ringkas dan tidak bertele-tele>,
    "style": <angka 0-100, tata bahasa dan kerapihan struktur>
  },
  "summary": "<2-3 kalimat kesan pertama kamu sebagai HRD saat melihat CV ini. Bahasa Indonesia yang ramah.>",
  "strengths": ["<Kekuatan 1>", "<Kekuatan 2>", "<Kekuatan 3>"],
  "weaknesses": ["<Kelemahan 1 (bahasa yang membangun)>", "<Kelemahan 2>"],
  "criticalErrors": ["<Kesalahan fatal/Red flag 1 (misal: typo parah, format berantakan, info kontak hilang)>", "<Kesalahan fatal 2>"],
  "suggestions": [
    { "section": "<Misal: Pengalaman Kerja>", "advice": "<Saran spesifik dan actionable, beri contoh cara menulisnya yang benar>" }
  ],
  "keywords": {
    "found": ["<kata kunci yang ditemukan>", "<kata kunci>"],
    "missing": ["<kata kunci relevan yang seharusnya ada tapi tidak ada>", "<kata kunci>"]
  }
}

Teks CV:
${resumeText}`

  // Try each model in the fallback chain
  for (const modelName of MODEL_FALLBACK_CHAIN) {
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        temperature: 0,
        topK: 1,
        topP: 0.1,
        responseMimeType: "application/json",
      },
    })

    const MAX_RETRIES = 2

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`[Gemini] Trying model="${modelName}" attempt ${attempt}/${MAX_RETRIES}...`)
        const result = await model.generateContent(prompt)
        const responseText = result.response.text()
        const cleanedText = extractJSON(responseText)
        const parsed = JSON.parse(cleanedText)
        console.log(`[Gemini] ✓ Success with model="${modelName}"`)
        return parsed
      } catch (error: any) {
        const is429 = error?.status === 429

        if (is429 && attempt < MAX_RETRIES) {
          const waitMs = getRetryDelayMs(error)
          console.warn(`[Gemini] Rate limited on "${modelName}". Waiting ${waitMs / 1000}s...`)
          await sleep(waitMs)
          continue
        }

        if (is429) {
          console.warn(`[Gemini] Quota exhausted on "${modelName}", trying next model...`)
          break 
        }

        if (error instanceof SyntaxError) {
          console.error("[Gemini] JSON parse error:", error.message)
          throw new Error("AI mengembalikan format yang tidak valid. Silakan coba lagi.")
        }

        console.error("[Gemini] Fatal error:", error.message)
        throw new Error(`Analisis AI gagal: ${error.message}`)
      }
    }
  }

  console.error("[Gemini] All models in the fallback chain have been rate limited.")
  throw new Error(
    "Kuota API Gemini saat ini sedang habis atau server sibuk. Harap tunggu beberapa saat lalu coba lagi."
  )
}

export async function rewriteText(originalText: string, contextAdvice?: string) {
  const prompt = `Kamu adalah profesional HRD dan Copywriter untuk CV.
Tugas kamu adalah memperbaiki kalimat di CV ini agar lebih profesional, berfokus pada pencapaian (action-oriented), dan ramah sistem ATS. 

${contextAdvice ? `Saran/Konteks perbaikan yang harus diikuti: "${contextAdvice}"` : ""}

Kalimat Asli yang harus diperbaiki:
"""
${originalText}
"""

Kembalikan HANYA kalimat hasil perbaikan tanpa ada tambahan markdown, tanpa tanda kutip di awal/akhir, dan tanpa penjelasan apapun.`

  for (const modelName of MODEL_FALLBACK_CHAIN) {
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        temperature: 0.2, // sedikit ruang kreativitas untuk memperbaiki kalimat
      },
    })

    try {
      const result = await model.generateContent(prompt)
      let text = result.response.text().trim()
      // remove quotes if the AI adds them
      if (text.startsWith('"') && text.endsWith('"')) {
        text = text.substring(1, text.length - 1)
      }
      return text
    } catch (error: any) {
      const is429 = error?.status === 429
      if (is429) {
        console.warn(`[Gemini Rewrite] Quota exhausted on "${modelName}", trying next...`)
        continue
      }
      console.error("[Gemini Rewrite] Error:", error.message)
      throw new Error(`Gagal memproses kalimat: ${error.message}`)
    }
  }

  throw new Error("Kuota API Gemini saat ini sedang habis. Harap coba lagi nanti.")
}

