import { Role } from '@packages/database'
import { Database, DATABASE_PROVIDER } from '@/shared/database'

export const ROLE_REPOSITORY = 'ROLE_REPOSITORY'

export const RoleRepositoryProvider = {
  provide: ROLE_REPOSITORY,
  inject: [DATABASE_PROVIDER],
  useFactory: (database: Database) => {
    return database.createRepository(Role)
  },
}
