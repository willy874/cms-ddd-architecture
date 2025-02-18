import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { ProductModule } from './modules/product'
import { AuthModule } from './modules/auth'
import httpConfigLoad from './shared/config/app'
import databaseConfigLoad from './shared/config/database'
import cacheConfigLoad from './shared/config/cache'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [
        httpConfigLoad,
        databaseConfigLoad,
        cacheConfigLoad,
      ],
    }),
    ProductModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
