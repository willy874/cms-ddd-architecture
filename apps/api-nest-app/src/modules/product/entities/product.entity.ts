import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity({
  name: 'products',
})
export class Product {
  @PrimaryColumn()
  id: number

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  name: string
}
