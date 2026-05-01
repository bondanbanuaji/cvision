"use client"

import { useState } from "react"
import Link from "next/link"
import { FileText, ChevronLeft, ChevronRight } from "lucide-react"
import { DashboardNav } from "./nav"
import { Button } from "@/components/ui/button"

export function SidebarDesktop({ userName, userEmail }: { userName: string, userEmail: string }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={`border-r border-border/50 bg-card hidden md:flex flex-col sticky top-0 h-screen shrink-0 transition-all duration-300 ease-in-out ${collapsed ? "w-20" : "w-72"}`}>
      {/* Decorative gradient */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      
      <div className={`h-20 flex items-center ${collapsed ? "justify-center px-0" : "px-6"} border-b border-border/50 relative z-10 transition-all`}>
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center group focus:outline-none"
          title={collapsed ? "Buka Sidebar" : "Tutup Sidebar"}
        >
          <div className="bg-primary/10 p-1.5 rounded-lg group-hover:bg-primary/20 transition-colors">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          {!collapsed && (
            <span className="ml-2.5 text-lg font-bold tracking-tight whitespace-nowrap overflow-hidden transition-all">CVision</span>
          )}
        </button>
      </div>
      
      <div className="flex-1 relative z-10 flex flex-col overflow-hidden">
        <DashboardNav collapsed={collapsed} userName={userName} userEmail={userEmail} />
      </div>

    </aside>
  )
}
