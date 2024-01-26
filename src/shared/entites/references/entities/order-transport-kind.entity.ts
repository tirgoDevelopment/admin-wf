import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { TransportKind } from './transport-kind.entity';

@Entity()
export class OrderTransportKind {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, order => order.orderTransportKinds)
  order: Order;

  @ManyToOne(() => TransportKind, transportKind => transportKind.orderTransportKinds)
  transportKind: TransportKind;
}