"use client"

import { useDashboard } from "@/lib/hooks/use-dashboard"
import { DashboardHeader } from "@/components/dashboard/header"
import { TemperatureSensorCard } from "@/components/dashboard/temperature-sensor-card"
import { DoorSensorCard } from "@/components/dashboard/door-sensor-card"
import { GPSSensorCard } from "@/components/dashboard/gps-sensor-card"
import { TouchSensorCard } from "@/components/dashboard/touch-card"
import { TemperatureChart } from "@/components/dashboard/temperature-chart"
import { GPSChart } from "@/components/dashboard/gps-chart"
import { GPSMap } from "@/components/dashboard/gps-map"
import { AlertsList } from "@/components/dashboard/alerts-list"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function DashboardPage() {
  const { data, error, isLoading, refresh } = useDashboard("default")

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>
            Não foi possível carregar os dados do dashboard. Verifique a conexão com o servidor.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (isLoading || !data || !data.stats) {
    return (
      <div className="min-h-screen bg-background p-6 space-y-6">
        <Skeleton className="h-16 w-full" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F4F6F8]">
      <div className="container mx-auto p-6 space-y-8">
        <DashboardHeader
          lastUpdate={data.stats?.lastTemperature?.timestamp ? new Date(data.stats.lastTemperature.timestamp).toLocaleString() : "N/A"}
          isLoading={isLoading}
          onRefresh={refresh}
          unresolvedAlerts={data.stats?.unresolvedAlerts || 0}
        />

        {/* Cards dos 4 Sensores */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <TemperatureSensorCard temperature={data.stats?.lastTemperature || null} />
          <DoorSensorCard doorState={data.stats?.lastDoorState || null} />
          <GPSSensorCard gps={data.stats?.lastGPS || null} />
          <TouchSensorCard touch={data.stats?.lastTouch || null} />
        </div>

        {/* Gráficos de Evolução Temporal */}
        <div className="grid gap-6 lg:grid-cols-2">
          <TemperatureChart data={data.tempHistory || []} />
          <GPSChart data={data.gpsHistory || []} />
        </div>

        {/* Mapa GPS e Alertas */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <GPSMap 
              location={data.stats?.lastGPS ? { latitude: data.stats.lastGPS.latitude, longitude: data.stats.lastGPS.longitude } : null} 
              history={data.gpsHistory || []} 
            />
          </div>
          <div>
            <AlertsList alerts={data.recentAlerts || []} onResolve={() => refresh()} />
          </div>
        </div>
      </div>
    </div>
  )
}
