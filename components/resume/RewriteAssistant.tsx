"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, Wand2, Copy, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

interface RewriteAssistantProps {
  advice?: string
  trigger?: React.ReactElement
}

export function RewriteAssistant({ advice, trigger }: RewriteAssistantProps) {
  const [open, setOpen] = useState(false)
  const [originalText, setOriginalText] = useState("")
  const [rewrittenText, setRewrittenText] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleRewrite = async () => {
    if (!originalText.trim()) {
      toast.error("Masukkan kalimat yang ingin diperbaiki.")
      return
    }

    setIsGenerating(true)
    setRewrittenText("")
    
    try {
      const res = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalText, advice }),
      })

      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || "Gagal memproses kalimat")
      }

      setRewrittenText(data.rewritten)
      toast.success("Kalimat berhasil diperbaiki!")
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = () => {
    if (!rewrittenText) return
    navigator.clipboard.writeText(rewrittenText)
    setCopied(true)
    toast.success("Berhasil disalin ke clipboard!")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Wand2 className="h-4 w-4 text-primary" />
            Perbaiki Kalimat
          </Button>
        )}
      />
      
      <DialogContent className="sm:max-w-[500px] rounded-3xl border-primary/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" />
            AI Rewrite Assistant
          </DialogTitle>
          <DialogDescription>
            {advice ? "AI akan memperbaiki kalimatmu berdasarkan saran spesifik dari HRD." : "Ubah kalimat biasa menjadi profesional dan ramah ATS."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {advice && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 p-3 rounded-xl text-sm border border-yellow-200 dark:border-yellow-900/50">
              <span className="font-bold block mb-1">Konteks / Saran HRD:</span>
              {advice}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Kalimat Asli dari CV</label>
            <textarea
              className="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px] resize-y"
              placeholder="Paste kalimat yang ingin diperbaiki ke sini..."
              value={originalText}
              onChange={(e) => setOriginalText(e.target.value)}
              disabled={isGenerating}
            />
          </div>

          <Button 
            className="w-full rounded-full shadow-md hover:shadow-lg transition-all" 
            onClick={handleRewrite} 
            disabled={isGenerating || !originalText.trim()}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sedang Menulis Ulang...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" /> Generate Kalimat Profesional
              </>
            )}
          </Button>

          {rewrittenText && (
            <div className="mt-4 space-y-2 animate-fade-in">
              <label className="text-sm font-semibold text-primary flex justify-between items-end">
                Hasil Perbaikan (Ramah ATS)
                <button 
                  onClick={handleCopy}
                  className="text-xs flex items-center gap-1 hover:text-primary transition-colors text-muted-foreground bg-primary/5 px-2 py-1 rounded-md"
                >
                  {copied ? <CheckCircle2 className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copied ? "Tersalin" : "Salin"}
                </button>
              </label>
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl text-sm leading-relaxed text-foreground relative group">
                {rewrittenText}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
