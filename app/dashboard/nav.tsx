"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, History, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

export function DashboardNav({ collapsed, userName, userEmail }: { collapsed?: boolean, userName: string, userEmail: string }) {
  const pathname = usePathname()

  const navItems = [
    { name: "Analisis CV", href: "/dashboard", icon: LayoutDashboard },
    { name: "Riwayat", href: "/dashboard/history", icon: History },
  ]

  return (
    <>
      <div className={`flex-1 py-6 space-y-2 ${collapsed ? "px-2" : "px-4"}`}>
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href} title={collapsed ? item.name : undefined}>
              <span className={`flex items-center py-2.5 text-sm font-medium rounded-xl mb-1.5 transition-all ${collapsed ? "justify-center px-0" : "px-3"} ${isActive ? "bg-primary/10 text-primary shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                <item.icon className={`${collapsed ? "h-5 w-5" : "mr-2.5 h-4 w-4"}`} />
                {!collapsed && item.name}
              </span>
            </Link>
          )
        })}
      </div>
      <div className={`border-t border-border/50 bg-muted/20 transition-all ${collapsed ? "p-2" : "p-4"}`}>
        {!collapsed && (
          <div className="mb-4 px-2">
            <p className="text-sm font-bold text-foreground">{userName}</p>
            <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
          </div>
        )}
        <Button 
          variant="outline" 
          title={collapsed ? "Keluar" : undefined}
          size="sm"
          className={`transition-colors rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/20 ${collapsed ? "w-full justify-center px-0" : "w-full justify-start"}`} 
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className={`${collapsed ? "h-4 w-4" : "mr-2 h-3.5 w-3.5"}`} />
          {!collapsed && "Keluar"}
        </Button>
      </div>
    </>
  )
}
