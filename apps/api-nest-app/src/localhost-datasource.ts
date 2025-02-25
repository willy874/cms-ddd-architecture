import { cwd } from 'node:process'
import { join } from 'node:path'
import {} from 'node:fs'
import dotenv from 'dotenv'
import { DataSource } from 'typeorm'
import { entities } from './entities'

const env = dotenv.config({ path: join(cwd(), '.env') }).parsed

export default new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
  database: env.DATABASE_NAME,
  entities: [...entities],
  migrations: [join(cwd(), 'src/migrations/*.ts')],
  synchronize: false, // 關閉自動同步
  logging: true,
})
