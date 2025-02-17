import { GetProviderType } from '@/utils/types'
import { mysqlProvider, MYSQL_PROVIDER } from './mysql/mysql.provider'

export const INJECT_DATABASE = 'INJECT_DATABASE'
export type Database = GetProviderType<typeof mysqlProvider>

export const databaseProvider = {
  provide: INJECT_DATABASE,
  inject: [MYSQL_PROVIDER],
  useFactory: (database: Database) => {
    return database
  },
}
