import { Inject, Injectable } from '@nestjs/common'
import { PERMISSION_REPOSITORY, PermissionRepositoryProvider } from './permission.repository'
import { GetProviderType } from '@/utils/types'

export type PermissionRepository = GetProviderType<typeof PermissionRepositoryProvider>

@Injectable()
export class PermissionService {
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private permissionRepository: PermissionRepository,
  ) {}

  all() {
    return this.permissionRepository.find()
  }

  getUserById(id: number) {
    return this.permissionRepository.findOne({ where: { id } })
  }
}
