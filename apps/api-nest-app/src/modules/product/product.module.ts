import { Module } from '@nestjs/common'
import { ProductController } from './product.controller'
import { DatabaseModule } from '@/shared/database'
import { productRepositoryProvider } from './product.repository'
import { ProductService } from './product.service'

@Module({
  imports: [DatabaseModule],
  providers: [productRepositoryProvider, ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
