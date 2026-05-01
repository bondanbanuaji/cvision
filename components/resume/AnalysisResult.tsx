"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, AlertTriangle, Lightbulb, Trophy, Target, FileSignature, Zap, Wand2, ChevronDown, User, Mail, Phone, MapPin, Briefcase, ChevronUp } from "lucide-react"
import { RewriteAssistant } from "@/components/resume/RewriteAssistant"

export function AnalysisResult({ data }: { data: any }) {
  const result = data?.result ?? data
  const jobDescription = data?.jobDescription
  if (!result || !result.score) return null

  const { score, summary, strengths, weaknesses, criticalErrors, suggestions, keywords, personalInfo } = result

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
        <ScoreCard title="Kesan Pertama" score={score.impact} description="Dampak profesionalisme" icon={<Zap className="h-4 w-4" />} />
        <ScoreCard title="Tingkat Keringkasan" score={score.brevity} description="Seberapa efektif kalimatnya" icon={<Target className="h-4 w-4" />} />
        <ScoreCard title="Tata Bahasa" score={score.style} description="Kerapihan & struktur tulisan" icon={<FileSignature className="h-4 w-4" />} />
      </div>

      {personalInfo && (
        <PersonalInfoCard data={personalInfo} />
      )}

      {jobDescription && (
        <JobDescriptionCard description={jobDescription} />
      )}

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
        
        <TabsContent value="feedback" className="mt-6 animate-slide-up">
          <div className="grid gap-4 lg:grid-cols-1">
            <CollapsibleFeedbackCard
              title="Kekuatan CV Kamu"
              description="Hal-hal yang sudah bagus dan harus dipertahankan."
              items={strengths}
              icon={CheckCircle2}
              colorTheme="green"
            />
            
            <CollapsibleFeedbackCard
              title="Perlu Ditingkatkan"
              description="Bagian yang bisa membuat CV kamu ditolak oleh sistem."
              items={weaknesses}
              icon={AlertTriangle}
              colorTheme="amber"
            />

            {(criticalErrors && criticalErrors.length > 0) ? (
              <CollapsibleFeedbackCard
                title="Kesalahan Fatal"
                description="Red flags yang membuat CV langsung dibuang."
                items={criticalErrors}
                icon={XCircle}
                colorTheme="red"
              />
            ) : (
              <Card className="rounded-3xl border-0 ring-1 ring-inset ring-green-500/20 bg-gradient-to-b from-green-50/50 to-transparent dark:from-green-950/20 shadow-sm flex flex-col items-center justify-center text-center p-8 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600" />
                <div className="relative mb-5 mt-4">
                  <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl" />
                  <div className="relative w-16 h-16 bg-green-100 dark:bg-green-900/40 border border-green-200 dark:border-green-800/50 rounded-2xl flex items-center justify-center transform -rotate-3 hover:rotate-6 transition-transform duration-300">
                    <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <h3 className="font-bold text-xl text-green-800 dark:text-green-400 mb-2">Bebas Red Flag!</h3>
                <p className="text-sm text-green-600/80 dark:text-green-400/80 leading-relaxed max-w-[200px]">Tidak ditemukan kesalahan fatal. Pertahankan kerjamu!</p>
              </Card>
            )}
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
                  <div className="space-y-1.5 flex-1">
                    <h4 className="font-bold text-base text-foreground">Bagian: {sug.section}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{sug.advice}</p>
                    <div className="pt-2">
                      <RewriteAssistant
                        advice={`Bagian: ${sug.section}. ${sug.advice}`}
                        trigger={
                          <button className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-full transition-all cursor-pointer">
                            <Wand2 className="h-3 w-3" />
                            Perbaiki Kalimat Ini
                          </button>
                        }
                      />
                    </div>
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

function CollapsibleFeedbackCard({ title, description, items, icon: Icon, colorTheme }: { title: string, description: string, items: string[], icon: any, colorTheme: 'green' | 'amber' | 'red' }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasManyItems = items.length > 3;
  const displayItems = isExpanded ? items : items.slice(0, 3);

  const colors = {
    green: {
      ring: "ring-green-500/20",
      from: "from-green-50/50 dark:from-green-950/20",
      grad: "from-green-400 to-green-600",
      bg: "bg-green-100 dark:bg-green-900/40",
      text: "text-green-600 dark:text-green-400",
      title: "text-green-700 dark:text-green-400",
      blur: "bg-green-500/20 group-hover:bg-green-500/40",
      iconBg: "bg-green-100 dark:bg-green-900/50",
      iconBorder: "border-green-200 dark:border-green-800",
      btnHover: "hover:bg-green-50 dark:hover:bg-green-900/20",
    },
    amber: {
      ring: "ring-amber-500/20",
      from: "from-amber-50/50 dark:from-amber-950/20",
      grad: "from-amber-400 to-amber-600",
      bg: "bg-amber-100 dark:bg-amber-900/40",
      text: "text-amber-600 dark:text-amber-400",
      title: "text-amber-700 dark:text-amber-400",
      blur: "bg-amber-500/20 group-hover:bg-amber-500/40",
      iconBg: "bg-amber-100 dark:bg-amber-900/50",
      iconBorder: "border-amber-200 dark:border-amber-800",
      btnHover: "hover:bg-amber-50 dark:hover:bg-amber-900/20",
    },
    red: {
      ring: "ring-red-500/20",
      from: "from-red-50/50 dark:from-red-950/20",
      grad: "from-red-400 to-red-600",
      bg: "bg-red-100 dark:bg-red-900/40",
      text: "text-red-600 dark:text-red-400",
      title: "text-red-700 dark:text-red-400",
      blur: "bg-red-500/20 group-hover:bg-red-500/40",
      iconBg: "bg-red-100 dark:bg-red-900/50",
      iconBorder: "border-red-200 dark:border-red-800",
      btnHover: "hover:bg-red-50 dark:hover:bg-red-900/20",
    }
  }[colorTheme];

  return (
    <Card className={`rounded-3xl border-0 ring-1 ring-inset ${colors.ring} bg-gradient-to-b ${colors.from} to-transparent shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden`}>
      <div className={`h-1 w-full bg-gradient-to-r ${colors.grad}`} />
      <CardHeader className={`pb-2 ${hasManyItems ? 'cursor-pointer select-none' : ''}`} onClick={() => hasManyItems && setIsExpanded(!isExpanded)}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
          <div className="flex items-center gap-3 mb-1">
            <div className={`p-2.5 rounded-xl ${colors.bg} shrink-0`}>
              <Icon className={`h-5 w-5 ${colors.text}`} />
            </div>
            <div>
              <CardTitle className={`text-lg ${colors.title} flex items-center`}>{title} <span className="text-xs ml-2 opacity-70 bg-background/50 px-2 py-0.5 rounded-full shrink-0">{items.length} poin</span></CardTitle>
              <CardDescription className="text-xs leading-relaxed mt-1">{description}</CardDescription>
            </div>
          </div>
          {hasManyItems && (
            <div className={`p-2 rounded-full transition-transform duration-300 self-end sm:self-auto ${isExpanded ? 'rotate-180' : ''}`}>
              <ChevronDown className={`h-5 w-5 ${colors.text} opacity-70`} />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <ul className="space-y-4">
          {displayItems.map((item, i) => (
            <li key={i} className="flex gap-3.5 text-sm group animate-in fade-in slide-in-from-top-2">
              <div className="mt-0.5 shrink-0 relative">
                <div className={`absolute inset-0 rounded-full blur-sm transition-colors ${colors.blur}`} />
                <div className={`relative h-5 w-5 rounded-full border flex items-center justify-center transition-transform group-hover:scale-110 ${colors.iconBg} ${colors.iconBorder} ${colors.text}`}>
                  <Icon className="h-3 w-3" />
                </div>
              </div>
              <span className="leading-relaxed text-muted-foreground group-hover:text-foreground transition-colors">{item}</span>
            </li>
          ))}
        </ul>
        
        {hasManyItems && (
          <div className="mt-4 pt-2 flex justify-center border-t border-border/50 border-dashed">
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className={`text-xs font-medium px-4 py-2 rounded-full transition-colors flex items-center gap-2 ${colors.text} ${colors.btnHover}`}
            >
              {isExpanded ? 'Tutup Sebagian' : `Lihat ${items.length - 3} Poin Lainnya`}
              <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function PersonalInfoCard({ data }: { data: any }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const { fullName, jobTitle, email, phone, location } = data;

  return (
    <Card className="rounded-3xl border-0 ring-1 ring-inset ring-blue-500/20 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/20 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-blue-400 to-blue-600" />
      <CardHeader className="pb-2 cursor-pointer select-none" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/40 shrink-0">
              <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-lg text-blue-700 dark:text-blue-400 flex items-center">
                Informasi Pribadi
              </CardTitle>
              <CardDescription className="text-xs leading-relaxed mt-1">Data profil yang diekstrak dari CV.</CardDescription>
            </div>
          </div>
          <div className={`p-2 rounded-full transition-transform duration-300 self-end sm:self-auto ${isExpanded ? 'rotate-180' : ''}`}>
            <ChevronDown className="h-5 w-5 text-blue-600 dark:text-blue-400 opacity-70" />
          </div>
        </div>
      </CardHeader>
      
      <div className={`transition-all duration-500 overflow-hidden ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <CardContent className="pt-4 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem icon={<User className="h-4 w-4" />} label="Nama Lengkap" value={fullName} />
            <InfoItem icon={<Briefcase className="h-4 w-4" />} label="Posisi/Jabatan" value={jobTitle} />
            <InfoItem icon={<Mail className="h-4 w-4" />} label="Email" value={email} />
            <InfoItem icon={<Phone className="h-4 w-4" />} label="Nomor Telepon" value={phone} />
            <InfoItem icon={<MapPin className="h-4 w-4" />} label="Lokasi/Domisili" value={location} />
          </div>
        </CardContent>
      </div>
    </Card>
  )
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-2xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100/50 dark:border-blue-800/30">
      <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold text-foreground mt-0.5 break-all">{value || '-'}</p>
      </div>
    </div>
  )
}

function JobDescriptionCard({ description }: { description: string }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="rounded-3xl border-0 ring-1 ring-inset ring-purple-500/20 bg-gradient-to-b from-purple-50/50 to-transparent dark:from-purple-950/20 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-purple-400 to-purple-600" />
      <CardHeader className="pb-2 cursor-pointer select-none" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-900/40 shrink-0">
              <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-lg text-purple-700 dark:text-purple-400 flex items-center">
                Target Posisi / Pekerjaan
              </CardTitle>
              <CardDescription className="text-xs leading-relaxed mt-1">Deskripsi lowongan yang menjadi acuan penilaian CV kamu.</CardDescription>
            </div>
          </div>
          <div className={`p-2 rounded-full transition-transform duration-300 self-end sm:self-auto ${isExpanded ? 'rotate-180' : ''}`}>
            <ChevronDown className="h-5 w-5 text-purple-600 dark:text-purple-400 opacity-70" />
          </div>
        </div>
      </CardHeader>
      
      <div className={`transition-all duration-500 overflow-hidden ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <CardContent className="pt-4 pb-6">
          <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100/50 dark:border-purple-800/30">
            <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
              {description}
            </p>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
