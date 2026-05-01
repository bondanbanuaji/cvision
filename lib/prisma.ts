import { PrismaClient } from "@prisma/client"
import { PrismaMariaDb } from "@prisma/adapter-mariadb"
import * as mariadb from "mariadb"

const prismaClientSingleton = () => {
  console.log("[PRISMA] Initializing PrismaClient...")
  if (!process.env.DATABASE_URL) {
    console.error("[PRISMA] DATABASE_URL is not defined!")
    throw new Error("DATABASE_URL is not defined")
  }
  
  try {
    const raw = new URL(process.env.DATABASE_URL)
    console.log("[PRISMA] Connecting to host:", raw.hostname)
    const config = {
      host: raw.hostname,
      port: Number(raw.port) || 3306,
      user: raw.username || "root",
      password: raw.password || "",
      database: raw.pathname.replace(/^\//, ""),
    }
    const adapter = new PrismaMariaDb(config)
    return new PrismaClient({ adapter })
  } catch (e) {
    console.error("[PRISMA] Failed to parse DATABASE_URL:", e)
    throw e
  }
}

declare global {
  var prismaGlobalV2: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobalV2 ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobalV2 = prisma
