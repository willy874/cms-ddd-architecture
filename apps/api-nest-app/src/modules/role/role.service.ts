import { Inject, Injectable } from '@nestjs/common'
import { ROLE_REPOSITORY, RoleRepositoryProvider } from './role.repository'
import { GetProviderType } from '@/utils/types'

export type RoleRepository = GetProviderType<typeof RoleRepositoryProvider>

@Injectable()
export class RoleService {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private roleRepository: RoleRepository,
  ) {}

  all() {
    return this.roleRepository.find()
  }

  getUserById(id: number) {
    return this.roleRepository.findOne({ where: { id } })
  }
}
