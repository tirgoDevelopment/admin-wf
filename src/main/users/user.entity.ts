import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Timestamp } from 'typeorm';
import { Role } from '../role/entities/role.entity';
import { TransportType } from '../references/entities/transport-type.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, name: 'fullname' })
  fullName: string;

  @Column({ nullable: false, unique: true })
  username: string;

  @Column({ nullable: false })
  phone: string;

  @ManyToOne(() => Role, role => role.users)
  role: Role;

  @OneToMany(() => TransportType, transportType => transportType.createdBy)
  transportTypes: TransportType[];

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  createdAt: Date;

  @Column({ default: true })
  active: boolean;

  @Column({ default: false })
  deleted: boolean;
}