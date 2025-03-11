import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({
  name: 'products',
})
export class Product {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  name: string
}
