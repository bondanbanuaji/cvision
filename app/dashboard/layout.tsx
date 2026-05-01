import Link from "next/link"
import { redirect } from "next/navigation"
import { FileText, Menu } from "lucide-react"
import { auth } from "@/auth"
import { DashboardNav } from "@/app/dashboard/nav"
import { SidebarDesktop } from "./sidebar-desktop"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const userName = session.user.name || "Pengguna"
  const userEmail = session.user.email || ""

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Sidebar Desktop */}
      <SidebarDesktop userName={userName} userEmail={userEmail} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Mobile Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-border/40 md:hidden bg-background/60 backdrop-blur-xl sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-110 active:scale-95 transition-all group">
                <FileText className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span className="sr-only">Buka menu</span>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] p-0 border-r border-border/40 bg-card/95 backdrop-blur-2xl flex flex-col">
                <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
                <SheetDescription className="sr-only">Navigasi halaman dashboard</SheetDescription>
                <div className="h-24 flex items-center px-8 border-b border-border/40">
                  <div className="flex items-center">
                    <div className="bg-primary h-10 w-10 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                      <FileText className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="ml-3 text-xl font-black tracking-tighter">CVision</span>
                  </div>
                </div>
                <div className="flex-1 flex flex-col bg-transparent">
                  <DashboardNav userName={userName} userEmail={userEmail} />
                </div>
              </SheetContent>
            </Sheet>
            
            <Link className="flex items-center group" href="/">
              <span className="text-lg font-black tracking-tighter group-hover:text-primary transition-colors">CVision</span>
            </Link>
          </div>

          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold text-xs shadow-md">
            {userName.charAt(0).toUpperCase()}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
          <div className="max-w-5xl mx-auto animate-fade-in">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
