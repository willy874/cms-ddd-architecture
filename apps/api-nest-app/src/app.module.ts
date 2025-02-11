import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { ProductModule } from './modules/product'

@Module({
  imports: [
    ProductModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
