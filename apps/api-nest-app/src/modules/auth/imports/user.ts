import { Module } from '@nestjs/common'
import { UserService } from '@/modules/user/user.service'
import { User } from '@/modules/user/user.entity'
import { UserModule as ImportUserModule } from '@/modules/user/user.module'

export const USER_SERVICE = 'UserService'

const UserServiceProvider = {
  provide: USER_SERVICE,
  useClass: UserService,
}

@Module({
  imports: [ImportUserModule],
  providers: [UserServiceProvider],
  exports: [UserServiceProvider],
})
export class UserModule {}

export { UserService, User }
