import { PrismaClient } from "@prisma/client"
import { config } from "dotenv"

config()

async function main() {
    console.log("Starting Direct Prisma debug...")
    console.log("DATABASE_URL:", process.env.DATABASE_URL)

    prisma = new PrismaClient()
    console.log("PrismaClient initialized")
} catch (e: any) {
    console.error("PrismaClient init FAILED:", e.message)
    return
}

try {
    const alerts = await prisma.alert.findFirst()
    console.log("Alert OK:", alerts)
} catch (e) {
    console.error("Alert FAILED:", e)
} finally {
    if (prisma) await prisma.$disconnect()
}
}

main()
    .catch((e) => {
        console.error("Main script error:", e)
    })
