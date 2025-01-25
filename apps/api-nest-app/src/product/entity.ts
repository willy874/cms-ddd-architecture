import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export class User {
  @PrimaryColumn()
  id: number

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  email: string

  @Column({
    type: 'varchar',
    length: 255,
  })
  password: string

  @Column({
    type: 'varchar',
    length: 255,
    name: 'first_name',
  })
  firstName: string
}
