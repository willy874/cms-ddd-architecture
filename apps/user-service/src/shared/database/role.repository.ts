import { Database, Role } from '@packages/database'
import { GetProviderType } from '@/shared/types'
import { DATABASE_PROVIDER } from './database.provider'

export const ROLE_REPOSITORY = 'ROLE_REPOSITORY'

export const RoleRepositoryProvider = {
  provide: ROLE_REPOSITORY,
  inject: [DATABASE_PROVIDER],
  useFactory: (database: Database) => {
    return database.createRepository(Role)
  },
}

export type RoleRepository = GetProviderType<typeof RoleRepositoryProvider>
