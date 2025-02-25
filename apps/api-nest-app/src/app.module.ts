import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { ProductModule } from './modules/product'
import { AuthModule } from './modules/auth'
import { UserModule } from './modules/user'
import httpConfigLoad from './shared/config/http'
import databaseConfigLoad from './shared/config/database'
import cacheConfigLoad from './shared/config/cache'
import devConfigLoad from './shared/config/dev'
import { RoleModule } from './modules/role/role.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [
        httpConfigLoad,
        databaseConfigLoad,
        cacheConfigLoad,
        devConfigLoad,
      ],
    }),
    ProductModule,
    UserModule,
    RoleModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
