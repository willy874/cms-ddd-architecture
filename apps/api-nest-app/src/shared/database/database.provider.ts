import { DataSource } from 'typeorm'
import { entities } from '@/entities'
import { env } from '@/env'

export const INJECT_DATABASE = 'DATA_SOURCE'

 type UseDatabase = {
   query: DataSource['query']
   getRepository: DataSource['getRepository']
 }

export const databaseProvider = {
  provide: INJECT_DATABASE,
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
      // entities: [
      //   __dirname + '/../**/*.entity{.ts,.js}',
      // ],
    })
    await dataSource.initialize()
    return dataSource as UseDatabase
  },
}
