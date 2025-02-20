import type { DeepPartial, EntitySchema, FindManyOptions, FindOneOptions, ObjectType, Repository as OrmRepository, SaveOptions } from 'typeorm'
import type { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

export type ObjectLiteral = {
  [key: string]: any
}

export type EntityTarget<Entity> = ObjectType<Entity> | EntitySchema<Entity>

export interface IRepository<Entity extends ObjectLiteral> {
  find(options?: FindManyOptions<Entity>): Promise<Entity[]>
  findOne(options: FindOneOptions<Entity>): Promise<Entity | null>
  save(entity: DeepPartial<Entity>, options?: SaveOptions): Promise<Entity>
  findAndCount(options?: FindManyOptions<Entity>): Promise<[Entity[], number]>
  update(id: number, entity: QueryDeepPartialEntity<Entity>): Promise<void>
  delete(id: number): Promise<void>
}

export class Repository<Entity extends ObjectLiteral> implements IRepository<Entity> {
  constructor(private readonly repository: OrmRepository<Entity>) {}

  async find(options?: FindManyOptions<Entity>): Promise<Entity[]> {
    return await this.repository.find(options)
  }

  async findOne(options: FindOneOptions<Entity>): Promise<Entity | null> {
    return await this.repository.findOne(options)
  }

  async save(entity: DeepPartial<Entity>, options?: SaveOptions): Promise<Entity> {
    return await this.repository.save(entity, options)
  }

  async findAndCount(options?: FindManyOptions<Entity>): Promise<[Entity[], number]> {
    return await this.repository.findAndCount(options)
  }

  async update(id: number, entity: QueryDeepPartialEntity<Entity>): Promise<void> {
    await this.repository.update(id, entity)
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id)
  }
}
