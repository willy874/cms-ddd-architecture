import { User } from './user.entity'
import { DatabaseOperator, DATABASE_PROVIDER } from '@/shared/database'

export const INJECT_KEY = 'USER_REPOSITORY'

export const userRepositoryProvider = {
  provide: INJECT_KEY,
  inject: [DATABASE_PROVIDER],
  useFactory: async (database: DatabaseOperator) => {
    return database.getRepository(User)
  },

}
