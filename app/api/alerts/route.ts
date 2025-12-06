import { type NextRequest, NextResponse } from "next/server"
import { query, type AlertData } from "@/lib/db"

// POST - Criar novo alerta
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { alert_type, severity = "medium", description, device_id = "default" } = body

    if (!alert_type || !description) {
      return NextResponse.json({ error: 'Os campos "alert_type" e "description" são obrigatórios' }, { status: 400 })
    }

    const validTypes = ["temperature", "door", "location", "touch", "connection", "battery"]
    if (!validTypes.includes(alert_type)) {
      return NextResponse.json(
        { error: `alert_type deve ser um dos seguintes: ${validTypes.join(", ")}` },
        { status: 400 },
      )
    }

    await query(
      `INSERT INTO alerts (alert_type, severity, description, device_id) 
       VALUES (?, ?, ?, ?)`,
      [alert_type, severity, description, device_id],
    )

    return NextResponse.json({
      success: true,
      message: "Alerta criado com sucesso",
    })
  } catch (error) {
    console.error("Erro ao criar alerta:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

// GET - Obter alertas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "100")
    const device_id = searchParams.get("device_id")
    const resolved = searchParams.get("resolved")
    const severity = searchParams.get("severity")

    let sql = "SELECT * FROM alerts WHERE 1=1"
    const params: any[] = []

    if (device_id) {
      sql += " AND device_id = ?"
      params.push(device_id)
    }

    if (resolved !== null && resolved !== undefined) {
      sql += " AND resolved = ?"
      params.push(resolved === "true")
    }

    if (severity) {
      sql += " AND severity = ?"
      params.push(severity)
    }

    // LIMIT não pode ser parâmetro preparado, precisa ser concatenado diretamente
    const safeLimit = Math.max(1, Math.min(limit, 1000)) // Limitar entre 1 e 1000 para segurança
    sql += ` ORDER BY timestamp DESC LIMIT ${safeLimit}`

    const results = await query<AlertData[]>(sql, params)

    return NextResponse.json({ data: results })
  } catch (error) {
    console.error("Erro ao buscar alertas:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

// PATCH - Resolver alerta
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, resolved = true } = body

    if (!id) {
      return NextResponse.json({ error: 'O campo "id" é obrigatório' }, { status: 400 })
    }

    await query("UPDATE alerts SET resolved = ?, resolved_at = IF(?, CURRENT_TIMESTAMP, NULL) WHERE id = ?", [
      resolved,
      resolved,
      id,
    ])

    return NextResponse.json({
      success: true,
      message: "Alerta atualizado com sucesso",
    })
  } catch (error) {
    console.error("Erro ao atualizar alerta:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
