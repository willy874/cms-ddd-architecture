import { Module } from '@nestjs/common'
import { CacheModule } from '@/shared/cache'
import { TokenModule } from '@/shared/token'
import { AuthUserModule } from './user'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  imports: [AuthUserModule, TokenModule, CacheModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
