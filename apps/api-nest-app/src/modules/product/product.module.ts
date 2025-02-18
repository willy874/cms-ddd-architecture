import { Module } from '@nestjs/common'
import { ProductController } from './product.controller'
import { DatabaseModule } from '@/shared/database'
import { ProductRepositoryService } from './product.repository'
import { ProductService } from './product.service'

@Module({
  imports: [DatabaseModule],
  providers: [ProductRepositoryService, ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
