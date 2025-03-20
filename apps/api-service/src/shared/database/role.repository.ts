import { Role } from '@/entities/role.entity'
import { GetProviderType } from '@/shared/types'
import { DATABASE_PROVIDER } from './database.provider'
import { Database } from './Database'

export const ROLE_REPOSITORY = 'ROLE_REPOSITORY'

export const RoleRepositoryProvider = {
  provide: ROLE_REPOSITORY,
  inject: [DATABASE_PROVIDER],
  useFactory: (database: Database) => {
    return database.createRepository(Role)
  },
}

export type RoleRepository = GetProviderType<typeof RoleRepositoryProvider>
