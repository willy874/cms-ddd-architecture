import { Permission } from '@/entities/permission.entity'
import { DatabaseOperator, DATABASE_PROVIDER } from '@/shared/database'

export const PERMISSION_REPOSITORY = 'PERMISSION_REPOSITORY'

export const PermissionRepositoryProvider = {
  provide: PERMISSION_REPOSITORY,
  inject: [DATABASE_PROVIDER],
  useFactory: (database: DatabaseOperator) => {
    return database.getRepository(Permission)
  },
}
