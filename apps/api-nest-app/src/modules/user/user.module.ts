import { Module, ModuleMetadata } from '@nestjs/common'
import { DatabaseModule } from '@/shared/database'
import { TokenModule } from '@/shared/token'
import { CacheModule } from '@/shared/cache'
import { UserRepositoryProvider } from './user.repository'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { UserRoleModule } from './roles'

export const userModuleOptions = {
  imports: [DatabaseModule, UserRoleModule, CacheModule, TokenModule],
  providers: [UserRepositoryProvider, UserService],
  controllers: [UserController],
} satisfies ModuleMetadata

@Module(userModuleOptions)
export class UserModule {}
