import { Column, Entity, PrimaryColumn } from 'typeorm'

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
}
