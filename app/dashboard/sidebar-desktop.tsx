"use client"

import { useState } from "react"
import Link from "next/link"
import { FileText, ChevronLeft, ChevronRight } from "lucide-react"
import { DashboardNav } from "./nav"
import { Button } from "@/components/ui/button"

export function SidebarDesktop({ userName, userEmail }: { userName: string, userEmail: string }) {
  const [collapsed, setCollapsed] = useState(true)

  return (
    <aside className={`
      border-r border-border/40 bg-card/60 backdrop-blur-xl
      hidden md:flex flex-col sticky top-0 h-screen shrink-0 
      transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
      ${collapsed ? "w-24" : "w-80"}
    `}>
      {/* Premium Gradient Backgrounds */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-primary/[0.01] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-primary/[0.05] to-transparent pointer-events-none" />
      
      <div className={`
        h-24 flex items-center px-6 relative z-10 
        ${collapsed ? "justify-center" : "justify-start"}
      `}>
        <div className="flex items-center group cursor-pointer">
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="h-11 w-11 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-110 active:scale-95 transition-all duration-300 shrink-0"
            title={collapsed ? "Buka Sidebar" : "Tutup Sidebar"}
          >
            <FileText className="h-6 w-6 text-primary-foreground" />
          </button>
          {!collapsed && (
            <Link href="/" className="ml-3.5 group/text">
              <span className="text-2xl font-black tracking-tighter text-foreground group-hover/text:text-primary transition-colors">
                CVision
              </span>
            </Link>
          )}
        </div>
      </div>
      
      <div className="flex-1 relative z-10 flex flex-col overflow-hidden">
        <DashboardNav collapsed={collapsed} userName={userName} userEmail={userEmail} />
      </div>

      <div className="h-8 pointer-events-none bg-gradient-to-t from-card to-transparent absolute bottom-0 w-full z-20" />
    </aside>
  )
}
