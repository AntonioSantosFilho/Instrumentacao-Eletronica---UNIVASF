"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface GPSSensorCardProps {
  gps: { latitude: number; longitude: number; timestamp: string } | null
}

export function GPSSensorCard({ gps }: GPSSensorCardProps) {
  const isOnline = gps !== null
  const timestamp = gps?.timestamp ? new Date(gps.timestamp) : null

  // Calcular tempo desde a última leitura
  const getTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - timestamp.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Agora"
    if (diffMins < 60) return `${diffMins} min atrás`
    if (diffHours < 24) return `${diffHours}h atrás`
    return `${diffDays} dias atrás`
  }

  return (
    <Card className="bg-white border-[#D0D3D6] shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-[#D0D3D6]">
        <CardTitle className="text-sm font-semibold text-[#2E3438]">Sensor GPS</CardTitle>
        <div className={cn("p-2 rounded-lg", isOnline ? "bg-[#6AB7FF]/10" : "bg-[#D0D3D6]/50")}>
          <MapPin className={cn("h-5 w-5", isOnline ? "text-[#0057B8]" : "text-[#D0D3D6]")} />
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="text-lg font-bold text-[#0057B8] font-mono">
                {gps ? `${gps.latitude.toFixed(4)}, ${gps.longitude.toFixed(4)}` : "--"}
              </div>
              <p className="text-xs text-[#2E3438]/70 mt-1">
                {gps ? "Coordenadas GPS" : "Sem localização"}
              </p>
            </div>
            <Badge className={cn(isOnline ? "bg-[#22C55E] text-white" : "bg-[#D0D3D6] text-[#2E3438]")}>
              {isOnline ? "Online" : "Offline"}
            </Badge>
          </div>

          {timestamp && (
            <div className="pt-3 border-t border-[#D0D3D6] space-y-1">
              <div className="flex items-center gap-2 text-xs text-[#2E3438]/70">
                <Clock className="h-3 w-3" />
                <span>Última Leitura</span>
              </div>
              <p className="text-sm font-semibold text-[#2E3438]">
                {timestamp.toLocaleString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-xs text-[#2E3438]/60">{getTimeAgo(timestamp)}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

