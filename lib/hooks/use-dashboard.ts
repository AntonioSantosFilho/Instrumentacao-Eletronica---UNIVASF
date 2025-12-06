"use client"

import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export interface DashboardData {
  stats: {
    totalAlerts: number
    unresolvedAlerts: number
    criticalAlerts: number
    lastTemperature: { temperature: number; timestamp: string } | null
    avgTemperature: number | null
    lastDoorState: string | null
    lastGPS: { latitude: number; longitude: number } | null
    lastTouch: { value: boolean; timestamp: string } | null
    status: "active" | "inactive"
  }
  tempHistory: Array<{ temperature: number; timestamp: string }>
  recentAlerts: Array<{
    id: number
    timestamp: string
    alert_type: string
    severity: string
    description: string
    resolved: boolean
  }>
}

export function useDashboard(deviceId = "default") {
  const { data, error, isLoading, mutate } = useSWR<DashboardData>(`/api/dashboard?device_id=${deviceId}`, fetcher, {
    refreshInterval: 5000, // Atualiza a cada 5 segundos
    revalidateOnFocus: true,
  })

  return {
    data,
    error,
    isLoading,
    refresh: mutate,
  }
}

export function useTemperatureHistory(deviceId = "default", hours = 24) {
  const { data, error, isLoading } = useSWR(
    `/api/sensors/temperature?device_id=${deviceId}&hours=${hours}&limit=500`,
    fetcher,
    {
      refreshInterval: 30000,
    },
  )

  return {
    data: data?.data || [],
    error,
    isLoading,
  }
}

export function useAlerts(deviceId?: string, resolved?: boolean) {
  const params = new URLSearchParams()
  if (deviceId) params.set("device_id", deviceId)
  if (resolved !== undefined) params.set("resolved", String(resolved))

  const { data, error, isLoading, mutate } = useSWR(`/api/alerts?${params.toString()}`, fetcher, {
    refreshInterval: 10000,
  })

  return {
    data: data?.data || [],
    error,
    isLoading,
    refresh: mutate,
  }
}

export function useGPSHistory(deviceId = "default", limit = 100) {
  const { data, error, isLoading } = useSWR(`/api/sensors/gps?device_id=${deviceId}&limit=${limit}`, fetcher, {
    refreshInterval: 10000,
  })

  return {
    data: data?.data || [],
    error,
    isLoading,
  }
}
