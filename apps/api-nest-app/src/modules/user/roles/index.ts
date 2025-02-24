import { GetProviderType } from '@/utils/types'
import { RoleRepositoryProvider } from './role.repository'

export type RoleRepository = GetProviderType<typeof RoleRepositoryProvider>

export { UserRoleModule } from './role.module'
export { USER_ROLE_REPOSITORY } from './role.repository'
