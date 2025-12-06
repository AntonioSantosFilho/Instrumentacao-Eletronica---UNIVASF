"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Fingerprint, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface TouchCardProps {
  touch: { value: boolean; timestamp: string } | null
}

export function TouchCard({ touch }: TouchCardProps) {
  const isActive = touch?.value === true
  const lastTouchTime = touch?.timestamp ? new Date(touch.timestamp) : null

  // Calcular tempo desde o último toque
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
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Fingerprint className="h-5 w-5" />
          Sensor de Toque
        </CardTitle>
        <CardDescription>Última ativação do dispositivo</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "h-12 w-12 rounded-full flex items-center justify-center",
                  isActive ? "bg-emerald-500/10" : "bg-zinc-500/10",
                )}
              >
                <Fingerprint
                  className={cn("h-6 w-6", isActive ? "text-emerald-500" : "text-zinc-400")}
                />
              </div>
              <div>
                <p className="text-sm font-medium">Status</p>
                <p className={cn("text-lg font-bold", isActive ? "text-emerald-500" : "text-zinc-400")}>
                  {isActive ? "Ativado" : "Desativado"}
                </p>
              </div>
            </div>
            <Badge variant={isActive ? "default" : "secondary"}>
              {isActive ? "Ativo" : "Inativo"}
            </Badge>
          </div>

          {lastTouchTime && (
            <div className="pt-4 border-t space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Última Ativação</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  {lastTouchTime.toLocaleString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="text-xs text-muted-foreground">{getTimeAgo(lastTouchTime)}</p>
              </div>
            </div>
          )}

          {!touch && (
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground text-center">Nenhum dado disponível</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

