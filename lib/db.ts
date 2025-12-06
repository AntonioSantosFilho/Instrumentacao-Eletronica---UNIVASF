import mysql from "mysql2/promise"
import fs from "fs"
import path from "path"

// Configuração SSL com certificado CA
function getSSLConfig() {
  if (process.env.MYSQL_SSL !== "true") {
    return undefined
  }

  const certPath = process.env.MYSQL_CA_CERT || path.join(process.cwd(), "ca-certificate.crt")

  try {
    // Verifica se o arquivo de certificado existe
    if (fs.existsSync(certPath)) {
      const ca = fs.readFileSync(certPath, "utf8")
      return {
        ca,
        rejectUnauthorized: true,
      }
    } else {
      console.warn(`Certificado CA não encontrado em: ${certPath}. Usando SSL sem verificação de certificado.`)
      return {
        rejectUnauthorized: false,
      }
    }
  } catch (error) {
    console.error("Erro ao ler certificado CA:", error)
    return {
      rejectUnauthorized: false,
    }
  }
}

// Configuração do pool de conexões MySQL
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || "localhost",
  port: Number.parseInt(process.env.MYSQL_PORT || "3306"),
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "vaccine_monitoring",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: getSSLConfig(),
})

export default pool

// Função helper para executar queries
export async function query<T>(sql: string, params?: any[]): Promise<T> {
  const [results] = await pool.execute(sql, params)
  return results as T
}

// Tipos para os dados dos sensores
export interface TouchSensorData {
  id?: number
  timestamp?: Date
  value: boolean
  device_id?: string
}

export interface GPSSensorData {
  id?: number
  timestamp?: Date
  latitude: number
  longitude: number
  latitude_dir?: string
  longitude_dir?: string
  fix_quality?: string
  satellites?: number
  hdop?: number
  altitude?: number
  speed?: number
  course?: number
  date?: string
  device_id?: string
}

export interface DoorSensorData {
  id?: number
  timestamp?: Date
  state: "open" | "closed"
  device_id?: string
}

export interface TemperatureSensorData {
  id?: number
  timestamp?: Date
  temperature: number
  humidity?: number
  device_id?: string
}

export interface AlertData {
  id?: number
  timestamp?: Date
  alert_type: "temperature" | "door" | "location" | "touch" | "connection" | "battery"
  severity: "low" | "medium" | "high" | "critical"
  description: string
  resolved?: boolean
  resolved_at?: Date
  device_id?: string
}

// DeviceData removed as part of refactor to focus on Vaccine Transport

export interface TransportData {
  id?: number
  device_id?: string
  start_time?: Date
  end_time?: Date
  origin?: string
  destination?: string
  status: "in_progress" | "completed" | "cancelled" | "alert"
  operator_name?: string
  vaccine_type?: string
  quantity?: number
  min_temp?: number
  max_temp?: number
  notes?: string
}
