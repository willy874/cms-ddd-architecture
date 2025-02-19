import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm'
import { Permission } from '../permission/permission.entity'

@Entity({
  name: 'roles',
})
export class Role {
  @PrimaryColumn()
  id: number

  @Column({
    type: 'varchar',
    length: 255,
  })
  name: string

  @ManyToMany(() => Permission, permission => permission.id)
  permissions: Permission[]
}
