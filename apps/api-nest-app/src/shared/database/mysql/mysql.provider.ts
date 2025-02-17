import { DataSource } from 'typeorm'
import { entities } from '@/entities'
import { env } from '@/env'

export const MYSQL_PROVIDER = 'MYSQL_PROVIDER'

export const mysqlProvider = {
  provide: MYSQL_PROVIDER,
  useFactory: async () => {
    const dataSource = new DataSource({
      type: 'mysql',
      host: env.DATABASE_HOST,
      port: parseInt(env.DATABASE_PORT, 10),
      username: env.DATABASE_USER,
      password: env.DATABASE_PASSWORD,
      database: env.DATABASE_NAME,
      synchronize: true,
      entities: [...entities],
    })
    return await dataSource.initialize()
  },
}
