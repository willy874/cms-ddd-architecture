import { ModuleMetadata } from '@nestjs/common'
import { DatabaseModule } from '@/shared/database'
import { CacheModule } from '@/shared/cache'
import { UserRepositoryProvider } from './user.repository'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { TokenService } from './token.service'

export const userModuleOptions = {
  imports: [DatabaseModule, CacheModule],
  providers: [UserRepositoryProvider, TokenService, UserService],
  controllers: [UserController],
} satisfies ModuleMetadata

export class UserModule {
  static register(options: ModuleMetadata) {
    return {
      module: UserModule,
      ...options,
    }
  }
}
