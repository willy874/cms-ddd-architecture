import { ModuleMetadata } from '@nestjs/common'
import { DatabaseModule } from '@/shared/database'
import { CacheModule } from '@/shared/cache'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { TokenService } from './token.service'
import { RoleService } from './role.service'

interface UserModuleOptions {
  imports?: ModuleMetadata['imports']
  providers?: ModuleMetadata['providers']
}

export class UserModule {
  static register(options: UserModuleOptions = {}) {
    const { imports = [], providers = [] } = options
    return {
      module: UserModule,
      imports: [...imports, DatabaseModule, CacheModule],
      providers: [...providers, RoleService, TokenService, UserService],
      controllers: [UserController],
    }
  }
}
