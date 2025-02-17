import { Module } from '@nestjs/common'
import { MysqlModule } from './mysql/mysql.module'
import { databaseProvider } from './database.provider'

@Module({
  imports: [MysqlModule],
  providers: [databaseProvider],
  exports: [databaseProvider],
})
export class DatabaseModule {}
