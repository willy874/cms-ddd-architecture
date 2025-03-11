import type { EntityTarget, ObjectLiteral } from 'typeorm'
import type { Repository } from './Repository'

export const repositoriesMap = new Map<EntityTarget<ObjectLiteral>, Repository<ObjectLiteral>>()
