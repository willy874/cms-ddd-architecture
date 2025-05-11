// src/models/drizzle-orm/client.ts
import { drizzle } from 'drizzle-orm/mysql2'
import { createPool } from 'mysql2/promise'
import { loadEnv } from '@packages/shared'
// import * as schemas from '../../models/drizzle-orm/schemas'

loadEnv()

const env = {
  host: process.env.DATABASE_HOST!,
  user: process.env.DATABASE_USER!,
  password: process.env.DATABASE_PASSWORD!,
  port: Number(process.env.DATABASE_PORT!),
  database: process.env.DATABASE_NAME!,
}

const pool = createPool({
  host: env.host,
  user: env.user,
  password: env.password,
  port: env.port,
  database: env.database,
})

export const db = drizzle(pool, {
  // schema: {},
})
export { pool }
