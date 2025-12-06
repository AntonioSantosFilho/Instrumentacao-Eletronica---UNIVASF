import { type NextRequest, NextResponse } from "next/server"
import { query, type TransportData } from "@/lib/db"

// POST - Criar novo transporte
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      device_id = "default",
      origin,
      destination,
      operator_name,
      vaccine_type,
      quantity,
      min_temp = 2.0,
      max_temp = 8.0,
      notes,
    } = body

    const [result] = await query<any>(
      `INSERT INTO transports 
       (device_id, origin, destination, operator_name, vaccine_type, quantity, min_temp, max_temp, notes) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [device_id, origin, destination, operator_name, vaccine_type, quantity, min_temp, max_temp, notes],
    )

    return NextResponse.json({
      success: true,
      message: "Transporte criado com sucesso",
      id: result.insertId,
    })
  } catch (error) {
    console.error("Erro ao criar transporte:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

// GET - Listar transportes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const device_id = searchParams.get("device_id")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    let sql = "SELECT * FROM transports WHERE 1=1"
    const params: any[] = []

    if (status) {
      sql += " AND status = ?"
      params.push(status)
    }

    if (device_id) {
      sql += " AND device_id = ?"
      params.push(device_id)
    }

    // LIMIT não pode ser parâmetro preparado, precisa ser concatenado diretamente
    const safeLimit = Math.max(1, Math.min(limit, 1000)) // Limitar entre 1 e 1000 para segurança
    sql += ` ORDER BY start_time DESC LIMIT ${safeLimit}`

    const results = await query<TransportData[]>(sql, params)

    return NextResponse.json({ data: results })
  } catch (error) {
    console.error("Erro ao listar transportes:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

// PATCH - Atualizar status do transporte
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status, end_time } = body

    if (!id) {
      return NextResponse.json({ error: 'O campo "id" é obrigatório' }, { status: 400 })
    }

    let sql = "UPDATE transports SET"
    const updates: string[] = []
    const params: any[] = []

    if (status) {
      updates.push(" status = ?")
      params.push(status)
    }

    if (end_time || status === "completed") {
      updates.push(" end_time = COALESCE(?, CURRENT_TIMESTAMP)")
      params.push(end_time || null)
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: "Nenhum campo para atualizar" }, { status: 400 })
    }

    sql += updates.join(",") + " WHERE id = ?"
    params.push(id)

    await query(sql, params)

    return NextResponse.json({
      success: true,
      message: "Transporte atualizado com sucesso",
    })
  } catch (error) {
    console.error("Erro ao atualizar transporte:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
