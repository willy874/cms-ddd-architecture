import { User } from '@/models/typeorm/user.entity'
import { Role } from '@/models/typeorm/role.entity'
import { Permission } from '@/models/typeorm/permission.entity'
import { getEnvironment } from '@/shared/utils/environment'
import { Database } from './Database'

export const DATABASE_PROVIDER = 'DATABASE_PROVIDER'

export const DatabaseProvider = {
  provide: DATABASE_PROVIDER,
  useFactory: async () => {
    const env = getEnvironment()
    const database = new Database({
      type: 'mysql',
      host: env.DATABASE_HOST,
      port: env.DATABASE_PORT,
      username: env.DATABASE_USER,
      password: env.DATABASE_PASSWORD,
      database: env.DATABASE_NAME,
      entities: [User, Role, Permission],
      synchronize: false,
    })
    await database.connection()
    return database.instance
  },
}

export type DatabaseRepository = Database['instance']
