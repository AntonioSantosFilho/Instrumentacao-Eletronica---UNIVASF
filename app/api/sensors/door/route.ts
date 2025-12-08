import { type NextRequest, NextResponse } from "next/server"
import { query, type DoorSensorData, getCurrentTimestampUTC3 } from "@/lib/db"

// POST - Receber dados do sensor da porta
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { state } = body

    if (!state || !["open", "closed"].includes(state)) {
      return NextResponse.json({ error: 'O campo "state" deve ser "open" ou "closed"' }, { status: 400 })
    }

    // Obter timestamp em UTC-3
    const timestamp = getCurrentTimestampUTC3()

    await query("INSERT INTO door_sensor (state, timestamp) VALUES (?, ?)", [state, timestamp])

    // Gerar alerta se a porta foi aberta
    if (state === "open") {
      await query(
        `INSERT INTO alerts (alert_type, severity, description, timestamp) 
         VALUES (?, ?, ?, ?)`,
        ["door", "medium", "Porta da caixa térmica foi aberta", timestamp],
      )
    }

    return NextResponse.json({
      success: true,
      message: "Estado da porta salvo com sucesso",
    })
  } catch (error) {
    console.error("Erro ao salvar estado da porta:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

// GET - Obter histórico do sensor da porta
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "100")

    // LIMIT não pode ser parâmetro preparado, precisa ser concatenado diretamente
    const safeLimit = Math.max(1, Math.min(limit, 1000)) // Limitar entre 1 e 1000 para segurança
    const results = await query<DoorSensorData[]>(
      `SELECT * FROM door_sensor ORDER BY timestamp DESC LIMIT ${safeLimit}`,
    )

    return NextResponse.json({ data: results })
  } catch (error) {
    console.error("Erro ao buscar estado da porta:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
