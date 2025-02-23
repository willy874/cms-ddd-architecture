import { Module } from '@nestjs/common'
import { MysqlModule, MYSQL_PROVIDER, MysqlProvider } from './mysql/mysql.module'
import { Repository } from './Repository'
import type { ObjectLiteral, EntityTarget, IRepository } from './Repository'

export const DATABASE_PROVIDER = 'DATABASE_PROVIDER'

export type DatabaseOperator<T extends ObjectLiteral = ObjectLiteral> = {
  getRepository: <Entity extends T>(entity: EntityTarget<Entity>) => IRepository<Entity>
}

const DatabaseProvider = {
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
  providers: [DatabaseProvider],
  exports: [DatabaseProvider],
})
export class DatabaseModule {}
