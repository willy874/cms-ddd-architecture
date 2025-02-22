import { GetProviderType } from '@/utils/types'
import { DatabaseOperator, DATABASE_PROVIDER } from '@/shared/database'
import { Product } from '@/entities/product.entity'

export const PRODUCT_REPOSITORY = 'PRODUCT_REPOSITORY'

export const ProductRepositoryService = {
  provide: PRODUCT_REPOSITORY,
  inject: [DATABASE_PROVIDER],
  useFactory: async (database: DatabaseOperator) => {
    return database.getRepository(Product)
  },
}

export type ProductRepository = GetProviderType<typeof ProductRepositoryService>
