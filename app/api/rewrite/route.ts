import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { rewriteText } from "@/lib/ai/gemini"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { originalText, advice } = await req.json()

    if (!originalText) {
      return NextResponse.json({ error: "Teks asli diperlukan" }, { status: 400 })
    }

    const rewritten = await rewriteText(originalText, advice)

    return NextResponse.json({ rewritten })
  } catch (error: any) {
    console.error("[Rewrite] Error:", error.message || error)
    return NextResponse.json(
      { error: error.message || "Gagal memproses permintaan" },
      { status: 500 }
    )
  }
}
