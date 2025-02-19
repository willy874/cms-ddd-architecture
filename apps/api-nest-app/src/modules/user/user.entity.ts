import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm'
import { Role } from '../role/role.entity'

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

  @ManyToMany(() => Role, role => role.id)
  roles: Role[]
}
