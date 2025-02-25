import { cwd } from 'node:process'
import { join } from 'node:path'
import {} from 'node:fs'
import { config } from 'dotenv'
import { DataSource } from 'typeorm'

const env = config({ path: join(cwd(), '.env') }).parsed

export default new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
  database: env.DATABASE_NAME,
  entities: [join(__dirname, 'entities', '*.ts')],
  migrations: [join(__dirname, 'migrations', '*.ts')],
  synchronize: false, // 關閉自動同步
  logging: true,
})
