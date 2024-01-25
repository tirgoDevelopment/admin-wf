import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Staff } from '../../staffs/staff.entity';
import { Order } from '../../orders/entities/order.entity';

@Entity()
export class TransportType {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column({ nullable: false, unique: true })
  name: string;

  @Column({ nullable: false, name: 'load_side' })
  loadSide: string;

  @Column({ nullable: false })
  capacity: string;

  @Column({ nullable: false })
  volume: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Staff, user => user.transportTypes)
  createdBy: Staff;

  @Column({ default: true })
  active: boolean;

  @Column({ default: false })
  deleted: boolean;

  @OneToMany(() => Order, order => order.transportType)
  orders: Order[];
}