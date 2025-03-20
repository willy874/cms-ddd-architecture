import { Inject, Injectable } from '@nestjs/common'
import { PERMISSION_REPOSITORY, PermissionRepository } from '@/shared/database'

@Injectable()
export class PermissionService {
  constructor(
    @Inject(PERMISSION_REPOSITORY) private permissionRepository: PermissionRepository
  ) {}
}
