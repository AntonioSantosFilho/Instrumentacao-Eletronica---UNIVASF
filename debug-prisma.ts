
import { prisma } from "./lib/prisma"

async function main() {
    console.log("Starting Prisma debug...")

    try {
        console.log("Testing Alert...")
        const alerts = await prisma.alert.findFirst()
        console.log("Alert OK:", alerts)
    } catch (e) {
        console.error("Alert FAILED:", e)
    }

    try {
        console.log("Testing TemperatureSensor...")
        const temp = await prisma.temperatureSensor.findFirst()
        console.log("TemperatureSensor OK:", temp)
    } catch (e) {
        console.error("TemperatureSensor FAILED:", e)
    }

    try {
        console.log("Testing DoorSensor...")
        const door = await prisma.doorSensor.findFirst()
        console.log("DoorSensor OK:", door)
    } catch (e) {
        console.error("DoorSensor FAILED:", e)
    }

    try {
        console.log("Testing GPSSensor...")
        const gps = await prisma.gPSSensor.findFirst()
        console.log("GPSSensor OK:", gps)
    } catch (e) {
        console.error("GPSSensor FAILED:", e)
    }

    try {
        console.log("Testing TouchSensor...")
        const touch = await prisma.touchSensor.findFirst()
        console.log("TouchSensor OK:", touch)
    } catch (e) {
        console.error("TouchSensor FAILED:", e)
    }
}

main()
    .catch((e) => {
        console.error("Main script error:", e)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
