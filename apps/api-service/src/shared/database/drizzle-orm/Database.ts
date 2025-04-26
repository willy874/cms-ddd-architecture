import { drizzle } from 'drizzle-orm/mysql2'
import * as schema from '@/models/drizzle-orm/schemas'
import type { AnyMySql2Connection, MySql2Database } from 'drizzle-orm/mysql2'
import type { PoolOptions } from 'mysql2'

type DatabaseType = 'mysql2'
type DatabaseConstructor<T extends string> = T extends 'mysql2' ? PoolOptions : never
type DatabaseInstance<T extends DatabaseType> = T extends 'mysql2'
  ? MySql2Database<typeof schema> & { $client: AnyMySql2Connection }
  : never

export class Database<T extends DatabaseType> {
  instance: DatabaseInstance<T>

  constructor(private type: T, private options: DatabaseConstructor<T>) {}

  async connection() {
    if (this.type === 'mysql2') {
      this.instance = drizzle({
        // schema,
        connection: this.options,
      }) as DatabaseInstance<T>
    }
  }
}
