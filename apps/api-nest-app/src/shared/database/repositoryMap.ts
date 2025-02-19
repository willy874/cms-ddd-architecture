import type { EntityTarget, ObjectLiteral } from 'typeorm'
import type { IRepository } from './Repository'

const repositoriesMap = new Map()
export function getRepository<Entity extends ObjectLiteral>(entity: EntityTarget<Entity>): IRepository<Entity> {
  if (repositoriesMap.has(entity)) {
    return repositoriesMap.get(entity)
  }
  throw new Error('Repository not found')
}

export function setRepository<Entity extends ObjectLiteral>(entity: EntityTarget<Entity>, repository: IRepository<Entity>) {
  if (!repositoriesMap.has(entity)) {
    repositoriesMap.set(entity, repository)
  }
  else {
    throw new Error('Repository already exists')
  }
}
