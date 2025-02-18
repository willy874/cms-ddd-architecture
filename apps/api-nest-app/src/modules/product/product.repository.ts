import { GetProviderType } from '@/utils/types'
import { DatabaseOperator, DATABASE_PROVIDER } from '@/shared/database'
import { Product } from './product.entity'

export const PRODUCT_REPOSITORY = 'PRODUCT_REPOSITORY'

export type ProductRepository = GetProviderType<typeof productRepositoryProvider>

export const productRepositoryProvider = {
  provide: PRODUCT_REPOSITORY,
  inject: [DATABASE_PROVIDER],
  useFactory: async (database: DatabaseOperator) => {
    return database.getRepository(Product)
  },

}
