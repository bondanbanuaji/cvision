import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { extractTextFromPDF } from "@/lib/ai/pdf-parser"
import { analyzeResume } from "@/lib/ai/gemini"

export async function POST(req: Request) {
  try {
    // 1. Auth check
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 2. Parse form data
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const jobTitle = (formData.get("jobTitle") as string) || undefined

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "File must be a PDF" }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be under 5MB" }, { status: 400 })
    }

    console.log(`[Analyze] Processing: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`)

    // 3. Extract text from PDF
    const buffer = Buffer.from(await file.arrayBuffer())
    const rawText = await extractTextFromPDF(buffer)
    console.log(`[Analyze] Extracted ${rawText.length} characters from PDF`)

    // 4. Analyze with Gemini AI
    const aiResult = await analyzeResume(rawText, jobTitle)
    console.log("[Analyze] AI analysis complete, score:", aiResult?.score?.overall)

    // 5. Save to DB — Prisma Json field needs a plain serializable value
    const analysis = await prisma.analysis.create({
      data: {
        userId: session.user.id,
        fileName: file.name,
        fileSize: file.size,
        rawText,
        // Serialize + parse to ensure it's a plain JSON-safe object
        result: JSON.parse(JSON.stringify(aiResult)),
      },
    })

    // 6. Return the analysis with result merged for immediate display
    return NextResponse.json({
      analysis: {
        ...analysis,
        result: aiResult, // use the parsed object directly so client doesn't need to re-parse
      },
    })
  } catch (error: any) {
    console.error("[Analyze] Error:", error.message || error)
    return NextResponse.json(
      { error: error.message || "Failed to process resume" },
      { status: 500 }
    )
  }
}
