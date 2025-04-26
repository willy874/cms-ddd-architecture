import { Repository } from 'typeorm'
import { IRoleRepository } from '../interfaces'
import { Role } from '@/models/typeorm'
import { Inject } from '@nestjs/common'
import { DATABASE_PROVIDER } from '@/shared/database/drizzle-orm'
import { DatabaseRepository } from '@/shared/database/typeorm'
import { CreateRoleDto, UpdateRoleDto } from '../dtos'

export class RoleRepository implements IRoleRepository {
  private roleRepository: Repository<Role>
  constructor(
    @Inject(DATABASE_PROVIDER) private db: DatabaseRepository,
  ) {
    this.roleRepository = this.db.getRepository(Role)
  }

  async findByName(name: string): Promise<Role | null> {
    return this.roleRepository.findOne({
      where: { name },
      relations: ['permissions'],
    })
  }

  async findById(id: number): Promise<Role | null> {
    return this.roleRepository.findOne({
      where: { id },
      relations: ['permissions'],
    })
  }

  async all(): Promise<Role[]> {
    return this.roleRepository.find({
      relations: ['permissions'],
    })
  }

  async create(role: CreateRoleDto): Promise<Role> {
    const newRole = this.roleRepository.create(role)
    return this.roleRepository.save(newRole)
  }

  async update(id: number, role: UpdateRoleDto): Promise<Role | null> {
    await this.roleRepository.update(id, role)
    return this.findById(id)
  }

  async delete(id: number): Promise<void> {
    await this.roleRepository.delete(id)
  }
}
