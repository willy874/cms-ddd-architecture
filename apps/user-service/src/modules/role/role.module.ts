import { DatabaseModule } from '@/shared/database'
import { DynamicModule, ModuleMetadata } from '@nestjs/common'
import { RoleService } from './role.service'
import { RoleController } from './role.controller'

interface RoleModuleOptions {
  imports?: ModuleMetadata['imports']
  providers?: ModuleMetadata['providers']
}

export class RoleModule {
  static register(metadata: RoleModuleOptions): DynamicModule {
    return {
      module: RoleModule,
      imports: [...metadata.imports, DatabaseModule],
      providers: [...metadata.providers, RoleService],
      controllers: [RoleController],
    }
  }
}
