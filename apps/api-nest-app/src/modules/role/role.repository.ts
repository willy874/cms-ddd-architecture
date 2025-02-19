import { Role } from './role.entity'
import { DatabaseOperator, DATABASE_PROVIDER } from '@/shared/database'

export const ROLE_REPOSITORY = 'ROLE_REPOSITORY'

export const RoleRepositoryProvider = {
  provide: ROLE_REPOSITORY,
  inject: [DATABASE_PROVIDER],
  useFactory: (database: DatabaseOperator) => {
    return database.getRepository(Role)
  },
}
