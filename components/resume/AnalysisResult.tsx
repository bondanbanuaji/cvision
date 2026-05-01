"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, AlertTriangle, Lightbulb, Trophy, Target, FileSignature, Sparkles } from "lucide-react"

export function AnalysisResult({ data }: { data: any }) {
  const result = data?.result ?? data
  if (!result || !result.score) return null

  const { score, summary, strengths, weaknesses, suggestions, keywords } = result

  // Motivasi berdasarkan skor keseluruhan
  let motivationMessage = ""
  let motivationColor = ""
  if (score.overall >= 80) {
    motivationMessage = "Luar biasa! CV kamu sudah sangat baik dan siap digunakan melamar kerja."
    motivationColor = "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200"
  } else if (score.overall >= 60) {
    motivationMessage = "CV kamu sudah lumayan, tapi masih ada ruang untuk ditingkatkan. Yuk perbaiki poin-poin di bawah! 💪"
    motivationColor = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200"
  } else {
    motivationMessage = "Jangan patah semangat! Perbaiki CV kamu mengikuti saran di bawah agar peluang lolos ATS meningkat drastis. 🚀"
    motivationColor = "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200"
  }

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Banner Motivasi */}
      <div className={`p-4 rounded-2xl border flex items-start gap-3 ${motivationColor}`}>
        <Trophy className="h-5 w-5 mt-0.5 shrink-0" />
        <p className="font-medium text-sm leading-relaxed">{motivationMessage}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ScoreCard title="Skor Keseluruhan" score={score.overall} description="Kualitas total CV" icon={<Trophy className="h-4 w-4" />} />
        <ScoreCard title="Kesan Pertama" score={score.impact} description="Dampak profesionalisme" icon={<Sparkles className="h-4 w-4" />} />
        <ScoreCard title="Tingkat Keringkasan" score={score.brevity} description="Seberapa efektif kalimatnya" icon={<Target className="h-4 w-4" />} />
        <ScoreCard title="Tata Bahasa" score={score.style} description="Kerapihan & struktur tulisan" icon={<FileSignature className="h-4 w-4" />} />
      </div>

      <Card className="rounded-3xl shadow-sm border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BotIcon className="h-5 w-5 text-primary" />
            Kesimpulan AI HRD
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground leading-relaxed text-lg">{summary}</p>
        </CardContent>
      </Card>

      <Tabs defaultValue="feedback" className="w-full">
        <TabsList className="grid w-full grid-cols-3 rounded-2xl h-14 bg-muted/50 p-1">
          <TabsTrigger value="feedback" className="rounded-xl font-medium data-[state=active]:shadow-sm">Umpan Balik</TabsTrigger>
          <TabsTrigger value="suggestions" className="rounded-xl font-medium data-[state=active]:shadow-sm">Saran Perbaikan</TabsTrigger>
          <TabsTrigger value="keywords" className="rounded-xl font-medium data-[state=active]:shadow-sm">Cek Kata Kunci</TabsTrigger>
        </TabsList>
        
        <TabsContent value="feedback" className="space-y-4 mt-6 animate-slide-up">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="rounded-3xl border-green-200/50 shadow-sm">
              <CardHeader className="pb-4 bg-green-50/50 dark:bg-green-950/20 rounded-t-3xl border-b border-green-100 dark:border-green-900/30">
                <CardTitle className="text-green-600 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" /> Kekuatan CV Kamu
                </CardTitle>
                <CardDescription>Hal-hal yang sudah bagus dan harus dipertahankan.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-4">
                  {strengths.map((item: string, i: number) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card className="rounded-3xl border-yellow-200/50 shadow-sm">
              <CardHeader className="pb-4 bg-yellow-50/50 dark:bg-yellow-950/20 rounded-t-3xl border-b border-yellow-100 dark:border-yellow-900/30">
                <CardTitle className="text-yellow-600 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" /> Perlu Ditingkatkan
                </CardTitle>
                <CardDescription>Bagian yang bisa membuat CV kamu ditolak oleh sistem.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-4">
                  {weaknesses.map((item: string, i: number) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-yellow-500 mt-2 shrink-0" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="suggestions" className="mt-6 animate-slide-up">
          <Card className="rounded-3xl shadow-sm">
            <CardHeader className="border-b bg-muted/20 rounded-t-3xl">
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" /> Panduan Revisi Langkah-demi-Langkah
              </CardTitle>
              <CardDescription>Ikuti saran ini untuk memperbaiki kalimat di dalam CV kamu.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {suggestions.map((sug: any, i: number) => (
                <div key={i} className="flex gap-4 items-start p-4 rounded-2xl bg-muted/30 border border-border/50">
                  <div className="bg-primary/10 text-primary font-bold w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                    {i+1}
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-bold text-base text-foreground">Bagian: {sug.section}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{sug.advice}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keywords" className="mt-6 animate-slide-up">
          <Card className="rounded-3xl shadow-sm">
            <CardHeader className="border-b bg-muted/20 rounded-t-3xl">
              <CardTitle>Analisis Keyword ATS</CardTitle>
              <CardDescription>Sistem ATS mencari kata kunci ini untuk meloloskan CV. Pastikan kata kunci yang "Hilang" kamu tambahkan jika kamu memang punya skill tersebut.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 pt-6">
              <div>
                <h4 className="font-bold text-sm mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" /> Kata Kunci yang Ditemukan
                </h4>
                {keywords.found.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {keywords.found.map((kw: string, i: number) => (
                      <Badge key={i} variant="secondary" className="px-3 py-1.5 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 rounded-lg">{kw}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Tidak ada kata kunci penting yang terdeteksi.</p>
                )}
              </div>
              
              <div className="pt-6 border-t border-dashed">
                <h4 className="font-bold text-sm mb-4 flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-500" /> Kata Kunci yang Hilang (Sangat Disarankan)
                </h4>
                {keywords.missing.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {keywords.missing.map((kw: string, i: number) => (
                      <Badge key={i} variant="outline" className="px-3 py-1.5 text-muted-foreground border-dashed bg-muted/50 rounded-lg">{kw}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-green-600">Hebat! Semua kata kunci penting sudah ada di CV kamu.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ScoreCard({ title, score, description, icon }: { title: string, score: number, description: string, icon: React.ReactNode }) {
  const getColor = (s: number) => {
    if (s >= 80) return "text-green-500"
    if (s >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  const getBarColor = (s: number) => {
    if (s >= 80) return "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]"
    if (s >= 60) return "bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.4)]"
    return "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]"
  }

  return (
    <Card className="rounded-3xl shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
          {icon} {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-black mb-1">
          <span className={getColor(score)}>{score}</span>
          <span className="text-muted-foreground text-sm font-medium ml-1">/100</span>
        </div>
        <p className="text-xs text-muted-foreground mb-4">{description}</p>
        
        <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${getBarColor(score)}`}
            style={{ width: `${score}%` }}
          />
        </div>
      </CardContent>
    </Card>
  )
}

function BotIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </svg>
  )
}
