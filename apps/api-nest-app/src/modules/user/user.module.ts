import { DatabaseModule } from '@/shared/database'
import { Module } from '@nestjs/common'
import { UserRepositoryProvider } from './user.repository'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { TokenModule, TokenService } from '@/shared/token'
import { CacheModule } from '@/shared/cache'

@Module({
  imports: [DatabaseModule, CacheModule, TokenModule],
  providers: [UserRepositoryProvider, TokenService, UserService],
  exports: [UserRepositoryProvider, TokenService, UserService],
  controllers: [UserController],
})
export class UserModule {}
