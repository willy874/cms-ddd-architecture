import { Role } from '@/entities/role.entity'
import { DatabaseOperator, DATABASE_PROVIDER } from '@/shared/database'

export const USER_ROLE_REPOSITORY = 'USER_ROLE_REPOSITORY'

export const RoleRepositoryProvider = {
  provide: USER_ROLE_REPOSITORY,
  inject: [DATABASE_PROVIDER],
  useFactory: (database: DatabaseOperator) => {
    return database.getRepository(Role)
  },
}
