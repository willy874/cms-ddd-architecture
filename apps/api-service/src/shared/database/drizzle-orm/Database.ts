import { drizzle } from 'drizzle-orm/mysql2'
import { schemas } from '@/models/drizzle-orm'
import type { AnyMySql2Connection, MySql2Database } from 'drizzle-orm/mysql2'
import type { PoolOptions } from 'mysql2'

type DatabaseType = 'mysql2'
type DatabaseConstructor<T extends string> = T extends 'mysql2' ? PoolOptions : never
type DatabaseInstance<T extends DatabaseType> = T extends 'mysql2'
  ? MySql2Database<typeof schemas> & { $client: AnyMySql2Connection }
  : never

export class Database<T extends DatabaseType> {
  instance: DatabaseInstance<T>

  constructor(type: T, options: DatabaseConstructor<T>) {
    if (type === 'mysql2') {
      this.instance = drizzle({ connection: options }) as any
    }
  }
}
