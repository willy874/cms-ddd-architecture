import { Controller, Get } from '@nestjs/common'
import { ProductService } from './product.service'

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  async getProducts() {
    return {
      code: 200,
      data: await this.productService.all(),
    }
  }
}
