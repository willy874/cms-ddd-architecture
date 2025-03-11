import { DataSource, DataSourceOptions, EntityTarget, ObjectLiteral } from "typeorm";
import { Repository } from "./Repository";

export type DatabaseConstructor = DataSourceOptions

export class Database {
  private instance: DataSource

  constructor(options: DatabaseConstructor) {
    this.instance = new DataSource(options)
  }

  async connection() {
    await this.instance.initialize()
    return this.instance
  }

  async createRepository<T extends ObjectLiteral>(target: EntityTarget<T>): Promise<Repository<T>> {
    return new Repository(this.instance.getRepository(target))
  }
}