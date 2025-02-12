import { Product } from '../entities'
import { Database, INJECT_DATABASE } from '@/shared/database'

export const INJECT_KEY = 'PRODUCT_REPOSITORY'

export const productRepositoryProvider = {
  provide: INJECT_KEY,
  inject: [INJECT_DATABASE],
  useFactory: async (database: Database) => {
    return database.getRepository(Product)
  },

}
