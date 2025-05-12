import { Repository } from 'typeorm'
import { IPermissionRepository } from '../interfaces'
import { Permission, Role } from '@/models/typeorm'
import { Inject } from '@nestjs/common'
import { createSearchQuery, DATABASE_PROVIDER } from '@/shared/database/typeorm'
import { DatabaseRepository } from '@/shared/database/typeorm'
import { CreatePermissionDto, UpdatePermissionDto } from '../dtos'
import { QueryParams } from '@/shared/types'
import { PermissionDatabaseQueryDTO } from '../interfaces/permission.repository'

export class PermissionRepository implements IPermissionRepository {
  private permissionRepository: Repository<Permission>
  constructor(
    @Inject(DATABASE_PROVIDER) private db: DatabaseRepository,
  ) {
    this.permissionRepository = this.db.getRepository(Permission)
  }

  async all(): Promise<Permission[]> {
    return this.permissionRepository.find({
      relations: ['roles'],
    })
  }

  async findById(id: number): Promise<Permission | null> {
    return this.permissionRepository.findOne({
      where: { id },
      relations: ['roles'],
    })
  }

  async findByName(name: string): Promise<Permission | null> {
    return this.permissionRepository.findOne({
      where: { name },
      relations: ['roles'],
    })
  }

  async create(permission: CreatePermissionDto): Promise<Permission> {
    const newPermission = this.permissionRepository.create({
      name: permission.name,
      description: permission.description,
      roles: [],
    })
    return this.permissionRepository.save(newPermission)
  }

  async update(id: number, permission: UpdatePermissionDto): Promise<Permission> {
    await this.permissionRepository.update(id, {
      name: permission.name,
      description: permission.description,
      roles: [],
    })
    const result = await this.findById(id)
    if (!result) {
      throw new Error(`Permission with id ${id} not found`)
    }
    return result
  }

  async delete(id: number): Promise<void> {
    await this.permissionRepository.delete(id)
  }

  async findByRole(role: Role): Promise<Permission[]> {
    return this.permissionRepository.find({
      where: { roles: role },
      relations: ['roles'],
    })
  }

  searchQuery(params: QueryParams): Promise<[PermissionDatabaseQueryDTO[], number]> {
    return createSearchQuery(this.permissionRepository, {
      ...params,
      filter: ['id', 'name'],
    })
  }
}
