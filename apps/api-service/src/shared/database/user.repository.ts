import { User } from '@/entities/user.entity'
import { GetProviderType } from '@/shared/types'
import { DATABASE_PROVIDER } from './database.provider'
import { Database } from './Database'

export const USER_REPOSITORY = 'USER_REPOSITORY'

export const UserRepositoryProvider = {
  provide: USER_REPOSITORY,
  inject: [DATABASE_PROVIDER],
  useFactory: (database: Database) => {
    return database.createRepository(User)
  },
}

export type UserRepository = GetProviderType<typeof UserRepositoryProvider>
