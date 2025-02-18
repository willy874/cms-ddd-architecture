import { Inject, Injectable } from '@nestjs/common'
import { DatabaseOperator, DATABASE_PROVIDER } from '@/shared/database'
import { PRODUCT_REPOSITORY, ProductRepository } from './product.repository'

@Injectable()
export class ProductService {
  constructor(
    @Inject(DATABASE_PROVIDER)
    private database: DatabaseOperator,
    @Inject(PRODUCT_REPOSITORY)
    private productRepository: ProductRepository,
  ) {}

  async all() {
    return await this.productRepository.find()
  }
}
