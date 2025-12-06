"use client"

import { useDashboard, useGPSHistory } from "@/lib/hooks/use-dashboard"
import { DashboardHeader } from "@/components/dashboard/header"
import { VaccineStatus } from "@/components/dashboard/vaccine-status"
import { TemperatureChart } from "@/components/dashboard/temperature-chart"
import { AlertsList } from "@/components/dashboard/alerts-list"
import { GPSMap } from "@/components/dashboard/gps-map"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function DashboardPage() {
  const { data, error, isLoading, refresh } = useDashboard("default")
  const { data: gpsHistory } = useGPSHistory("default", 20)

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
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto p-6 space-y-8">
        <DashboardHeader
          lastUpdate={data.stats?.lastTemperature?.timestamp ? new Date(data.stats.lastTemperature.timestamp).toLocaleString() : "N/A"}
          isLoading={isLoading}
          onRefresh={refresh}
          unresolvedAlerts={data.stats?.unresolvedAlerts || 0}
        />

        <VaccineStatus
          temperature={data.stats?.lastTemperature?.temperature}
          location={data.stats?.lastGPS ? { lat: data.stats.lastGPS.latitude, lng: data.stats.lastGPS.longitude } : undefined}
          status={data.stats?.unresolvedAlerts > 0 ? "warning" : "normal"}
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <TemperatureChart data={data.tempHistory} />
            <GPSMap location={data.stats?.lastGPS} history={gpsHistory} />
          </div>
          <div className="space-y-6">
            <AlertsList alerts={data.recentAlerts} onResolve={() => refresh()} />
          </div>
        </div>
      </div>
    </div>
  )
}
