import { Inject, Injectable } from '@nestjs/common'
import { ROLE_REPOSITORY, RoleRepositoryProvider } from './role.repository'
import { GetProviderType, QueryParams } from '@/shared/types'
import { CreateRoleDto } from './create-role.dto'
import { UpdateRoleDto } from './update-role.dto'
import { UserRepository, ROLE_USER_REPOSITORY } from './user.repository'

export type RoleRepository = GetProviderType<typeof RoleRepositoryProvider>

@Injectable()
export class RoleService {
  constructor(
    @Inject(ROLE_REPOSITORY) private roleRepository: RoleRepository,
    @Inject(ROLE_USER_REPOSITORY) private userRepository: UserRepository,
  ) {}

  getRoleById(id: number) {
    return this.roleRepository.findOne({ where: { id } })
  }

  queryPage(params: QueryParams) {
    return this.roleRepository.queryPage(params)
  }

  insertRole(payload: CreateRoleDto) {
    return this.roleRepository.save({ ...payload })
  }

  updateRole(id: number, payload: UpdateRoleDto) {
    return this.roleRepository.update(id, { ...payload })
  }

  deleteRole(id: number) {
    return this.roleRepository.delete(id)
  }
}
