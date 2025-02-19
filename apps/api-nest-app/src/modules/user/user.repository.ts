import { User } from './user.entity'
import { DatabaseOperator, DATABASE_PROVIDER } from '@/shared/database'

export const USER_REPOSITORY = 'USER_REPOSITORY'

export const UserRepositoryProvider = {
  provide: USER_REPOSITORY,
  inject: [DATABASE_PROVIDER],
  useFactory: (database: DatabaseOperator) => {
    return database.getRepository(User)
  },
}
