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
    lastDoorState: { state: string; timestamp: string } | null
    lastGPS: { latitude: number; longitude: number; timestamp: string } | null
    lastTouch: { value: boolean; timestamp: string } | null
    status: "active" | "inactive"
  }
  tempHistory: Array<{ temperature: number; timestamp: string }>
  gpsHistory: Array<{ latitude: number; longitude: number; timestamp: string }>
  doorHistory: Array<{ state: string; timestamp: string }>
  touchHistory: Array<{ value: number; timestamp: string }>
  recentAlerts: Array<{
    id: number
    timestamp: string
    alert_type: string
    severity: string
    description: string
    resolved: boolean
  }>
}

export function useDashboard() {
  const { data, error, isLoading, mutate } = useSWR<DashboardData>("/api/dashboard", fetcher, {
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

export function useTemperatureHistory(hours = 24) {
  const { data, error, isLoading } = useSWR(
    `/api/sensors/temperature?hours=${hours}&limit=500`,
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

export function useAlerts(resolved?: boolean) {
  const params = new URLSearchParams()
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

export function useGPSHistory(limit = 100) {
  const { data, error, isLoading } = useSWR(`/api/sensors/gps?limit=${limit}`, fetcher, {
    refreshInterval: 10000,
  })

  return {
    data: data?.data || [],
    error,
    isLoading,
  }
}
