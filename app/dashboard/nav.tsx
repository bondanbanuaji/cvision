"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, History, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

export function DashboardNav({ collapsed, userName, userEmail }: { collapsed?: boolean, userName: string, userEmail: string }) {
  const pathname = usePathname()

  const navItems = [
    { name: "Analisis CV", href: "/dashboard", icon: LayoutDashboard },
    { name: "Riwayat", href: "/dashboard/history", icon: History },
  ]

  const userInitials = userName.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2)

  return (
    <div className="flex flex-col h-full">
      <div className={`flex-1 py-8 space-y-2 ${collapsed ? "px-3" : "px-4"}`}>
        <p className={`text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 mb-4 ${collapsed ? "text-center" : "px-3"}`}>
          {collapsed ? "•••" : "Menu Utama"}
        </p>
        
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href} title={collapsed ? item.name : undefined}>
              <span className={`
                flex items-center group transition-all duration-300 relative
                ${collapsed ? "justify-center h-12 w-12 mx-auto rounded-2xl" : "py-3 px-4 rounded-2xl mb-2"}
                ${isActive 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                  : "text-muted-foreground hover:bg-primary/5 hover:text-primary"}
              `}>
                <item.icon className={`${collapsed ? "h-5 w-5" : "mr-3.5 h-5 w-5"} transition-transform duration-300 group-hover:scale-110`} />
                {!collapsed && (
                  <span className="font-semibold text-sm tracking-tight">{item.name}</span>
                )}
                {isActive && !collapsed && (
                  <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-primary-foreground animate-pulse" />
                )}
              </span>
            </Link>
          )
        })}
      </div>

      <div className={`mt-auto border-t border-border/40 p-4 transition-all duration-500`}>
        <div className={`
          bg-muted/30 border border-border/50 rounded-3xl transition-all duration-300 overflow-hidden
          ${collapsed ? "p-1.5" : "p-3"}
        `}>
          {!collapsed ? (
            <div className="flex items-center gap-3 mb-3 px-1 pt-1">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold shadow-inner shrink-0">
                {userInitials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-foreground truncate leading-tight">{userName}</p>
                <p className="text-[11px] text-muted-foreground truncate mt-0.5">{userEmail}</p>
              </div>
            </div>
          ) : (
            <div className="h-10 w-10 mx-auto rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold shadow-inner mb-1">
              {userInitials}
            </div>
          )}
          
          <Button 
            variant="ghost" 
            title={collapsed ? "Keluar" : undefined}
            className={`
              transition-all duration-300 rounded-2xl h-10
              text-muted-foreground hover:text-destructive hover:bg-destructive/10
              ${collapsed ? "w-10 p-0 flex justify-center mx-auto" : "w-full justify-start px-3"}
            `} 
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className={`${collapsed ? "h-4 w-4" : "mr-3 h-4 w-4"}`} />
            {!collapsed && <span className="font-semibold text-xs">Keluar Sesi</span>}
          </Button>
        </div>
      </div>
    </div>
  )
}
