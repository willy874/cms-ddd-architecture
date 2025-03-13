import { Inject, Injectable } from '@nestjs/common'
import { RoleRepository, ROLE_REPOSITORY } from '@/shared/database'

@Injectable()
export class RoleService {
  constructor(
    @Inject(ROLE_REPOSITORY) private roleRepository: RoleRepository,
  ) {}

  async getRolesByName(names: string[]) {
    const findRoleNames = this.roleRepository.createFindOperator('in', names,  true, true)
    const roles = await this.roleRepository.findBy({ name: findRoleNames })
    return roles
  }
}