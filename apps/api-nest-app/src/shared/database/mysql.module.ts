import { Module } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { DataSource } from 'typeorm'
import { GetProviderType } from '@/utils/types'
import databaseConfigProvider from '../config/database'

export const MYSQL_PROVIDER = 'MYSQL_PROVIDER'

export const mysqlProvider = {
  provide: MYSQL_PROVIDER,
  inject: [databaseConfigProvider.KEY],
  useFactory: async (config: ConfigType<typeof databaseConfigProvider>) => {
    const dataSource = new DataSource({
      type: 'mysql',
      host: config.host,
      port: config.port,
      username: config.username,
      password: config.password,
      database: config.name,
      synchronize: config.synchronize,
      entities: config.entities,
    })
    return await dataSource.initialize()
  },
}

export type MysqlProvider = GetProviderType<typeof mysqlProvider>

@Module({
  imports: [],
  providers: [mysqlProvider],
  exports: [mysqlProvider],
})
export class MysqlModule {}
