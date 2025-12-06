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
  low: "bg-[#6AB7FF]/10 text-[#0057B8] border-[#6AB7FF]/30",
  medium: "bg-[#FACC15]/10 text-[#FACC15] border-[#FACC15]/30",
  high: "bg-[#FACC15]/20 text-[#FACC15] border-[#FACC15]/40",
  critical: "bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/30",
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
    <Card className="bg-white border-[#D0D3D6] shadow-md">
      <CardHeader className="border-b border-[#D0D3D6]">
        <CardTitle className="flex items-center gap-2 text-[#2E3438]">
          <AlertTriangle className="h-5 w-5 text-[#DC2626]" />
          Alertas Recentes
        </CardTitle>
        <CardDescription className="text-[#2E3438]/70">Últimos alertas do sistema de monitoramento</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-[#2E3438]/60">
              <Check className="h-12 w-12 mb-2 text-[#22C55E]" />
              <p className="font-medium">Nenhum alerta registrado</p>
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
                      alert.resolved ? "bg-[#F4F6F8] opacity-60 border-[#D0D3D6]" : "bg-white hover:bg-[#F4F6F8] border-[#D0D3D6]",
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
                        {alert.resolved && <Badge className="bg-[#22C55E] text-white">Resolvido</Badge>}
                      </div>
                      <p className="text-sm font-semibold text-[#2E3438]">{alert.description}</p>
                      <p className="text-xs text-[#2E3438]/70 mt-1">
                        {new Date(alert.timestamp).toLocaleString("pt-BR")}
                      </p>
                    </div>

                    {!alert.resolved && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleResolve(alert.id)}
                        className="bg-[#0057B8] hover:bg-[#0057B8]/90 text-white border-[#0057B8]"
                      >
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
