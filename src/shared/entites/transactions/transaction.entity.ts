import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Currency } from '../references/entities/currency.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  amount: number;

  @Column({ nullable: true, default: 0, name: 'tax_amount' })
  taxAmount: number;

  @Column({ nullable: true, default: 0, name: 'additional_amount' })
  additionalAmount: number;

  @Column({ nullable: false, name: 'transaction_type' })
  transactionType: string;

  @Column({ nullable: false, name: 'user_type' })
  userType: string;
  
  @Column({ nullable: true })
  comment: string;
  
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  createdAt: Date;  
  
  @Column({ default: false })
  rejected: boolean;
  
  @Column({ default: false })
  verified: boolean;
  
  @Column({ default: true })
  active: boolean;
  
  @Column({ default: false })
  deleted: boolean;
  
  @ManyToOne(() => Currency, (currency) => currency.transactions)
  @JoinColumn({ name: 'currency_id' })
  currency: Currency;

  @ManyToOne(() => User, (user) => user.transactions)
  @JoinColumn({ name: 'user_id' })
  user: User;
}