import { User } from '@/entities/user.entity'
import { Role } from '@/entities/role.entity'
import { Permission } from '@/entities/permission.entity'
import { getEnvironment } from '../utils/environment'
import { Database } from './Database'

export const DATABASE_PROVIDER = 'DATABASE_PROVIDER'

export const DatabaseProvider = {
  provide: DATABASE_PROVIDER,
  useFactory: () => {
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
    return database.connection()
  },
}
