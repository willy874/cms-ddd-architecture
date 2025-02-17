import { Inject, Injectable } from '@nestjs/common'
import { DatabaseOperator, DATABASE_PROVIDER } from '@/shared/database'
import { INJECT_PRODUCT_REPOSITORY, ProductRepository } from '../providers'

@Injectable()
export class ProductService {
  constructor(
    @Inject(DATABASE_PROVIDER)
    private database: DatabaseOperator,
    @Inject(INJECT_PRODUCT_REPOSITORY)
    private productRepository: ProductRepository,
  ) {}

  async all() {
    return await this.productRepository.find()
  }
}
