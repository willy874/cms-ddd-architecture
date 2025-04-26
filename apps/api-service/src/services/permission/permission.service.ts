import { Inject, Injectable } from '@nestjs/common'
import { IPermissionRepository } from '@/repositories/interfaces'
import { PERMISSION_REPOSITORY } from '@/repositories/providers'

@Injectable()
export class PermissionService {
  constructor(
    @Inject(PERMISSION_REPOSITORY) private permissionRepository: IPermissionRepository,
  ) {}

  all() {
    return this.permissionRepository.all()
  }

  getUserById(id: number) {
    return this.permissionRepository.findById(id)
  }
}
