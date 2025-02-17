import { Inject, Injectable } from '@nestjs/common'
import { Database, DATABASE_PROVIDER } from '@/shared/database'
import { INJECT_PRODUCT_REPOSITORY, ProductRepository } from '../providers'

@Injectable()
export class ProductService {
  constructor(
    @Inject(DATABASE_PROVIDER)
    private database: Database,
    @Inject(INJECT_PRODUCT_REPOSITORY)
    private productRepository: ProductRepository,
  ) {}

  async all() {
    console.log(await this.database.query('SELECT * FROM products'))
    return await this.productRepository.find()
  }
}
