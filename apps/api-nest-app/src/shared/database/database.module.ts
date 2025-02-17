import { Module } from '@nestjs/common'
import { MysqlModule, MYSQL_PROVIDER, MysqlProvider } from './mysql.module'
import { Repository } from './Repository'
import type { ObjectLiteral, EntityTarget, IRepository } from './Repository'

export const DATABASE_PROVIDER = 'DATABASE_PROVIDER'

export type DatabaseOperator = {
  getRepository: <Entity extends ObjectLiteral>(entity: EntityTarget<Entity>) => IRepository<Entity>
}

export const databaseProvider = {
  provide: DATABASE_PROVIDER,
  inject: [MYSQL_PROVIDER],
  useFactory: (database: MysqlProvider): DatabaseOperator => {
    return {
      getRepository: (entity) => {
        return new Repository(database.getRepository(entity))
      },
    }
  },
}

@Module({
  imports: [MysqlModule],
  providers: [databaseProvider],
  exports: [databaseProvider],
})
export class DatabaseModule {}
