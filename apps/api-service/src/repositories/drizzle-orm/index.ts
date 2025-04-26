import { Provider } from '@nestjs/common'
import { UserRepository } from './user.repository'
import { PermissionRepository } from './permission.repository'

export const USER_REPOSITORY = 'USER_REPOSITORY'

export const UserRepositoryProvider: Provider = {
  provide: USER_REPOSITORY,
  useClass: UserRepository,
}

export const PERMISSION_REPOSITORY = 'PERMISSION_REPOSITORY'

export const PermissionRepositoryProvider: Provider = {
  provide: PERMISSION_REPOSITORY,
  useClass: PermissionRepository,
}

export const ROLE_REPOSITORY = 'ROLE_REPOSITORY'

export const RoleRepositoryProvider: Provider = {
  provide: ROLE_REPOSITORY,
  useClass: UserRepository,
}