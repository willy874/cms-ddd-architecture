import { DeepPartial, EntitySchema, FindManyOptions, FindOneOptions, ObjectType, Repository as OrmRepository, SaveOptions } from 'typeorm'

export type ObjectLiteral = {
  [key: string]: any
}

type IRepository<Entity extends ObjectLiteral> = Pick<OrmRepository<Entity>, 'find'>

export type EntityTarget<Entity> = ObjectType<Entity> | EntitySchema<Entity>

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
}
