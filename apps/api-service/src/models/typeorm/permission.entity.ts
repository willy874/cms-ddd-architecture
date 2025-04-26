import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Role } from './role.entity'

@Entity({
  name: 'permissions',
})
export class Permission {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  name: string

  @Column({
    type: 'text',
  })
  description: string

  @ManyToMany(() => Role, roles => roles.permissions)
  roles: Role[]
}
