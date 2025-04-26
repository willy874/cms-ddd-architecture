import { getEnvironment } from '@/shared/utils/environment'
import { Database } from './Database'

export const DATABASE_PROVIDER = 'DATABASE_PROVIDER'

export const DatabaseProvider = {
  provide: DATABASE_PROVIDER,
  useFactory: () => {
    const env = getEnvironment()
    const database = new Database('mysql2', {
      host: env.DATABASE_HOST,
      port: env.DATABASE_PORT,
      user: env.DATABASE_USER,
      password: env.DATABASE_PASSWORD,
      database: env.DATABASE_NAME,
    })
    return database.instance
  },
}

export type DatabaseRepository = Database<'mysql2'>['instance']
