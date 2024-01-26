import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Staff } from '../staffs/staff.entity';
import { Transaction } from '../transactions/transaction.entity';
import { Client } from '../clients/client.entity';
import { Driver } from '../driver/entities/driver.entity';
import { SubscriptionPayment } from '../references/entities/subscription-payment.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, name: 'user_type' })
    userType: string;

    // OneToOne relationship with Client
    @OneToOne(() => Staff, (staff) => staff.user, { cascade: true })
    @JoinColumn({ name: 'staff_id' })
    staff: Staff;

    // OneToOne relationship with Client
    @OneToOne(() => Client, (client) => client.user, { cascade: true })
    @JoinColumn({ name: 'client_id' })
    client: Client;

    // OneToOne relationship with Client
    @OneToOne(() => Driver, (driver) => driver.user, { cascade: true })
    @JoinColumn({ name: 'driver_id' })
    driver: Driver;

    @OneToOne(() => SubscriptionPayment, (subscriptionPayment) => subscriptionPayment.user, { cascade: true })
    @JoinColumn({ name: 'subscription_payment_id' })
    subscriptionPayment: SubscriptionPayment;


    @OneToMany(() => Transaction, (transaction) => transaction.user)
    transactions: Transaction[];
}
