import { Inject, Injectable } from '@nestjs/common'
import { PERMISSION_REPOSITORY, ROLE_REPOSITORY } from '@/repositories/providers'
import { IRoleRepository, IPermissionRepository } from '@/repositories/interfaces'
import { CreateRoleDto, UpdateRoleDto } from '@/repositories/dtos'
import { QueryPageResult, QueryParams } from '@/shared/types'

@Injectable()
export class RoleService {
  constructor(
    @Inject(ROLE_REPOSITORY) private roleRepository: IRoleRepository,
    @Inject(PERMISSION_REPOSITORY) private permissionRepository: IPermissionRepository,
  ) {}

  async all() {
    return this.roleRepository.all()
  }

  async searchQuery(params: QueryParams): Promise<QueryPageResult> {
    const [data, total] = await this.roleRepository.searchQuery(params)
    return {
      list: data,
      page: params.page || 1,
      pageSize: params.pageSize || 10,
      total,
    }
  }

  getRoleById(id: number) {
    return this.roleRepository.findById(id)
  }

  async insertRole(payload: CreateRoleDto) {
    return await this.roleRepository.create({ ...payload })
  }

  updateRole(id: number, payload: UpdateRoleDto) {
    return this.roleRepository.update(id, { ...payload })
  }

  deleteRole(id: number) {
    return this.roleRepository.delete(id)
  }
}
