import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/user.entity';
import { Subscription } from './subscription.entity';

@Entity()
export class SubscriptionPayment {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.subscriptionPayment)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToOne(() => Subscription, (subscription) => subscription.subscriptionPayment)
  @JoinColumn({ name: 'subscription_id' })
  subscription: Subscription;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  createdAt: Date;

  @Column({ default: true })
  active: boolean;

  @Column({ default: false })
  deleted: boolean;
}