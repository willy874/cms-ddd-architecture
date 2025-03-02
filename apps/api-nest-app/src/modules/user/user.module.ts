import { Module, ModuleMetadata } from '@nestjs/common'
import { DatabaseModule } from '@/shared/database'
import { TokenModule } from '@/shared/token'
import { CacheModule } from '@/shared/cache'
import { MessageQueueModule, MessageQueueProducer } from '@/shared/queue'
import { UserRepositoryProvider } from './user.repository'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { UserRoleModule } from './roles'
import { FindUserHandler } from './user.query'
import { CreateUserHandler } from './user.command'
import { UserConsumer } from './user.consumer'

export const userModuleOptions = {
  imports: [DatabaseModule, UserRoleModule, CacheModule, TokenModule, MessageQueueModule],
  providers: [UserRepositoryProvider, UserService, FindUserHandler, CreateUserHandler, MessageQueueProducer],
  controllers: [UserController, UserConsumer],
} satisfies ModuleMetadata

@Module(userModuleOptions)
export class UserModule {}
