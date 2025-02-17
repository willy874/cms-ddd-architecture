import { GetProviderType } from '@/utils/types'
import { mysqlProvider, MYSQL_PROVIDER } from './mysql/mysql.provider'

export const DATABASE_PROVIDER = 'DATABASE_PROVIDER'

type MysqlProvider = GetProviderType<typeof mysqlProvider>

export type Database = {
  query: MysqlProvider['query']
  getRepository: MysqlProvider['getRepository']
}

export const databaseProvider = {
  provide: DATABASE_PROVIDER,
  inject: [MYSQL_PROVIDER],
  useFactory: (database: Database) => {
    return database as MysqlProvider
  },
}
