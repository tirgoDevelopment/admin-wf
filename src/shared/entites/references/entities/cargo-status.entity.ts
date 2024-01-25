import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CargoTypeGroup } from './cargo-type-group.entity';
import { Order } from '../../orders/entities/order.entity';

@Entity()
export class CargoStatus {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column({ nullable: false, unique: true })
  name: string;

  @Column({ nullable: true })
  code: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  createdAt: Date;

  @Column({ default: true })
  active: boolean;

  @Column({ default: false })
  deleted: boolean;

  @OneToMany(() => Order, order => order.cargoStatus)
  orders: Order[];
}