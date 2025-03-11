import { Module } from '@nestjs/common';
import { PermissionModule } from './modules/permission';
import { RoleModule } from './modules/role';

@Module({
  imports: [
    PermissionModule.register({}),
    RoleModule.register({}),
  ],
})
export class AppModule {}
