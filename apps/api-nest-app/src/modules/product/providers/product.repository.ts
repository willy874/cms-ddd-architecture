import { Product } from '../entities'
import { DatabaseOperator, DATABASE_PROVIDER } from '@/shared/database'

export const INJECT_KEY = 'PRODUCT_REPOSITORY'

export const productRepositoryProvider = {
  provide: INJECT_KEY,
  inject: [DATABASE_PROVIDER],
  useFactory: async (database: DatabaseOperator) => {
    return database.getRepository(Product)
  },

}
