import { DatabaseModule } from '@/shared/database'
import { Module } from '@nestjs/common'
import { RoleRepositoryProvider } from './role.repository'
import { RoleService } from './role.service'

@Module({
  imports: [DatabaseModule],
  providers: [RoleRepositoryProvider, RoleService],
  exports: [RoleRepositoryProvider, RoleService],
})
export class RoleModule {}
