import { DatabaseModule } from '@/shared/database'
import { Module } from '@nestjs/common'
import { PermissionRepositoryProvider } from './permission.repository'
import { PermissionService } from './permission.service'

@Module({
  imports: [DatabaseModule],
  providers: [PermissionRepositoryProvider, PermissionService],
  exports: [PermissionRepositoryProvider, PermissionService],
})
export class PermissionModule {}
