import { Module } from '@nestjs/common'
import { ProductController } from './product.controller'
import { DatabaseModule } from '@/shared/database'
import { providers } from './providers'
import { services } from './services'

@Module({
  imports: [DatabaseModule],
  providers: [...providers, ...services],
  controllers: [ProductController],
})
export class ProductModule {}
