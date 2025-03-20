import { DatabaseModule } from '@/shared/database'
import { DynamicModule, ModuleMetadata } from '@nestjs/common'
import { RoleService } from './role.service'
import { RoleController } from './role.controller'

interface RoleModuleOptions {
  imports?: ModuleMetadata['imports']
  providers?: ModuleMetadata['providers']
}

export class RoleModule {
  static register(options: RoleModuleOptions = {}): DynamicModule {
    const { imports = [], providers = [] } = options
    return {
      module: RoleModule,
      imports: [...imports, DatabaseModule],
      providers: [...providers, RoleService],
      controllers: [RoleController],
    }
  }
}
