import { User } from '@packages/database'
import { Database, DATABASE_PROVIDER } from '@/shared/database'
import { GetProviderType } from '@/shared/types'

export const USER_REPOSITORY = 'USER_REPOSITORY'

export const UserRepositoryProvider = {
  provide: USER_REPOSITORY,
  inject: [DATABASE_PROVIDER],
  useFactory: (database: Database) => {
    return database.createRepository(User)
  },
}

export type UserRepository = GetProviderType<typeof UserRepositoryProvider>
