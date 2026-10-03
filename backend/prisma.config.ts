import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

function escapeSqlServerValue (value: string): string {
  return `{${value.replace(/}/g, '}}')}}`
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: `sqlserver://${env('DB_HOST')}:${env('DB_PORT')};database=${escapeSqlServerValue(env('DB_NAME'))};user=${escapeSqlServerValue(env('DB_USER'))};password=${escapeSqlServerValue(env('DB_PASSWORD'))};encrypt=true;trustServerCertificate=true`
  }
})