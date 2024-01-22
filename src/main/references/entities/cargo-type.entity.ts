import { Staff } from 'src/main/staffs/staff.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CargoTypeGroup } from './cargo-type-group.entity';

@Entity()
export class CargoType {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column({ nullable: false, unique: true })
  name: string;

  @ManyToOne(() => CargoTypeGroup, cargoTypeGroup => cargoTypeGroup.cargoTypes)
  group: CargoTypeGroup;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  createdAt: Date;

  @Column({ default: true })
  active: boolean;

  @Column({ default: false })
  deleted: boolean;
}