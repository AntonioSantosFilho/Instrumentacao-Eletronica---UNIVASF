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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Sensor GPS</CardTitle>
        <MapPin className={cn("h-4 w-4", isOnline ? "text-emerald-500" : "text-zinc-400")} />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="text-lg font-bold text-foreground">
                {gps ? `${gps.latitude.toFixed(4)}, ${gps.longitude.toFixed(4)}` : "--"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {gps ? "Coordenadas GPS" : "Sem localização"}
              </p>
            </div>
            <Badge variant={isOnline ? "default" : "secondary"}>
              {isOnline ? "Online" : "Offline"}
            </Badge>
          </div>

          {timestamp && (
            <div className="pt-3 border-t space-y-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Última Leitura</span>
              </div>
              <p className="text-sm font-medium">
                {timestamp.toLocaleString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-xs text-muted-foreground">{getTimeAgo(timestamp)}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

