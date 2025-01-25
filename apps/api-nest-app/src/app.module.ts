import { config } from 'dotenv'
import { join } from 'node:path'
import { cwd } from 'node:process'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { User } from './product/entity'

const output = config({ path: join(cwd(), '.env') })
const env = Object.assign({}, process.env, output.parsed)

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: env.DATABASE_HOST,
      port: parseInt(env.DATABASE_PORT, 10),
      username: env.DATABASE_USER,
      password: env.DATABASE_PASSWORD,
      database: env.DATABASE_NAME,
      entities: [User],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
