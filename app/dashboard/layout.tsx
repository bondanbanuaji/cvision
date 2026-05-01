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
        <header className="h-16 flex items-center px-4 border-b md:hidden bg-card/80 backdrop-blur-md sticky top-0 z-50">
          <Sheet>
            <SheetTrigger render={
              <Button variant="ghost" className="mr-3 w-10 h-10 p-0 flex items-center justify-center rounded-full">
                <Menu className="!h-6 !w-6" />
                <span className="sr-only">Buka menu</span>
              </Button>
            } />
            <SheetContent side="left" className="w-72 p-0 flex flex-col">
              <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
              <SheetDescription className="sr-only">Navigasi halaman dashboard</SheetDescription>
              <div className="h-20 flex items-center px-6 border-b border-border/50 relative z-10">
                <Link className="flex items-center group" href="/">
                  <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <span className="ml-3 text-xl font-bold tracking-tight">CVision</span>
                </Link>
              </div>
              <div className="flex-1 flex flex-col">
                <DashboardNav userName={userName} userEmail={userEmail} />
              </div>
            </SheetContent>
          </Sheet>
          <Link className="flex items-center" href="/">
            <span className="text-lg font-bold tracking-tight">CVision</span>
          </Link>
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
