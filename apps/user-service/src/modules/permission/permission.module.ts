import { ModuleMetadata, DynamicModule } from '@nestjs/common'
import { DatabaseModule } from '@/shared/database'
import { PermissionService } from './permission.service'
import { PermissionController } from './permission.controller'

interface PermissionModuleOptions {
  imports?: ModuleMetadata['imports']
  providers?: ModuleMetadata['providers']
}

export class PermissionModule {
  static register(metadata: PermissionModuleOptions): DynamicModule {
    return {
      module: PermissionModule,
      imports: [...metadata.imports, DatabaseModule],
      providers: [...metadata.providers, PermissionService],
      controllers: [PermissionController],
    }
  }
}
