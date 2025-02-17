import { Module } from '@nestjs/common'
import { MockModule } from '@/utils/types'
import { DATABASE_PROVIDER, DatabaseOperator, databaseProvider } from './database.module'
import { IRepository } from './Repository'

export const createMockDatabaseModule = () => {
  const mockRepositoryInstance: IRepository<any> = {
    find: jest.fn(() => {
      throw new Error('Method not implemented.')
    }),
    findOne: jest.fn(() => {
      throw new Error('Method not implemented.')
    }),
    save: jest.fn(() => {
      throw new Error('Method not implemented.')
    }),
  }

  const mockInstance: DatabaseOperator = {
    getRepository: jest.fn(() => mockRepositoryInstance),
  }

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
    getRepositoryMockInstance: (): MockModule<IRepository<any>> => mockRepositoryInstance as any,
    getMockInstance: (): MockModule<DatabaseOperator> => mockInstance as any,
    getModule: () => MockDatabaseModule,
  }
}
