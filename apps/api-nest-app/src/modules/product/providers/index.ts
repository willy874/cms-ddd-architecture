import type { GetProviderType } from '@/utils/types'
import { productRepositoryProvider } from './product.repository'
export { INJECT_KEY as INJECT_PRODUCT_REPOSITORY } from './product.repository'

export type ProductRepository = GetProviderType<typeof productRepositoryProvider>

export const providers = [productRepositoryProvider]
