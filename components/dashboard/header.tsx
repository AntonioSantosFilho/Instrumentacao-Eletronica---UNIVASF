"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
import { cn } from "@/lib/utils"

interface DashboardHeaderProps {
  lastUpdate?: string
  unresolvedAlerts?: number
}

export function DashboardHeader({
  lastUpdate,
  unresolvedAlerts = 0,
}: DashboardHeaderProps) {
  return (
    <div className="bg-[#0057B8] text-white rounded-xl p-6 shadow-lg">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Image
                src="/logo.png"
                alt="PharmaTrack Logo"
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">PharmaTrack</h1>
              <p className="text-white/90">Monitoramento em Tempo Real</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {lastUpdate && (
            <span className="text-xs text-white/80 hidden md:block bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
              Atualizado: {new Date(lastUpdate).toLocaleString("pt-BR")}
            </span>
          )}

          <Button variant="outline" size="icon" className="relative bg-white/10 hover:bg-white/20 border-white/20 text-white">
            <Bell className="h-4 w-4" />
            {unresolvedAlerts > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#DC2626] text-[10px] font-bold text-white flex items-center justify-center shadow-lg">
                {unresolvedAlerts > 9 ? "9+" : unresolvedAlerts}
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
