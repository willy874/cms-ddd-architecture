import type { EntityTarget, ObjectLiteral } from 'typeorm'

export const repositoriesMap = new Map<EntityTarget<ObjectLiteral>, unknown>()
