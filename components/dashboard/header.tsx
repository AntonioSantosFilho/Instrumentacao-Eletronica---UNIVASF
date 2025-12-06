"use client"

import { Button } from "@/components/ui/button"
import { RefreshCw, Settings, Bell, Truck } from "lucide-react"
import { cn } from "@/lib/utils"

interface DashboardHeaderProps {
  lastUpdate?: string
  isLoading?: boolean
  onRefresh?: () => void
  unresolvedAlerts?: number
}

export function DashboardHeader({
  lastUpdate,
  isLoading = false,
  onRefresh,
  unresolvedAlerts = 0,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Truck className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Transporte de Vacinas</h1>
            <p className="text-muted-foreground">Monitoramento em Tempo Real</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {lastUpdate && (
          <span className="text-xs text-muted-foreground hidden md:block">
            Atualizado: {new Date(lastUpdate).toLocaleString("pt-BR")}
          </span>
        )}

        <Button variant="outline" size="icon" className="relative bg-transparent">
          <Bell className="h-4 w-4" />
          {unresolvedAlerts > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
              {unresolvedAlerts > 9 ? "9+" : unresolvedAlerts}
            </span>
          )}
        </Button>

        <Button variant="outline" size="icon" onClick={onRefresh} disabled={isLoading}>
          <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
        </Button>

        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
