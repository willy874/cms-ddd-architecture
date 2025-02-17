import { Module } from '@nestjs/common'
import { GetProviderType } from '@/utils/types'
import { MysqlModule, mysqlProvider, MYSQL_PROVIDER } from './mysql.module'

export const DATABASE_PROVIDER = 'DATABASE_PROVIDER'

type MysqlProvider = GetProviderType<typeof mysqlProvider>

export type DatabaseOperator = {
  query: MysqlProvider['query']
  getRepository: MysqlProvider['getRepository']
}

export const databaseProvider = {
  provide: DATABASE_PROVIDER,
  inject: [MYSQL_PROVIDER],
  useFactory: (database: DatabaseOperator) => {
    return database as MysqlProvider
  },
}

@Module({
  imports: [MysqlModule],
  providers: [databaseProvider],
  exports: [databaseProvider],
})
export class DatabaseModule {}
