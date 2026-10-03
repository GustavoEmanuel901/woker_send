import 'dotenv/config'
import { PrismaMssql } from '@prisma/adapter-mssql'
import { PrismaClient } from '../generated/prisma/client'

function requiredEnv (name: string): string {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

const adapter = new PrismaMssql({
  server: requiredEnv('DB_HOST'),
  port: Number(process.env.DB_PORT ?? 1433),
  database: requiredEnv('DB_NAME'),
  user: requiredEnv('DB_USER'),
  password: requiredEnv('DB_PASSWORD'),
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
})

export const prismaClient = new PrismaClient({ adapter })