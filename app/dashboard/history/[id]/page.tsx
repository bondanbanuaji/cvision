import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import { AnalysisResult } from "@/components/resume/AnalysisResult"
import { FileText, ArrowLeft, History } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { id as localeId } from "date-fns/locale"

export default async function HistoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/login")
  }

  const { id } = await params

  const analysis = await prisma.analysis.findUnique({
    where: { id },
  })

  if (!analysis || analysis.userId !== session.user.id) {
    notFound()
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <Link href="/dashboard/history" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors hover:bg-muted/50 px-3 py-1.5 rounded-full -ml-3">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Kembali ke Riwayat
      </Link>

      <div className="bg-card p-8 rounded-3xl border shadow-sm relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
              <History className="mr-2 h-4 w-4" />
              Detail Riwayat
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary shrink-0" />
              <span className="truncate max-w-[500px]">{analysis.fileName}</span>
            </h1>
            <p className="text-muted-foreground mt-3 text-lg">
              Dianalisis pada {format(new Date(analysis.createdAt), "dd MMMM yyyy, HH:mm", { locale: localeId })}
            </p>
          </div>
        </div>
      </div>

      <div className="animate-slide-up">
        <AnalysisResult data={analysis} />
      </div>
    </div>
  )
}
