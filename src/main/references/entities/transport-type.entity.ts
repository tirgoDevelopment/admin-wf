import { User } from 'src/main/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  @ManyToOne(() => User, user => user.transportTypes)
  createdBy: User;

  @Column({ default: true })
  active: boolean;

  @Column({ default: false })
  deleted: boolean;
}