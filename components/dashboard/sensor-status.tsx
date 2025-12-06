"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Thermometer, DoorOpen, MapPin, Fingerprint, Activity } from "lucide-react"
import { cn } from "@/lib/utils"

interface SensorStatusProps {
  temperature: number | null
  doorState: string | null
  gps: { latitude: number; longitude: number } | null
  touch: { value: boolean; timestamp: string } | null
}

export function SensorStatus({ temperature, doorState, gps, touch }: SensorStatusProps) {
  const sensors = [
    {
      name: "Temperatura",
      icon: Thermometer,
      status: temperature !== null ? "online" : "offline",
      value: temperature !== null ? `${temperature.toFixed(1)}°C` : "--",
      color: temperature !== null ? "text-emerald-500" : "text-zinc-400",
    },
    {
      name: "Porta",
      icon: DoorOpen,
      status: doorState !== null ? "online" : "offline",
      value: doorState === "closed" ? "Fechada" : doorState === "open" ? "Aberta" : "--",
      color: doorState !== null ? "text-emerald-500" : "text-zinc-400",
    },
    {
      name: "GPS",
      icon: MapPin,
      status: gps !== null ? "online" : "offline",
      value: gps ? `${gps.latitude.toFixed(4)}, ${gps.longitude.toFixed(4)}` : "--",
      color: gps !== null ? "text-emerald-500" : "text-zinc-400",
    },
    {
      name: "Touch",
      icon: Fingerprint,
      status: touch !== null ? "online" : "offline",
      value: touch 
        ? `${touch.value ? "Ativado" : "Desativado"} - ${new Date(touch.timestamp).toLocaleString("pt-BR")}`
        : "--",
      color: touch !== null ? "text-emerald-500" : "text-zinc-400",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Status dos Sensores
        </CardTitle>
        <CardDescription>Monitoramento em tempo real de todos os sensores</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sensors.map((sensor) => {
            const Icon = sensor.icon
            const isOnline = sensor.status === "online"

            return (
              <div key={sensor.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-full", isOnline ? "bg-emerald-500/10" : "bg-zinc-500/10")}>
                    <Icon className={cn("h-4 w-4", sensor.color)} />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{sensor.name}</p>
                    <p className="text-xs text-muted-foreground">{sensor.value}</p>
                  </div>
                </div>
                <Badge variant={isOnline ? "default" : "secondary"}>{isOnline ? "Online" : "Offline"}</Badge>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
