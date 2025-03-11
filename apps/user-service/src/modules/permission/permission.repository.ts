import { Permission } from '@packages/database'
import { Database, DATABASE_PROVIDER } from '@/shared/database'

export const PERMISSION_REPOSITORY = 'PERMISSION_REPOSITORY'

export const PermissionRepositoryProvider = {
  provide: PERMISSION_REPOSITORY,
  inject: [DATABASE_PROVIDER],
  useFactory: (database: Database) => {
    return database.createRepository(Permission)
  },
}
