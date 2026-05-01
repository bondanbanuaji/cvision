import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, FileText, Zap, ShieldCheck, CheckCircle2, UploadCloud, Bot, FileSearch } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <header className="px-4 lg:px-8 h-20 flex items-center border-b border-border/40 glass sticky top-0 z-50">
        <Link className="flex items-center justify-center group" href="/">
          <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <span className="ml-3 text-xl font-bold tracking-tight">CVision</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" href="/login">
            Masuk
          </Link>
          <Link href="/register">
            <Button size="sm" className="rounded-full px-6 shadow-lg shadow-primary/20">
              Daftar Gratis
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative w-full py-20 md:py-32 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl -z-10" />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-3xl -z-10" />
          
          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="flex flex-col items-center space-y-8 text-center animate-fade-in">
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4 animate-float">
                <Zap className="mr-2 h-4 w-4" />
                Didukung oleh Google Gemini AI
              </div>
              <div className="space-y-4 max-w-4xl">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                  Dapatkan Pekerjaan Impian dengan <br className="hidden md:block" />
                  <span className="gradient-text">CV yang Sempurna</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed leading-relaxed">
                  Unggah CV kamu dan dapatkan saran perbaikan instan dari AI kami. Lolos seleksi sistem ATS HRD dan buat rekruter terkesan dalam hitungan detik.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/register">
                  <Button size="lg" className="rounded-full px-8 h-12 text-base gap-2 shadow-xl shadow-primary/20 animate-pulse-glow">
                    Mulai Analisis Gratis <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* EDUKASI ATS SECTION */}
        <section className="w-full py-20 bg-muted/30 border-y border-border/50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="space-y-6 animate-slide-up">
                <div className="inline-flex items-center rounded-lg bg-secondary px-3 py-1 text-sm font-medium">
                  Tahukah Kamu?
                </div>
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Apa itu Sistem ATS?</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  <strong>Applicant Tracking System (ATS)</strong> adalah robot software yang digunakan oleh HRD untuk menyaring ribuan CV yang masuk secara otomatis.
                </p>
                <div className="space-y-4 bg-background p-6 rounded-2xl border shadow-sm">
                  <div className="flex gap-4">
                    <div className="mt-1 bg-red-100 dark:bg-red-900/30 p-2 rounded-full h-fit">
                      <ShieldCheck className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Tanpa Format ATS</h4>
                      <p className="text-sm text-muted-foreground mt-1">CV dengan desain rumit, grafik, atau tabel tidak bisa dibaca oleh robot ATS. Akibatnya, CV kamu langsung ditolak sebelum dibaca manusia.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="mt-1 bg-green-100 dark:bg-green-900/30 p-2 rounded-full h-fit">
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Format ATS Friendly</h4>
                      <p className="text-sm text-muted-foreground mt-1">CV dengan struktur rapi dan kata kunci yang tepat akan lolos seleksi robot dan masuk ke tahap wawancara.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative animate-slide-up delay-200">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-3xl blur-2xl" />
                <div className="relative bg-card border rounded-3xl p-8 shadow-xl">
                  <h3 className="text-xl font-bold mb-6 text-center">Simulasi Seleksi HRD</h3>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className={`flex items-center p-4 rounded-xl border ${i === 2 ? 'border-primary bg-primary/5' : 'bg-muted/50 opacity-50'}`}>
                        <div className="flex-1 space-y-2">
                          <div className={`h-2 w-24 rounded-full ${i === 2 ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                          <div className={`h-2 w-32 rounded-full ${i === 2 ? 'bg-primary/60' : 'bg-muted-foreground/20'}`} />
                        </div>
                        {i === 2 ? (
                          <Badge variant="default" className="bg-green-500 hover:bg-green-600">Lolos ATS</Badge>
                        ) : (
                          <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-900">Ditolak</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CARA KERJA SECTION */}
        <section className="w-full py-20">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16 animate-slide-up">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Sangat Mudah Digunakan</h2>
              <p className="mt-4 text-lg text-muted-foreground">Tidak perlu paham hal teknis. Kami buat semuanya semudah mungkin untuk kamu.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connecting line for desktop */}
              <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-border -z-10" />
              
              <div className="flex flex-col items-center text-center space-y-4 animate-slide-up delay-100">
                <div className="w-24 h-24 rounded-full bg-background border-4 border-muted flex items-center justify-center relative shadow-sm">
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center border-2 border-background">1</div>
                  <UploadCloud className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold mt-4">Unggah CV PDF</h3>
                <p className="text-muted-foreground leading-relaxed">Upload CV lama kamu dalam format PDF. Tidak ada batasan bahasa, AI kami memahami Bahasa Indonesia maupun Inggris.</p>
              </div>

              <div className="flex flex-col items-center text-center space-y-4 animate-slide-up delay-200">
                <div className="w-24 h-24 rounded-full bg-background border-4 border-muted flex items-center justify-center relative shadow-sm">
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center border-2 border-background">2</div>
                  <Bot className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold mt-4">Tunggu Analisis AI</h3>
                <p className="text-muted-foreground leading-relaxed">Dalam 10 detik, AI kami akan membedah CV kamu layaknya HRD profesional dengan pengalaman 10 tahun.</p>
              </div>

              <div className="flex flex-col items-center text-center space-y-4 animate-slide-up delay-300">
                <div className="w-24 h-24 rounded-full bg-background border-4 border-muted flex items-center justify-center relative shadow-sm">
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center border-2 border-background">3</div>
                  <FileSearch className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold mt-4">Dapatkan Saran Perbaikan</h3>
                <p className="text-muted-foreground leading-relaxed">Terima laporan lengkap tentang kelemahan CV kamu, kata kunci yang kurang, dan kalimat yang perlu diperbaiki.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FITUR UNGGULAN SECTION */}
        <section className="w-full py-20 bg-muted/30 border-t border-border/50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Mengapa CVision Berbeda?</h2>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="group p-8 bg-background rounded-3xl border shadow-sm hover:shadow-md transition-all hover:border-primary/30">
                <div className="mb-4 p-3 bg-primary/10 rounded-2xl w-fit group-hover:scale-110 transition-transform">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Feedback Instan</h3>
                <p className="text-muted-foreground leading-relaxed">Tidak perlu bayar mahal untuk review CV ke konsultan karir. Dapatkan hasil dalam hitungan detik, gratis.</p>
              </div>
              <div className="group p-8 bg-background rounded-3xl border shadow-sm hover:shadow-md transition-all hover:border-primary/30">
                <div className="mb-4 p-3 bg-primary/10 rounded-2xl w-fit group-hover:scale-110 transition-transform">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Pendeteksi Kata Kunci</h3>
                <p className="text-muted-foreground leading-relaxed">Ketahui kata kunci penting apa saja yang terlewat di CV kamu agar lebih dilirik oleh sistem ATS.</p>
              </div>
              <div className="group p-8 bg-background rounded-3xl border shadow-sm hover:shadow-md transition-all hover:border-primary/30">
                <div className="mb-4 p-3 bg-primary/10 rounded-2xl w-fit group-hover:scale-110 transition-transform">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Saran Konkret</h3>
                <p className="text-muted-foreground leading-relaxed">Bukan cuma kasih skor jelek. Kami memberitahu kalimat mana persisnya yang salah dan bagaimana cara memperbaikinya.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section className="w-full py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5" />
          <div className="container px-4 md:px-6 mx-auto relative z-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-6">Siap Membuat HRD Terkesan?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Bergabunglah dengan ribuan pencari kerja lainnya yang sudah membuktikan kehebatan AI kami.
            </p>
            <Link href="/register">
              <Button size="lg" className="rounded-full px-10 h-14 text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                Buat Akun Gratis Sekarang
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="w-full py-8 px-4 md:px-6 border-t bg-card">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <span className="font-bold">CVision</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CVision Indonesia. Dibuat dengan ❤️ untuk pencari kerja.
          </p>
        </div>
      </footer>
    </div>
  )
}

function Badge({ children, className, variant = "default" }: any) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}>{children}</span>
}
