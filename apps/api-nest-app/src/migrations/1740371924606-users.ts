import { User } from '../entities/user.entity'
import { MigrationInterface, QueryRunner, Table, EntitySchema, DataSource } from 'typeorm'

export class Users1740371924606 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('queryRunner')
    console.log(queryRunner.manager.getRepository(User).metadata.columns[0].type)
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'username',
            type: 'varchar',
            length: '255',
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
            length: '255',
          },
        ],
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }
}
