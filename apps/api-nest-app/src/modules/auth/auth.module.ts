import { Module, ModuleMetadata } from '@nestjs/common'
import { CacheModule } from '@/shared/cache'
import { TokenModule } from '@/shared/token'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { AuthUserService } from './user.service'

export const authModuleOptions = {
  imports: [TokenModule, CacheModule],
  providers: [AuthUserService, AuthService],
  controllers: [AuthController],
} satisfies ModuleMetadata

@Module(authModuleOptions)
export class AuthModule {}
