import { Role } from '@packages/database'
import { Database, DATABASE_PROVIDER } from '@/shared/database'
import { GetProviderType } from '@/shared/types'

export const USER_ROLE_REPOSITORY = 'USER_ROLE_REPOSITORY'

export const RoleRepositoryProvider = {
  provide: USER_ROLE_REPOSITORY,
  inject: [DATABASE_PROVIDER],
  useFactory: (database: Database) => {
    return database.createRepository(Role)
  },
}

export type RoleRepository = GetProviderType<typeof RoleRepositoryProvider>
