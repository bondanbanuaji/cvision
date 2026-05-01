import Link from "next/link"
import { FileText, CheckCircle2 } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding & Illustration (Hidden on mobile) */}
      <div className="hidden lg:flex flex-1 flex-col justify-between bg-primary/5 p-12 border-r relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-secondary/20 rounded-full blur-3xl" />

        <div className="relative z-10">
          <Link className="flex items-center gap-2 text-2xl font-bold" href="/">
            <div className="bg-primary/10 p-2 rounded-xl">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            CVision
          </Link>
          
          <div className="mt-24 space-y-8">
            <h1 className="text-4xl font-bold leading-tight">
              Investasi Terbaik untuk <br/> Karir Masa Depanmu.
            </h1>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 dark:bg-green-900/30 p-1 rounded-full">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-muted-foreground font-medium">Analisis CV didukung AI canggih</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-green-100 dark:bg-green-900/30 p-1 rounded-full">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-muted-foreground font-medium">Lolos seleksi ATS HRD dengan mudah</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-green-100 dark:bg-green-900/30 p-1 rounded-full">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-muted-foreground font-medium">Saran perbaikan kalimat spesifik</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative z-10 text-sm text-muted-foreground font-medium">
          © {new Date().getFullYear()} CVision Indonesia.
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background relative">
        {/* Mobile Header (Only visible on mobile) */}
        <Link className="lg:hidden absolute top-8 left-8 flex items-center gap-2 text-xl font-bold" href="/">
          <FileText className="h-5 w-5 text-primary" />
          CVision
        </Link>
        
        <div className="w-full max-w-md animate-fade-in">
          {children}
        </div>
      </div>
    </div>
  )
}
