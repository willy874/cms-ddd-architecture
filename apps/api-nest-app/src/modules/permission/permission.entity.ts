import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity({
  name: 'permissions',
})
export class Permission {
  @PrimaryColumn()
  id: number

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  name: string
}
