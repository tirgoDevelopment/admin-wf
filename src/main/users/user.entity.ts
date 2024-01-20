import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Staff } from '../staffs/staff.entity';
// import { Transaction } from '../transactions/transaction.entity';

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

    // @OneToMany(() => Transaction, (transaction) => transaction.user)
    // transactions: Transaction[];
}
