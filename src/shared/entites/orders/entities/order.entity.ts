import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Timestamp } from 'typeorm';
import { Client } from '../../clients/client.entity';
import { Currency } from '../../references/entities/currency.entity';
import { CargoType } from '../../references/entities/cargo-type.entity';
import { TransportType } from '../../references/entities/transport-type.entity';
import { CargoStatus } from '../../references/entities/cargo-status.entity';
import { Driver } from '../../driver/entities/driver.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @ManyToOne(() => Client, client => client.orders)
  client: Client;

  @ManyToOne(() => Driver, driver => driver.orders)
  driver: Driver;

  @Column({ nullable: true })
  sendDate: Date;

  @Column({ nullable: true })
  sendTime: string;

  @Column({ nullable: true })
  isUrgent: boolean;

  @Column({ nullable: true })
  isDangerousCargo: boolean;

  @ManyToOne(() => Currency, currency => currency.orders)
  currency: Currency;

  @Column({ nullable: true })
  offeredPrice: number;

  @ManyToOne(() => CargoType, cargoType => cargoType.orders)
  cargoType: CargoType;

  @Column({ nullable: true })
  cargoWeight: number;

  @Column({ nullable: true })
  cargoLength: number;

  @Column({ nullable: true })
  cargiWidth: number;

  @Column({ nullable: true })
  cargoHeight: number;

  @ManyToOne(() => TransportType, cargoType => cargoType.orders)
  transportType: TransportType;

  @ManyToOne(() => CargoStatus, cargoStatus => cargoStatus.orders)
  cargoStatus: CargoStatus;

  @Column({ nullable: true })
  isSafeTransaction: boolean;

  @Column({ nullable: true })
  sendLocation: string;

  @Column({ nullable: true })
  deliveryLocation: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  createdAt: Date;

  @Column({ default: true })
  active: boolean;

  @Column({ default: false })
  deleted: boolean;
}