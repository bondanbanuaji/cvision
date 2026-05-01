"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { UploadCloud, Loader2, Info, FileText, X, ScanSearch } from "lucide-react"
import { toast } from "sonner"
import { useResumeStore } from "@/lib/store/useResumeStore"
import { Button } from "@/components/ui/button"

export function UploadZone({ onAnalysisComplete }: { onAnalysisComplete: (data: any) => void }) {
  const { isAnalyzing, setIsAnalyzing } = useResumeStore()
  const [jobDescription, setJobDescription] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

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

    setSelectedFile(file)
  }, [])

  const handleAnalyze = async () => {
    if (!selectedFile) return

    if (!jobDescription || jobDescription.trim() === "") {
      toast.error("Posisi pekerjaan wajib diisi! Mohon tulis posisi pekerjaan atau paste deskripsi lowongan yang ingin dilamar.")
      return
    }

    setIsAnalyzing(true)

    const formData = new FormData()
    formData.append("file", selectedFile)
    formData.append("jobDescription", jobDescription)

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
      setSelectedFile(null)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsAnalyzing(false)
    }
  }

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

      <div className="space-y-3 bg-card p-6 rounded-2xl border shadow-sm transition-all duration-300 focus-within:border-primary/50 focus-within:shadow-md">
        <label htmlFor="jobDescription" className="text-sm font-bold text-foreground flex items-center gap-2">
          Posisi pekerjaan / Deskripsi Lowongan Kerja <span className="text-destructive">*</span>
        </label>
        <p className="text-sm text-muted-foreground mb-2">
          AI akan membandingkan isi CV kamu dengan detail kualifikasi di deskripsi pekerjaan ini untuk melihat kecocokan.
        </p>
        <textarea 
          id="jobDescription"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="contoh: Tuliskan tugas, tanggung jawab, dan kualifikasi yang dibutuhkan untuk posisi ini..."
          rows={4}
          className="flex w-full rounded-xl border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-sm resize-y"
          disabled={isAnalyzing}
        />
      </div>

      {!selectedFile ? (
        <div
          {...getRootProps()}
          className={`relative overflow-hidden border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 ease-in-out
            ${isDragActive ? "border-primary bg-primary/10 scale-[1.02]" : "border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/30 cursor-pointer"}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="p-4 bg-primary/10 rounded-full animate-float">
              <UploadCloud className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Silahkan klik atau seret file PDF ke sini</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Hanya menerima file berformat .pdf dengan ukuran maksimal 5MB.
              </p>
            </div>
            <Button variant="secondary" className="mt-4 rounded-full pointer-events-none">
              Pilih File PDF
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          <div className="relative overflow-hidden border-2 border-primary/20 bg-primary/5 rounded-3xl p-6 sm:p-8 transition-all duration-500 hover:border-primary/40 hover:shadow-lg group">
            {isAnalyzing && (
              <div className="absolute inset-0 bg-background/95 flex flex-col items-center justify-center backdrop-blur-sm z-20 rounded-3xl animate-in fade-in duration-300 px-6">
                <div className="bg-primary/10 p-3 rounded-full mb-3">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                </div>
                <h3 className="text-base font-bold text-foreground">Sistem AI Sedang Membedah CV...</h3>
                <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground/60 mt-1 max-w-[250px] text-center">
                  Menganalisis kualifikasi & kaitan lowongan
                </p>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
              <div className="p-4 sm:p-5 bg-background rounded-2xl shadow-sm border group-hover:scale-105 transition-transform duration-300 shrink-0">
                <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-foreground truncate">{selectedFile.name}</h3>
                <p className="text-xs text-muted-foreground mt-1 font-medium">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • File siap untuk dipindai
                </p>
              </div>
              <button 
                onClick={() => setSelectedFile(null)}
                disabled={isAnalyzing}
                className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors disabled:opacity-50 shrink-0 mt-2 sm:mt-0"
                title="Batal atau ganti file"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <Button 
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full rounded-2xl h-14 text-base font-bold shadow-lg hover:shadow-primary/25 transition-all hover:-translate-y-1"
            size="lg"
          >
            {isAnalyzing ? (
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            ) : (
              <ScanSearch className="mr-2 h-6 w-6" />
            )}
            {isAnalyzing ? "Sedang Memindai..." : "Mulai Scan & Review CV"}
          </Button>
        </div>
      )}
    </div>
  )
}
