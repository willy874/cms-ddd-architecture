import { Module, ModuleMetadata } from '@nestjs/common'
import { CacheModule } from '@/shared/cache'
import { TokenModule } from '@/shared/token'
import { AuthUserModule } from './user'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

export const authModuleOptions = {
  imports: [AuthUserModule, TokenModule, CacheModule],
  providers: [AuthService],
  controllers: [AuthController],
} satisfies ModuleMetadata

@Module(authModuleOptions)
export class AuthModule {}
