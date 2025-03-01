import { Module, ModuleMetadata } from '@nestjs/common'
import { DatabaseModule } from '@/shared/database'
import { TokenModule } from '@/shared/token'
import { CacheModule } from '@/shared/cache'
import { UserRepositoryProvider } from './user.repository'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { UserRoleModule } from './roles'
import { FindUserHandler } from './user.query'
import { CreateUserHandler } from './user.command'

export const userModuleOptions = {
  imports: [DatabaseModule, UserRoleModule, CacheModule, TokenModule],
  providers: [UserRepositoryProvider, UserService, FindUserHandler, CreateUserHandler],
  controllers: [UserController],
} satisfies ModuleMetadata

@Module(userModuleOptions)
export class UserModule {}
