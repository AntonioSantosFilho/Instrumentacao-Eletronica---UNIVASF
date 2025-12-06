import { type NextRequest, NextResponse } from "next/server"
import { query, type TemperatureSensorData } from "@/lib/db"

// Limites de temperatura para vacinas (em °C)
const MIN_TEMP = 2
const MAX_TEMP = 8

// POST - Receber dados do sensor de temperatura
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { temperature, humidity, device_id = "default" } = body

    if (temperature === undefined || typeof temperature !== "number") {
      return NextResponse.json({ error: 'O campo "temperature" deve ser um número' }, { status: 400 })
    }

    await query("INSERT INTO temperature_sensor (temperature, humidity, device_id) VALUES (?, ?, ?)", [
      temperature,
      humidity,
      device_id,
    ])

    // Verificar se a temperatura está fora do limite e gerar alerta
    if (temperature < MIN_TEMP || temperature > MAX_TEMP) {
      const severity = temperature < 0 || temperature > 12 ? "critical" : "high"
      const description =
        temperature < MIN_TEMP
          ? `Temperatura muito baixa: ${temperature}°C (mínimo: ${MIN_TEMP}°C)`
          : `Temperatura muito alta: ${temperature}°C (máximo: ${MAX_TEMP}°C)`

      await query(
        `INSERT INTO alerts (alert_type, severity, description, device_id) 
         VALUES (?, ?, ?, ?)`,
        ["temperature", severity, description, device_id],
      )
    }

    // Atualizar último contato do dispositivo
    await query("UPDATE devices SET last_seen = CURRENT_TIMESTAMP WHERE id = ?", [device_id])

    return NextResponse.json({
      success: true,
      message: "Dados de temperatura salvos com sucesso",
    })
  } catch (error) {
    console.error("Erro ao salvar dados de temperatura:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

// GET - Obter histórico do sensor de temperatura
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "100")
    const device_id = searchParams.get("device_id") || "default"
    const hours = searchParams.get("hours") // Filtrar por últimas X horas

    let sql = "SELECT * FROM temperature_sensor WHERE device_id = ?"
    const params: any[] = [device_id]

    if (hours) {
      sql += " AND timestamp >= DATE_SUB(NOW(), INTERVAL ? HOUR)"
      params.push(Number.parseInt(hours))
    }

    // LIMIT não pode ser parâmetro preparado, precisa ser concatenado diretamente
    const safeLimit = Math.max(1, Math.min(limit, 1000)) // Limitar entre 1 e 1000 para segurança
    sql += ` ORDER BY timestamp DESC LIMIT ${safeLimit}`

    const results = await query<TemperatureSensorData[]>(sql, params)

    return NextResponse.json({ data: results })
  } catch (error) {
    console.error("Erro ao buscar dados de temperatura:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
