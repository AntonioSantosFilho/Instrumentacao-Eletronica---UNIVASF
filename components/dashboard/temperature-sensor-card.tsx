"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Thermometer, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface TemperatureSensorCardProps {
  temperature: { temperature: number; timestamp: string } | null
}

export function TemperatureSensorCard({ temperature }: TemperatureSensorCardProps) {
  const isOnline = temperature !== null
  const tempValue = temperature?.temperature
  const timestamp = temperature?.timestamp ? new Date(temperature.timestamp) : null

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

  // Verificar se está dentro da faixa ideal (2-8°C)
  const isInRange = tempValue !== null && tempValue >= 2 && tempValue <= 8

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Sensor de Temperatura</CardTitle>
        <Thermometer className={cn("h-4 w-4", isOnline ? "text-emerald-500" : "text-zinc-400")} />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className={cn("text-2xl font-bold", isInRange ? "text-emerald-500" : "text-orange-500")}>
                {tempValue !== null ? `${Number(tempValue).toFixed(1)}°C` : "--"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {isInRange ? "Dentro da faixa ideal" : tempValue !== null ? "Fora da faixa ideal" : "Sem dados"}
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

