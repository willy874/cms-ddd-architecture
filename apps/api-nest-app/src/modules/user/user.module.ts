import { DatabaseModule } from '@/shared/database'
import { Module } from '@nestjs/common'
import { UserRepositoryProvider } from './user.repository'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { TokenModule, TokenService } from '@/shared/token'

@Module({
  imports: [DatabaseModule, TokenModule],
  providers: [TokenService, UserRepositoryProvider, UserService],
  exports: [UserRepositoryProvider, UserService],
  controllers: [UserController],
})
export class UserModule {}
