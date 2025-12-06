"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, Thermometer, DoorOpen, MapPin, Fingerprint, Wifi, Battery, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface Alert {
  id: number
  timestamp: string
  alert_type: string
  severity: string
  description: string
  resolved: boolean
}

interface AlertsListProps {
  alerts: Alert[]
  onResolve?: (id: number) => void
}

const alertIcons: Record<string, React.ElementType> = {
  temperature: Thermometer,
  door: DoorOpen,
  location: MapPin,
  touch: Fingerprint,
  connection: Wifi,
  battery: Battery,
}

const severityColors: Record<string, string> = {
  low: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  high: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  critical: "bg-red-500/10 text-red-500 border-red-500/20",
}

const severityLabels: Record<string, string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
  critical: "Crítica",
}

export function AlertsList({ alerts, onResolve }: AlertsListProps) {
  const handleResolve = async (id: number) => {
    try {
      await fetch("/api/alerts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, resolved: true }),
      })
      onResolve?.(id)
    } catch (error) {
      console.error("Erro ao resolver alerta:", error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Alertas Recentes
        </CardTitle>
        <CardDescription>Últimos alertas do sistema de monitoramento</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Check className="h-12 w-12 mb-2 text-emerald-500" />
              <p>Nenhum alerta registrado</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => {
                const Icon = alertIcons[alert.alert_type] || AlertTriangle

                return (
                  <div
                    key={alert.id}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg border transition-colors",
                      alert.resolved ? "bg-muted/30 opacity-60" : "bg-card hover:bg-muted/50",
                    )}
                  >
                    <div className={cn("p-2 rounded-full", severityColors[alert.severity])}>
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className={severityColors[alert.severity]}>
                          {severityLabels[alert.severity]}
                        </Badge>
                        {alert.resolved && <Badge variant="secondary">Resolvido</Badge>}
                      </div>
                      <p className="text-sm font-medium text-foreground">{alert.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(alert.timestamp).toLocaleString("pt-BR")}
                      </p>
                    </div>

                    {!alert.resolved && (
                      <Button size="sm" variant="outline" onClick={() => handleResolve(alert.id)}>
                        Resolver
                      </Button>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
