import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const analyses = await prisma.analysis.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        fileName: true,
        fileSize: true,
        createdAt: true,
        result: true,
        jobDescription: true,
      }
    })

    return NextResponse.json({ analyses })
  } catch (error) {
    console.error("History Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 }
    )
  }
}
