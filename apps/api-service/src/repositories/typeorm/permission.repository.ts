import { Repository } from 'typeorm'
import { IPermissionRepository } from '../interfaces'
import { Permission, Role } from '@/models/typeorm'
import { Inject } from '@nestjs/common'
import { DATABASE_PROVIDER } from '@/shared/database/typeorm'
import { DatabaseRepository } from '@/shared/database/typeorm'
import { CreatePermissionDto, UpdatePermissionDto } from '../dtos'

export class PermissionRepository implements IPermissionRepository {
  private permissionRepository: Repository<Permission>
  constructor(
    @Inject(DATABASE_PROVIDER) private db: DatabaseRepository,
  ) {
    this.permissionRepository = this.db.getRepository(Permission)
  }

  async findByName(name: string): Promise<Permission | null> {
    return this.permissionRepository.findOne({
      where: { name },
      relations: ['roles'],
    })
  }

  async findById(id: number): Promise<Permission | null> {
    return this.permissionRepository.findOne({
      where: { id },
      relations: ['roles'],
    })
  }

  async all(): Promise<Permission[]> {
    return this.permissionRepository.find({
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

  async update(id: number, permission: UpdatePermissionDto): Promise<Permission | null> {
    await this.permissionRepository.update(id, {
      name: permission.name,
      description: permission.description,
      roles: [],
    })
    return this.findById(id)
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
}
