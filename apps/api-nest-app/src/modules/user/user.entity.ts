import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Role } from '../role/role.entity'

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
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

  @ManyToMany(() => Role, role => role.id, {
    cascade: true,
  })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'roleId', referencedColumnName: 'id' },
  })
  roles: Role[]
}
