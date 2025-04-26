import { DataSource, DataSourceOptions } from 'typeorm'

export type DatabaseConstructor = DataSourceOptions

export class Database {
  instance: DataSource

  constructor(options: DatabaseConstructor) {
    this.instance = new DataSource(options)
  }

  async connection() {
    await this.instance.initialize()
    return this
  }
}
