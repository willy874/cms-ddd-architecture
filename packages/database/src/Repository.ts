import { QueryParams } from './utils/types'
import { repositoriesMap } from './cache'
import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository as OrmRepository, SaveOptions, ObjectLiteral, EntityTarget } from 'typeorm'
import type { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { likeSearchBy, orderBy, queryPipe, filterBy, QueryPipeFn } from './query.util'

export type QueryPageResult<T = any> = {
  list: T[]
  page: number
  total: number
}

export class Repository<Entity extends ObjectLiteral> {
  private fields: string[] = []
  private queryPipe: QueryPipeFn<Entity>

  constructor(private readonly repository: OrmRepository<Entity>) {
    this.fields = Object.keys(repository.metadata.propertiesMap)
    this.queryPipe = queryPipe(repository)
    repositoriesMap.set(repository.metadata.target as EntityTarget<Entity>, this as any)
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

  async queryPage(params: QueryParams): Promise<QueryPageResult<Entity>> {
    const { page = 1, pageSize = 10, filter, searchField, search, sort } = params
    const [list, total] = await this.queryPipe(
      filterBy(filter),
      likeSearchBy(searchField || this.fields, search),
      orderBy(sort),
      query => query.skip((page - 1) * pageSize).take(pageSize),
    ).getManyAndCount()
    return {
      list,
      page,
      total,
    }
  }
}
