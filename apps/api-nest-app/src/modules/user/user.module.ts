import { Module } from '@nestjs/common'
import { DatabaseModule } from '@/shared/database'
import { TokenModule } from '@/shared/token'
import { CacheModule } from '@/shared/cache'
import { UserRepositoryProvider } from './user.repository'
import { UserService } from './user.service'
import { UserController } from './user.controller'

@Module({
  imports: [DatabaseModule, CacheModule, TokenModule],
  providers: [UserRepositoryProvider, UserService],
  controllers: [UserController],
})
export class UserModule {}
