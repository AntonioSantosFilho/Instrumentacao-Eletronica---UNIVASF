import { type NextRequest, NextResponse } from "next/server"
import { query, type TouchSensorData } from "@/lib/db"

// POST - Receber dados do sensor de toque
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { value, device_id = "default" } = body

    if (typeof value !== "boolean") {
      return NextResponse.json({ error: 'O campo "value" deve ser um booleano' }, { status: 400 })
    }

    await query("INSERT INTO touch_sensor (value, device_id) VALUES (?, ?)", [value, device_id])

    // Atualizar último contato do dispositivo
    await query("UPDATE devices SET last_seen = CURRENT_TIMESTAMP WHERE id = ?", [device_id])

    return NextResponse.json({
      success: true,
      message: "Dados do sensor de toque salvos com sucesso",
    })
  } catch (error) {
    console.error("Erro ao salvar dados do sensor de toque:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

// GET - Obter histórico do sensor de toque
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "100")
    const device_id = searchParams.get("device_id") || "default"

    // LIMIT não pode ser parâmetro preparado, precisa ser concatenado diretamente
    const safeLimit = Math.max(1, Math.min(limit, 1000)) // Limitar entre 1 e 1000 para segurança
    const results = await query<TouchSensorData[]>(
      `SELECT * FROM touch_sensor WHERE device_id = ? ORDER BY timestamp DESC LIMIT ${safeLimit}`,
      [device_id],
    )

    return NextResponse.json({ data: results })
  } catch (error) {
    console.error("Erro ao buscar dados do sensor de toque:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
