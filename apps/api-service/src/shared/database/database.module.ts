import { Module } from '@nestjs/common'
import { DatabaseProvider } from './drizzle-orm/database.provider'
// import { DatabaseProvider } from './typeorm/database.provider'

@Module({
  imports: [],
  providers: [DatabaseProvider],
  exports: [DatabaseProvider],
})
export class DatabaseModule {}
