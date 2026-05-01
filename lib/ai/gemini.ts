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

export async function analyzeResume(resumeText: string, jobTitle?: string) {
  const targetJobContext = jobTitle
    ? `Kandidat ini melamar untuk posisi: ${jobTitle}. Evaluasi CV ini secara spesifik terhadap ekspektasi posisi tersebut.`
    : "Evaluasi CV ini untuk posisi profesional umum berdasarkan tingkat pengalaman yang terlihat dari isi CV."

  const prompt = `Kamu adalah HRD senior di Indonesia dengan pengalaman 15 tahun dalam merekrut talenta teknis dan non-teknis.
Tugas kamu adalah menganalisis teks CV berikut dan memberikan penilaian yang terstruktur dalam format JSON.

PENTING: SELURUH JAWABAN (SUMMARY, STRENGTHS, WEAKNESSES, SUGGESTIONS) HARUS DITULIS DALAM BAHASA INDONESIA YANG BAIK, BENAR, DAN MUDAH DIPAHAMI OLEH ORANG AWAM. GUNAKAN BAHASA YANG MEMOTIVASI, BUKAN MENGHAKIMI.

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
        temperature: 0.4,
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
