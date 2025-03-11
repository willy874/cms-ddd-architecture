import { Module } from '@nestjs/common';
import { PermissionModule } from './modules/permission';
import { RoleModule } from './modules/role';
import { UserModule } from './modules/user';

@Module({
  imports: [
    PermissionModule.register({}),
    RoleModule.register({}),
    UserModule.register({}),
  ],
})
export class AppModule {}
