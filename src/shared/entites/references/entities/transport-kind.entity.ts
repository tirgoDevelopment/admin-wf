import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Staff } from '../../staffs/staff.entity';
import { Order } from '../../orders/entities/order.entity';
import { OrderTransportKind } from './order-transport-kind.entity';

@Entity()
export class TransportKind {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column({ nullable: false, unique: true })
  name: string;

  @Column({ nullable: true })
  isMode: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Staff, user => user.transportTypes)
  createdBy: Staff;

  @Column({ default: true })
  active: boolean;

  @Column({ default: false })
  deleted: boolean;

  @ManyToMany(() => Order, order => order.transportKinds)
  @JoinTable()
    orders: Order[];

  @OneToMany(() => OrderTransportKind, orderTransportKind => orderTransportKind.transportKind)
  orderTransportKinds: OrderTransportKind[];

}