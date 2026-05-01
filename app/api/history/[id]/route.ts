import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Tidak memiliki akses (Unauthorized)" }, { status: 401 })
    }

    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: "ID Analisis tidak ditemukan" }, { status: 400 })
    }

    // Verify ownership
    const analysis = await prisma.analysis.findUnique({
      where: { id }
    })

    if (!analysis || analysis.userId !== session.user.id) {
      return NextResponse.json({ error: "Data riwayat tidak ditemukan atau Anda tidak memiliki akses" }, { status: 404 })
    }

    await prisma.analysis.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Riwayat berhasil dihapus" })
  } catch (error: any) {
    console.error("[HISTORY_DELETE_ERROR]", error)
    return NextResponse.json(
      { error: "Gagal menghapus riwayat analisis" },
      { status: 500 }
    )
  }
}
