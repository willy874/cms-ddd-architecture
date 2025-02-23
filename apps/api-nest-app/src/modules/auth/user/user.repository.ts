import { User } from '@/entities/user.entity'
import { DatabaseOperator, DATABASE_PROVIDER } from '@/shared/database'

export const AUTH_USER_REPOSITORY = 'AUTH_USER_REPOSITORY'

export const UserRepositoryProvider = {
  provide: AUTH_USER_REPOSITORY,
  inject: [DATABASE_PROVIDER],
  useFactory: (database: DatabaseOperator) => {
    return database.getRepository(User)
  },
}
