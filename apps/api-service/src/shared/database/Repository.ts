import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository as OrmRepository, SaveOptions, ObjectLiteral, EntityTarget, FindOperator, FindOperatorType } from 'typeorm'
import { QueryParams } from '../types'
import { repositoriesMap } from './cache'
import { orderBy, queryPipe, filterBy, QueryPipeFn, pageBy, searchBy } from './query.util'
import type { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

export class Repository<Entity extends ObjectLiteral> {
  private fields: string[] = []
  private queryPipe: QueryPipeFn<Entity>

  constructor(private readonly repository: OrmRepository<Entity>) {
    this.fields = Object.keys(repository.metadata.propertiesMap)
    this.queryPipe = queryPipe(repository)
    repositoriesMap.set(repository.metadata.target as EntityTarget<Entity>, this as any)
  }

  createFindOperator<T>(type: FindOperatorType, value: T | FindOperator<T>, useParameter?: boolean, multipleParameters?: boolean, getSql?: (aliasPath: string) => string, objectLiteralParameters?: ObjectLiteral): FindOperator<any> {
    return new FindOperator(type, value, useParameter, multipleParameters, getSql, objectLiteralParameters)
  }

  async find(options?: FindManyOptions<Entity>): Promise<Entity[]> {
    return await this.repository.find(options)
  }

  async findBy(options: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[]): Promise<Entity[]> {
    return await this.repository.findBy(options)
  }

  async findOne(options: FindOneOptions<Entity>): Promise<Entity | null> {
    return await this.repository.findOne(options)
  }

  async save(entity: DeepPartial<Entity>, options?: SaveOptions): Promise<Entity> {
    return await this.repository.save(entity, options)
  }

  async update(id: number, entity: QueryDeepPartialEntity<Entity>): Promise<void> {
    await this.repository.update(id, entity)
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id)
  }

  async searchQuery(params: QueryParams): Promise<[Entity[], number]> {
    const { page, pageSize, filter, exclude, search, sort } = params
    const result = await this.queryPipe(
      filterBy(filter, exclude),
      searchBy(search, this.fields),
      orderBy(sort),
      pageBy(page, pageSize),
    ).getManyAndCount()
    return result
  }
}
