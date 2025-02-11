import { Product } from '../product.entity'
import { Database, INJECT_DATABASE } from '../../core/inject'

export const INJECT_KEY = 'PRODUCT_REPOSITORY'

export const productRepositoryProvider = {
  provide: INJECT_KEY,
  inject: [INJECT_DATABASE],
  useFactory: async (database: Database) => {
    return database.getRepository(Product)
  },

}
