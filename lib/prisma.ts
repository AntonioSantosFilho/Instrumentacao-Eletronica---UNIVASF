import { PrismaClient } from "@prisma/client"
import { config } from "dotenv"

// Carregar variáveis de ambiente do .env
config()

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Função para obter a DATABASE_URL
function getDatabaseUrl(): string {
  // Se já estiver definida, usar diretamente
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL
  }

  // Fallback: construir DATABASE_URL a partir das variáveis MYSQL_*
  const host = process.env.MYSQL_HOST || "localhost"
  const port = process.env.MYSQL_PORT || "3306"
  const user = process.env.MYSQL_USER || "root"
  const password = process.env.MYSQL_PASSWORD || ""
  const database = process.env.MYSQL_DATABASE || "vaccine_monitoring"
  const ssl = process.env.MYSQL_SSL === "true"

  // Construir URL MySQL
  let databaseUrl = `mysql://${user}:${password}@${host}:${port}/${database}`
  if (ssl) {
    databaseUrl += "?sslaccept=strict"
  }
  
  return databaseUrl
}

// Obter a URL do banco de dados
const databaseUrl = getDatabaseUrl()

// Validar que a URL está definida
if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL não está definida. Configure no arquivo .env ou através das variáveis MYSQL_*"
  )
}

// Garantir que DATABASE_URL está no process.env para o Prisma ler
// Isso é necessário porque o Prisma 7 lê a URL do process.env
process.env.DATABASE_URL = databaseUrl

// Criar instância do PrismaClient
// No Prisma 7, o PrismaClient lê automaticamente a DATABASE_URL do process.env
// Não precisamos passar no construtor se estiver no ambiente
export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma


