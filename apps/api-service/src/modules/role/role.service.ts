import { Inject, Injectable } from '@nestjs/common'
import { QueryParams } from '@/shared/types'
import { CreateRoleDto } from './create-role.dto'
import { UpdateRoleDto } from './update-role.dto'
import { ROLE_REPOSITORY, RoleRepository } from '@/shared/database'

@Injectable()
export class RoleService {
  constructor(
    @Inject(ROLE_REPOSITORY) private roleRepository: RoleRepository,
  ) {}

  getRoleById(id: number) {
    return this.roleRepository.findOne({ where: { id } })
  }

  searchQuery(params: QueryParams) {
    return this.roleRepository.searchQuery(params)
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
