import { DatabaseModule } from '@/shared/database'
import { Module } from '@nestjs/common'
import { RoleRepositoryProvider } from './role.repository'
import { RoleService } from './role.service'
import { RoleController } from './role.controller'
import { CacheModule } from '@/shared/cache'
import { TokenModule } from '@/shared/token'
import { RoleUserModule } from './user'

@Module({
  imports: [DatabaseModule, RoleUserModule, CacheModule, TokenModule],
  providers: [RoleRepositoryProvider, RoleService],
  exports: [RoleRepositoryProvider, RoleService],
  controllers: [RoleController],
})
export class RoleModule {}
