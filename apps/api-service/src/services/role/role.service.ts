import { Inject, Injectable } from '@nestjs/common'
import { ROLE_REPOSITORY } from '@/repositories/providers'
import { IRoleRepository } from '@/repositories/interfaces'
import { CreateRoleDto, UpdateRoleDto } from '@/repositories/dtos'

@Injectable()
export class RoleService {
  constructor(
    @Inject(ROLE_REPOSITORY) private roleRepository: IRoleRepository,
  ) {}

  async searchQuery() {
    return this.roleRepository.all()
  }

  getRoleById(id: number) {
    return this.roleRepository.findById(id)
  }

  insertRole(payload: CreateRoleDto) {
    return this.roleRepository.create({ ...payload })
  }

  updateRole(id: number, payload: UpdateRoleDto) {
    return this.roleRepository.update(id, { ...payload })
  }

  deleteRole(id: number) {
    return this.roleRepository.delete(id)
  }
}
