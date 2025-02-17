import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { ProductModule } from './modules/product'
import { AuthModule } from './modules/auth'

@Module({
  imports: [
    ProductModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
