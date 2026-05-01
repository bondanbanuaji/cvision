"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { FileText, ChevronRight, History as HistoryIcon, Trash2, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { AnalysisResult } from "@/components/resume/AnalysisResult"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function HistoryPage() {
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ["history"],
    queryFn: async () => {
      const res = await fetch("/api/history")
      if (!res.ok) throw new Error("Gagal mengambil data riwayat")
      return res.json()
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/history/${id}`, {
        method: "DELETE",
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Gagal menghapus riwayat")
      }
      return res.json()
    },
    onSuccess: () => {
      toast.success("Riwayat berhasil dihapus")
      queryClient.invalidateQueries({ queryKey: ["history"] })
    },
    onError: (err: any) => {
      toast.error(err.message)
    }
  })

  if (error) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3">
        <div className="bg-red-100 p-2 rounded-full">
          <FileText className="h-5 w-5" />
        </div>
        <p className="font-medium">Terjadi kesalahan saat memuat riwayat. Silakan coba lagi nanti.</p>
      </div>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100 dark:bg-green-900/30"
    if (score >= 60) return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30"
    return "text-red-600 bg-red-100 dark:bg-red-900/30"
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="bg-card p-8 rounded-3xl border shadow-sm relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
            <HistoryIcon className="mr-2 h-4 w-4" />
            Riwayat
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Riwayat Analisis CV</h1>
          <p className="text-muted-foreground mt-3 text-lg max-w-2xl">
            Lihat kembali semua hasil analisis CV kamu sebelumnya. Bandingkan skor untuk melihat perkembanganmu.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-2xl" />
          ))}
        </div>
      ) : data?.analyses?.length === 0 ? (
        <div className="text-center p-16 border-2 border-dashed border-border/60 rounded-3xl bg-muted/20">
          <div className="bg-background p-4 rounded-full w-fit mx-auto shadow-sm mb-4">
            <FileText className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold">Belum ada riwayat analisis</h3>
          <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
            Yuk upload CV pertamamu di halaman Analisis CV untuk mulai melihat saran perbaikan di sini.
          </p>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          {data?.analyses?.map((analysis: any) => {
            const score = analysis.result?.score?.overall || 0;
            const isDeleting = deleteMutation.variables === analysis.id && deleteMutation.isPending;

            return (
              <Card key={analysis.id} className="hover:bg-muted/50 hover:border-primary/30 hover:shadow-md transition-all rounded-2xl overflow-hidden group">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4">
                  <Dialog>
                    <DialogTrigger render={<button type="button" className="flex-1 flex items-center gap-4 text-left outline-none cursor-pointer" />}>
                        <div className="p-4 bg-primary/10 rounded-2xl group-hover:bg-primary/20 transition-colors">
                          <FileText className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{analysis.fileName}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-muted-foreground bg-background px-2 py-0.5 rounded-md border shadow-sm">
                              {format(new Date(analysis.createdAt), "dd MMM yyyy • HH:mm", { locale: id })}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {(analysis.fileSize / 1024).toFixed(1)} KB
                            </span>
                          </div>
                        </div>
                    </DialogTrigger>
                    
                    <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl p-0 gap-0">
                      <DialogHeader className="p-6 border-b sticky top-0 bg-background/80 backdrop-blur-xl z-10 rounded-t-3xl">
                        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                          <FileText className="h-6 w-6 text-primary" />
                          Hasil Analisis: {analysis.fileName}
                        </DialogTitle>
                        <DialogDescription>
                          Dianalisis pada {format(new Date(analysis.createdAt), "dd MMMM yyyy, HH:mm", { locale: id })}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="p-6 bg-muted/10">
                        <AnalysisResult data={analysis} />
                      </div>
                    </DialogContent>
                  </Dialog>

                  <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-4 mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-border/50">
                    <div className="text-left sm:text-right">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Skor Keseluruhan</p>
                      <div className={`inline-flex items-center justify-center px-3 py-1 rounded-xl font-black text-xl ${getScoreColor(score)}`}>
                        {score}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0" 
                      onClick={() => deleteMutation.mutate(analysis.id)}
                      disabled={isDeleting}
                      title="Hapus riwayat"
                    >
                      {isDeleting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
