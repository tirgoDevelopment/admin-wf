import { Client } from 'src/main/clients/client.entity';
import { CargoType } from 'src/main/references/entities/cargo-type.entity';
import { Currency } from 'src/main/references/entities/currency.entity';
import { TransportType } from 'src/main/references/entities/transport-type.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Timestamp } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @ManyToOne(() => Client, client => client.orders)
  client: Client;

  // driverId

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

  @Column({ nullable: true })
  cargoStatus: number;

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