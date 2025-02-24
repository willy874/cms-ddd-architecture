import { Module } from '@nestjs/common'
import { DatabaseModule } from '@/shared/database'
import { RoleRepositoryProvider } from './role.repository'

@Module({
  imports: [DatabaseModule],
  providers: [RoleRepositoryProvider],
  exports: [RoleRepositoryProvider],
})
export class UserRoleModule {}
