import { FactoryProvider, Module } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { entities } from '../entities'
import { env } from '../env'
import { Database, INJECT_DATABASE } from '../core/inject'

const databaseProvider: FactoryProvider<Database> = {
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
    return dataSource
  },
}

@Module({
  providers: [databaseProvider],
  exports: [databaseProvider],
})
export class DatabaseModule {}
