import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SubscriptionPayment } from './subscription-payment.entity';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  name: string;

  @Column({ nullable: false })
  duration: number;

  @Column({ nullable: false })
  price: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  createdAt: Date;

  @Column({ default: true })
  active: boolean;

  @Column({ default: false })
  deleted: boolean;

  @OneToOne(() => SubscriptionPayment, (subscriptionPayment) => subscriptionPayment.subscription, { cascade: true })
  @JoinColumn({ name: 'subscription_payment_id' })
  subscriptionPayment: SubscriptionPayment;
}