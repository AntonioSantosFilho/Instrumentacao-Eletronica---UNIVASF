import { type NextRequest, NextResponse } from "next/server"
import { query, type GPSSensorData } from "@/lib/db"

// POST - Receber dados do sensor GPS
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      latitude,
      longitude,
      latitude_dir,
      longitude_dir,
      fix_quality,
      satellites,
      hdop,
      altitude,
      speed,
      course,
      date,
      device_id = "default",
    } = body

    if (latitude === undefined || longitude === undefined) {
      return NextResponse.json({ error: 'Os campos "latitude" e "longitude" são obrigatórios' }, { status: 400 })
    }

    await query(
      `INSERT INTO gps_sensor 
       (latitude, longitude, latitude_dir, longitude_dir, fix_quality, 
        satellites, hdop, altitude, speed, course, date, device_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        latitude,
        longitude,
        latitude_dir,
        longitude_dir,
        fix_quality,
        satellites,
        hdop,
        altitude,
        speed,
        course,
        date,
        device_id,
      ],
    )

    // Atualizar último contato do dispositivo
    await query("UPDATE devices SET last_seen = CURRENT_TIMESTAMP WHERE id = ?", [device_id])

    return NextResponse.json({
      success: true,
      message: "Dados GPS salvos com sucesso",
    })
  } catch (error) {
    console.error("Erro ao salvar dados GPS:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

// GET - Obter histórico do sensor GPS
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "100")
    const device_id = searchParams.get("device_id") || "default"

    // LIMIT não pode ser parâmetro preparado, precisa ser concatenado diretamente
    const safeLimit = Math.max(1, Math.min(limit, 1000)) // Limitar entre 1 e 1000 para segurança
    const results = await query<GPSSensorData[]>(
      `SELECT * FROM gps_sensor WHERE device_id = ? ORDER BY timestamp DESC LIMIT ${safeLimit}`,
      [device_id],
    )

    return NextResponse.json({ data: results })
  } catch (error) {
    console.error("Erro ao buscar dados GPS:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
