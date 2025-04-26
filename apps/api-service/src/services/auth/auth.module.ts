import { DynamicModule, ModuleMetadata } from '@nestjs/common'
import { CacheModule } from '@/shared/cache'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { AuthUserService } from './user.service'
import { TokenService } from './token.service'

interface AuthModuleOptions {
  imports?: ModuleMetadata['imports']
  providers?: ModuleMetadata['providers']
}

export class AuthModule {
  static register(options: AuthModuleOptions = {}): DynamicModule {
    const { imports = [], providers = [] } = options
    return {
      module: AuthModule,
      imports: [...imports, CacheModule],
      providers: [...providers, AuthUserService, TokenService, AuthService],
      controllers: [AuthController],
    }
  }
}
