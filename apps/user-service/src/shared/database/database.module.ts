import { Module } from '@nestjs/common'
import { Database } from '@packages/database'
import { getEnvironment } from '../config/env'

export const DATABASE_PROVIDER = 'DATABASE_PROVIDER'

const DatabaseProvider = {
  provide: DATABASE_PROVIDER,
  inject: [],
  useFactory: () => {
    const env = getEnvironment()
    const database = new Database({
      type: 'mysql',
      host: env.DATABASE_HOST,
      port: env.DATABASE_PORT,
      username: env.DATABASE_USER,
      password: env.DATABASE_PASSWORD,
      database: env.DATABASE_NAME,
    })
    return database.connection()
  },
}

@Module({
  imports: [],
  providers: [DatabaseProvider],
  exports: [DatabaseProvider],
})
export class DatabaseModule {}
