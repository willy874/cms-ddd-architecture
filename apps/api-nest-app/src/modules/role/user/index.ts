import { GetProviderType } from '@/types'
import { UserRepositoryProvider } from './user.repository'

export type UserRepository = GetProviderType<typeof UserRepositoryProvider>

export { RoleUserModule } from './user.module'
export { ROLE_USER_REPOSITORY } from './user.repository'
