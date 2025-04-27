import { defineConfig } from 'drizzle-kit'
import { loadEnv } from '@packages/shared'

loadEnv()

const env = {
  DATABASE_HOST: process.env.DATABASE_HOST,
  DATABASE_PORT: process.env.DATABASE_PORT,
  DATABASE_USER: process.env.DATABASE_USER,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
  DATABASE_NAME: process.env.DATABASE_NAME,
}

export default defineConfig({
  dialect: 'mysql',
  schema: './src/models/drizzle-orm/schemas.ts',
  out: './src/migrations/drizzle-orm',
  dbCredentials: {
    host: env.DATABASE_HOST!,
    user: env.DATABASE_USER!,
    password: env.DATABASE_PASSWORD!,
    port: Number(env.DATABASE_PORT),
    database: env.DATABASE_NAME!,
  },
})
