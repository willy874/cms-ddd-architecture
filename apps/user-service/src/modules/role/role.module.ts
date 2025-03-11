import { DatabaseModule } from '@/shared/database'
import { DynamicModule, ModuleMetadata } from '@nestjs/common'
import { RoleRepositoryProvider } from './role.repository'
import { RoleService } from './role.service'
import { RoleController } from './role.controller'
import { UserRepositoryProvider } from './user.repository'

interface RoleModuleOptions {
  imports?: ModuleMetadata['imports']
  providers?: ModuleMetadata['providers']
}

export class RoleModule {
  static register(metadata: RoleModuleOptions): DynamicModule {
    return {
      module: RoleModule,
      imports: [...metadata.imports, DatabaseModule],
      providers: [...metadata.providers, RoleRepositoryProvider, UserRepositoryProvider, RoleService],
      controllers: [RoleController],
    }
  }
}
