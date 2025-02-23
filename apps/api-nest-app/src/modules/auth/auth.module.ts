import { Module } from '@nestjs/common'
import { CacheModule } from '@/shared/cache'
import { TokenModule } from './token'
import { UserModule } from './user'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  imports: [
    UserModule,
    TokenModule,
    CacheModule,
  ],
  providers: [
    AuthService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
