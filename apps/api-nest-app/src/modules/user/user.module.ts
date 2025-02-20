import { DatabaseModule } from '@/shared/database'
import { Module } from '@nestjs/common'
import { UserRepositoryProvider } from './user.repository'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { JwtModule } from '@nestjs/jwt'

@Module({
  imports: [DatabaseModule, JwtModule.register({ secretOrPrivateKey: 'secretKey' })],
  providers: [UserRepositoryProvider, UserService],
  exports: [UserRepositoryProvider, UserService],
  controllers: [UserController],
})
export class UserModule {}
