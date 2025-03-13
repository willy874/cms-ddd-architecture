import { Inject, Injectable } from '@nestjs/common'
import { PERMISSION_REPOSITORY, PermissionRepository } from '@/shared/database/permission.repository'

@Injectable()
export class PermissionService {
  constructor(
    @Inject(PERMISSION_REPOSITORY) private permissionRepository: PermissionRepository,
  ) {}

  all() {
    return this.permissionRepository.find()
  }

  getUserById(id: number) {
    return this.permissionRepository.findOne({ where: { id } })
  }
}
