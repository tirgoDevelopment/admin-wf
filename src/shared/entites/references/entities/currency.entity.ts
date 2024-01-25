import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { Transaction } from '../../transactions/transaction.entity';

@Entity()
export class Currency {
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

  @OneToMany(() => Order, order => order.inAdvancePriceCurrency)
  inAdvanceOrders: Order[];

  @OneToMany(() => Order, order => order.offeredPriceCurrency)
  offeredOrders: Order[];
  
  @OneToMany(() => Transaction, (transaction) => transaction.currency)
  transactions: Transaction[];
}