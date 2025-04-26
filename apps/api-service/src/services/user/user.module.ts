import { DynamicModule, ModuleMetadata } from '@nestjs/common'
import { DatabaseModule } from '@/shared/database'
import { CacheModule } from '@/shared/cache'
import { UserRepositoryProvider } from '@/repositories/providers'
import { UserController } from './user.controller'
import { TokenService } from './token.service'
import { UserService } from './user.service'

interface UserModuleOptions {
  imports?: ModuleMetadata['imports']
  providers?: ModuleMetadata['providers']
}

export class UserModule {
  static register(options: UserModuleOptions = {}): DynamicModule {
    const { imports = [], providers = [] } = options
    return {
      module: UserModule,
      imports: [...imports, DatabaseModule, CacheModule],
      providers: [...providers, UserRepositoryProvider, TokenService, UserService],
      controllers: [UserController],
    }
  }
}
