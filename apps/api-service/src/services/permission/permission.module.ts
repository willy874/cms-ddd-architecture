import { ModuleMetadata, DynamicModule } from '@nestjs/common'
import { DatabaseModule } from '@/shared/database'
import { PermissionRepositoryProvider } from '@/repositories/providers'
import { PermissionService } from './permission.service'
import { PermissionController } from './permission.controller'

interface PermissionModuleOptions {
  imports?: ModuleMetadata['imports']
  providers?: ModuleMetadata['providers']
}

export class PermissionModule {
  static register(options: PermissionModuleOptions = {}): DynamicModule {
    const { imports = [], providers = [] } = options
    return {
      module: PermissionModule,
      imports: [...imports, DatabaseModule],
      providers: [...providers, PermissionRepositoryProvider, PermissionService],
      controllers: [PermissionController],
    }
  }
}
