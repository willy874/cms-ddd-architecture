import { getEnvironment } from '@/shared/utils/environment'
import { Database } from './Database'

export const DATABASE_PROVIDER = 'DATABASE_PROVIDER'

export const DatabaseProvider = {
  provide: DATABASE_PROVIDER,
  useFactory: async () => {
    const env = getEnvironment()
    const options = {
      host: env.DATABASE_HOST,
      port: env.DATABASE_PORT,
      user: env.DATABASE_USER,
      password: env.DATABASE_PASSWORD,
      database: env.DATABASE_NAME,
    }
    try {
      const database = new Database('mysql2', options)
      await database.connection()
      return database.instance
    }
    catch (error) {
      console.log(options)
      console.error('Error connecting to database:', error)
      throw new Error('Database connection failed')
    }
  },
}

export type DatabaseRepository = Database<'mysql2'>['instance']
