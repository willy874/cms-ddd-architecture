import { Module, ModuleMetadata } from '@nestjs/common'
import { CacheModule } from '@/shared/cache'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { AuthUserService } from './user.service'
import { TokenService } from './token.service'

export const authModuleOptions = {
  imports: [CacheModule],
  providers: [AuthUserService, TokenService, AuthService],
  controllers: [AuthController],
} satisfies ModuleMetadata

@Module(authModuleOptions)
export class AuthModule {}
