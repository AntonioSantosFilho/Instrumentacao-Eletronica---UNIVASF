import { type NextRequest, NextResponse } from "next/server"
import { query, type TemperatureSensorData, getCurrentTimestampUTC3 } from "@/lib/db"

// Limites de temperatura para vacinas (em °C)
const MIN_TEMP = 2
const MAX_TEMP = 8

// POST - Receber dados do sensor de temperatura
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { temperature } = body

    if (temperature === undefined || typeof temperature !== "number") {
      return NextResponse.json({ error: 'O campo "temperature" deve ser um número' }, { status: 400 })
    }

    // Arredondar temperatura para 2 casas decimais para evitar problemas de precisão
    const roundedTemperature = Math.round(temperature * 100) / 100

    // Obter timestamp em UTC-3
    const timestamp = getCurrentTimestampUTC3()

    await query("INSERT INTO temperature_sensor (temperature, timestamp) VALUES (?, ?)", [
      roundedTemperature,
      timestamp,
    ])

    // Verificar se a temperatura está fora do limite e gerar alerta
    if (roundedTemperature < MIN_TEMP || roundedTemperature > MAX_TEMP) {
      const severity = roundedTemperature < 0 || roundedTemperature > 12 ? "critical" : "high"
      const description =
        roundedTemperature < MIN_TEMP
          ? `Temperatura muito baixa: ${roundedTemperature.toFixed(1)}°C (mínimo: ${MIN_TEMP}°C)`
          : `Temperatura muito alta: ${roundedTemperature.toFixed(1)}°C (máximo: ${MAX_TEMP}°C)`

      const alertTimestamp = getCurrentTimestampUTC3()
      await query(
        `INSERT INTO alerts (alert_type, severity, description, timestamp) 
         VALUES (?, ?, ?, ?)`,
        ["temperature", severity, description, alertTimestamp],
      )
    }

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
    const hours = searchParams.get("hours") // Filtrar por últimas X horas

    let sql = "SELECT * FROM temperature_sensor WHERE 1=1"
    const params: any[] = []

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
