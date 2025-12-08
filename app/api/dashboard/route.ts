import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

interface DashboardStats {
  totalAlerts: number
  unresolvedAlerts: number
  criticalAlerts: number
  lastTemperature: { temperature: number; timestamp: Date } | null
  avgTemperature: number | null
  lastDoorState: { state: string; timestamp: Date } | null
  lastGPS: {
    latitude: number
    longitude: number
    latitudeDir: string | null
    longitudeDir: string | null
    fixQuality: string | null
    satellites: number | null
    hdop: number | null
    altitude: number | null
    speed: number | null
    course: number | null
    date: Date | null
    timestamp: Date
  } | null
  lastTouch: { value: boolean; timestamp: Date } | null
  status: "active" | "inactive"
}

// GET - Obter dados agregados do dashboard
export async function GET(request: NextRequest) {
  try {
    // Buscar estatísticas de alertas
    const [alertStats] = await query<any[]>(
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN resolved = FALSE THEN 1 ELSE 0 END) as unresolved,
        SUM(CASE WHEN severity = 'critical' AND resolved = FALSE THEN 1 ELSE 0 END) as critical
       FROM alerts`,
    )

    // Última temperatura
    const [lastTemp] = await query<any[]>(
      "SELECT temperature, timestamp FROM temperature_sensor ORDER BY timestamp DESC LIMIT 1",
    )

    // Temperatura média das últimas 24h
    const [avgTemp] = await query<any[]>(
      `SELECT AVG(temperature) as avg_temp FROM temperature_sensor 
       WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 24 HOUR)`,
    )

    // Último estado da porta
    const [lastDoor] = await query<any[]>(
      "SELECT state, timestamp FROM door_sensor ORDER BY timestamp DESC LIMIT 1",
    )

    // Última localização GPS
    const [lastGPS] = await query<any[]>(
      `SELECT 
        latitude, longitude, latitude_dir as latitudeDir, longitude_dir as longitudeDir,
        fix_quality as fixQuality, satellites, hdop, altitude, speed, course, date, timestamp 
       FROM gps_sensor ORDER BY timestamp DESC LIMIT 1`,
    )

    // Último toque
    const [lastTouch] = await query<any[]>(
      "SELECT value, timestamp FROM touch_sensor ORDER BY timestamp DESC LIMIT 1",
    )

    // Converter value de TINYINT para boolean
    if (lastTouch) {
      lastTouch.value = Boolean(lastTouch.value)
    }

    // Histórico de temperatura das últimas 24h para o gráfico
    const tempHistory = await query<any[]>(
      `SELECT temperature, timestamp FROM temperature_sensor 
       WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
       ORDER BY timestamp ASC`,
    )

    // Histórico de GPS das últimas 24h para o gráfico
    const gpsHistory = await query<any[]>(
      `SELECT latitude, longitude, timestamp FROM gps_sensor 
       WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
       ORDER BY timestamp ASC`,
    )

    // Histórico de Porta das últimas 24h
    const doorHistory = await query<any[]>(
      `SELECT state, timestamp FROM door_sensor 
       WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
       ORDER BY timestamp ASC`,
    )

    // Histórico de Toque das últimas 24h
    const touchHistory = await query<any[]>(
      `SELECT value, timestamp FROM touch_sensor 
       WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
       ORDER BY timestamp ASC`,
    )

    // Alertas recentes (últimos 10)
    const recentAlerts = await query<any[]>(
      `SELECT * FROM alerts ORDER BY timestamp DESC LIMIT 10`,
    )

    // Determine status based on recent activity (e.g., last 5 minutes)
    const isActive = lastTemp && (new Date().getTime() - new Date(lastTemp.timestamp).getTime() < 5 * 60 * 1000);

    // Mock device info since we removed the devices table
    const device = {
      status: isActive ? "online" : "offline",
      last_seen: lastTemp ? lastTemp.timestamp : new Date(),
      battery_level: 100 // Mock value or derive if possible
    }

    const stats: DashboardStats = {
      totalAlerts: alertStats?.total || 0,
      unresolvedAlerts: alertStats?.unresolved || 0,
      criticalAlerts: alertStats?.critical || 0,
      lastTemperature: lastTemp ? { temperature: lastTemp.temperature, timestamp: lastTemp.timestamp } : null,
      avgTemperature: avgTemp?.avg_temp || null,
      lastDoorState: lastDoor ? { state: lastDoor.state, timestamp: lastDoor.timestamp } : null,
      lastGPS: lastGPS ? {
        latitude: lastGPS.latitude,
        longitude: lastGPS.longitude,
        latitudeDir: lastGPS.latitudeDir,
        longitudeDir: lastGPS.longitudeDir,
        fixQuality: lastGPS.fixQuality,
        satellites: lastGPS.satellites,
        hdop: lastGPS.hdop,
        altitude: lastGPS.altitude,
        speed: lastGPS.speed,
        course: lastGPS.course,
        date: lastGPS.date,
        timestamp: lastGPS.timestamp
      } : null,
      lastTouch: lastTouch ? { value: Boolean(lastTouch.value), timestamp: lastTouch.timestamp } : null,
      status: isActive ? "active" : "inactive",
    }

    return NextResponse.json({
      stats,
      tempHistory,
      gpsHistory,
      doorHistory,
      touchHistory,
      recentAlerts,
      device,
    })
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
