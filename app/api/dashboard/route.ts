import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

interface DashboardStats {
  totalAlerts: number
  unresolvedAlerts: number
  criticalAlerts: number
  lastTemperature: { temperature: number; timestamp: Date } | null
  avgTemperature: number | null
  lastDoorState: { state: string; timestamp: Date } | null
  lastGPS: { latitude: number; longitude: number; timestamp: Date } | null
  lastTouch: { value: boolean; timestamp: Date } | null
  status: "active" | "inactive"
}

// GET - Obter dados agregados do dashboard
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const device_id = searchParams.get("device_id") || "default"

    // Buscar estatísticas de alertas
    const [alertStats] = await query<any[]>(
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN resolved = FALSE THEN 1 ELSE 0 END) as unresolved,
        SUM(CASE WHEN severity = 'critical' AND resolved = FALSE THEN 1 ELSE 0 END) as critical
       FROM alerts WHERE device_id = ?`,
      [device_id],
    )

    // Última temperatura
    const [lastTemp] = await query<any[]>(
      "SELECT temperature, timestamp FROM temperature_sensor WHERE device_id = ? ORDER BY timestamp DESC LIMIT 1",
      [device_id],
    )

    // Temperatura média das últimas 24h
    const [avgTemp] = await query<any[]>(
      `SELECT AVG(temperature) as avg_temp FROM temperature_sensor 
       WHERE device_id = ? AND timestamp >= DATE_SUB(NOW(), INTERVAL 24 HOUR)`,
      [device_id],
    )

    // Último estado da porta
    const [lastDoor] = await query<any[]>(
      "SELECT state, timestamp FROM door_sensor WHERE device_id = ? ORDER BY timestamp DESC LIMIT 1",
      [device_id],
    )

    // Última localização GPS
    const [lastGPS] = await query<any[]>(
      "SELECT latitude, longitude, timestamp FROM gps_sensor WHERE device_id = ? ORDER BY timestamp DESC LIMIT 1",
      [device_id],
    )

    // Último toque
    const [lastTouch] = await query<any[]>(
      "SELECT value, timestamp FROM touch_sensor WHERE device_id = ? ORDER BY timestamp DESC LIMIT 1",
      [device_id],
    )
    
    // Converter value de TINYINT para boolean
    if (lastTouch) {
      lastTouch.value = Boolean(lastTouch.value)
    }

    // Histórico de temperatura das últimas 24h para o gráfico
    const tempHistory = await query<any[]>(
      `SELECT temperature, timestamp FROM temperature_sensor 
       WHERE device_id = ? AND timestamp >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
       ORDER BY timestamp ASC`,
      [device_id],
    )

    // Histórico de GPS das últimas 24h para o gráfico
    const gpsHistory = await query<any[]>(
      `SELECT latitude, longitude, timestamp FROM gps_sensor 
       WHERE device_id = ? AND timestamp >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
       ORDER BY timestamp ASC`,
      [device_id],
    )

    // Alertas recentes (últimos 10)
    const recentAlerts = await query<any[]>(
      `SELECT * FROM alerts WHERE device_id = ? ORDER BY timestamp DESC LIMIT 10`,
      [device_id],
    )

    // Status do dispositivo
    const [device] = await query<any[]>("SELECT status, last_seen, battery_level FROM devices WHERE id = ?", [
      device_id,
    ])

    // Determine status based on recent activity (e.g., last 5 minutes)
    const isActive = lastTemp && (new Date().getTime() - new Date(lastTemp.timestamp).getTime() < 5 * 60 * 1000);

    const stats: DashboardStats = {
      totalAlerts: alertStats?.total || 0,
      unresolvedAlerts: alertStats?.unresolved || 0,
      criticalAlerts: alertStats?.critical || 0,
      lastTemperature: lastTemp ? { temperature: lastTemp.temperature, timestamp: lastTemp.timestamp } : null,
      avgTemperature: avgTemp?.avg_temp || null,
      lastDoorState: lastDoor ? { state: lastDoor.state, timestamp: lastDoor.timestamp } : null,
      lastGPS: lastGPS ? { latitude: lastGPS.latitude, longitude: lastGPS.longitude, timestamp: lastGPS.timestamp } : null,
      lastTouch: lastTouch ? { value: Boolean(lastTouch.value), timestamp: lastTouch.timestamp } : null,
      status: isActive ? "active" : "inactive",
    }

    return NextResponse.json({
      stats,
      tempHistory,
      gpsHistory,
      recentAlerts,
      device: device || null,
    })
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
