"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { UploadCloud, Loader2, Info } from "lucide-react"
import { toast } from "sonner"
import { useResumeStore } from "@/lib/store/useResumeStore"
import { Button } from "@/components/ui/button"

export function UploadZone({ onAnalysisComplete }: { onAnalysisComplete: (data: any) => void }) {
  const { isAnalyzing, setIsAnalyzing } = useResumeStore()
  const [jobDescription, setJobDescription] = useState("")

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    
    if (!file) return

    if (file.type !== "application/pdf") {
      toast.error("Wajib menggunakan file PDF ya!")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal adalah 5MB.")
      return
    }

    setIsAnalyzing(true)

    const formData = new FormData()
    formData.append("file", file)
    if (jobDescription) {
      formData.append("jobDescription", jobDescription)
    }

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Gagal menganalisis CV")
      }

      toast.success("Hore! CV kamu berhasil dianalisis.")
      onAnalysisComplete(data.analysis)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsAnalyzing(false)
    }
  }, [jobDescription, onAnalysisComplete, setIsAnalyzing])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    disabled: isAnalyzing
  })

  return (
    <div className="space-y-6">
      {/* Tips Box */}
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-xl p-4 flex gap-3">
        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800 dark:text-blue-300">
          <strong>Tips penting sebelum upload:</strong> Pastikan CV kamu berformat PDF, ukuran maksimal 5MB, berupa teks yang bisa di-copy (bukan hasil scan/foto), dan gunakan desain yang bersih agar ramah sistem ATS.
        </div>
      </div>

      <div className="space-y-3 bg-card p-6 rounded-2xl border shadow-sm">
        <label htmlFor="jobDescription" className="text-sm font-bold text-foreground flex items-center gap-2">
          Paste Deskripsi Lowongan Kerja <span className="text-muted-foreground font-normal">(Opsional)</span>
        </label>
        <p className="text-sm text-muted-foreground mb-2">
          AI akan membandingkan isi CV kamu dengan detail kualifikasi di deskripsi pekerjaan ini untuk melihat kecocokan.
        </p>
        <textarea 
          id="jobDescription"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="contoh: Kami mencari Software Engineer dengan pengalaman React. Tanggung jawab utama..."
          rows={4}
          className="flex w-full rounded-xl border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-sm resize-y"
          disabled={isAnalyzing}
        />
      </div>

      <div
        {...getRootProps()}
        className={`relative overflow-hidden border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 ease-in-out
          ${isDragActive ? "border-primary bg-primary/10 scale-[1.02]" : "border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/30 cursor-pointer"}
          ${isAnalyzing ? "opacity-70 cursor-not-allowed pointer-events-none" : ""}
        `}
      >
        <input {...getInputProps()} />
        
        {isAnalyzing && (
          <div className="absolute inset-0 bg-primary/5 flex flex-col items-center justify-center backdrop-blur-sm z-10 rounded-3xl">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <h3 className="text-xl font-bold text-foreground">AI Sedang Membaca CV Kamu...</h3>
            <p className="text-muted-foreground mt-2 max-w-xs mx-auto">
              Proses ini biasanya memakan waktu sekitar 10-15 detik. Harap tunggu sebentar ya.
            </p>
          </div>
        )}

        <div className={`flex flex-col items-center justify-center space-y-4 transition-opacity duration-300 ${isAnalyzing ? 'opacity-0' : 'opacity-100'}`}>
          <div className="p-4 bg-primary/10 rounded-full animate-float">
            <UploadCloud className="h-10 w-10 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Klik atau seret file PDF ke sini</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Hanya menerima file berformat .pdf dengan ukuran maksimal 5MB.
            </p>
          </div>
          
          <Button variant="secondary" className="mt-4 rounded-full pointer-events-none">
            Pilih File PDF
          </Button>
        </div>
      </div>
    </div>
  )
}
