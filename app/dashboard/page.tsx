"use client"

import { useState } from "react"
import { UploadZone } from "@/components/resume/UploadZone"
import { AnalysisResult } from "@/components/resume/AnalysisResult"
import { useResumeStore } from "@/lib/store/useResumeStore"
import { FileUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const [analysisData, setAnalysisData] = useState<any>(null)
  const { isAnalyzing } = useResumeStore()

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="bg-card p-8 rounded-3xl border shadow-sm relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
            <FileUp className="mr-2 h-4 w-4" />
            Langkah 1: Upload CV
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Analisis CV Kamu</h1>
          <p className="text-muted-foreground mt-3 text-lg max-w-2xl">
            Unggah CV kamu dalam format PDF. AI kami akan membedah setiap kalimat dan memberikan saran perbaikan spesifik agar kamu lolos seleksi ATS.
          </p>
        </div>
      </div>

      {!analysisData ? (
        <UploadZone onAnalysisComplete={(data) => setAnalysisData(data)} />
      ) : (
        !isAnalyzing && (
          <div className="animate-slide-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  Langkah 2: Hasil & Perbaikan
                </div>
                <div className="hidden sm:block h-px bg-border flex-1 w-32" />
              </div>
              <Button 
                onClick={() => setAnalysisData(null)}
                variant="outline"
                className="rounded-full shadow-sm hover:bg-primary/5 hover:text-primary transition-all"
              >
                <FileUp className="mr-2 h-4 w-4" />
                Scan CV Lainnya
              </Button>
            </div>
            <AnalysisResult data={analysisData} />
          </div>
        )
      )}
    </div>
  )
}
