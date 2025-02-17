import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity({
  name: 'users',
})
export class User {
  @PrimaryColumn()
  id: number

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  username: string

  @Column({
    type: 'varchar',
    length: 255,
  })
  password: string
}
