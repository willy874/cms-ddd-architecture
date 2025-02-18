import { entities } from '@/entities'
import { registerAs } from '@nestjs/config'

export default registerAs('db', () => ({
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  name: process.env.DATABASE_NAME,
  synchronize: process.env.NODE_ENV === 'development',
  entities: [...entities],
}))
