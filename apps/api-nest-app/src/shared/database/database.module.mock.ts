import { Module } from '@nestjs/common'
import { MockModule } from '@/utils/types'
import { DATABASE_PROVIDER, DatabaseOperator, databaseProvider } from './database.module'
import { IRepository, ObjectLiteral } from './Repository'

export const createMockDatabaseModule = <T extends ObjectLiteral>() => {
  const mockRepositoryInstance = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  } satisfies IRepository<ObjectLiteral>

  const mockInstance = {
    getRepository: jest.fn(() => mockRepositoryInstance),
  } satisfies DatabaseOperator

  const provider: typeof databaseProvider = {
    provide: DATABASE_PROVIDER,
    inject: [],
    useFactory: () => mockInstance,
  }

  @Module({
    providers: [provider],
    exports: [provider],
  })
  class MockDatabaseModule {}

  return {
    getRepositoryMockInstance: (): MockModule<IRepository<T>> => mockRepositoryInstance,
    getMockInstance: (): MockModule<DatabaseOperator<T>> => mockInstance as any,
    getModule: () => MockDatabaseModule,
  }
}
