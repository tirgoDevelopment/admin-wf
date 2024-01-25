import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Client } from '../../clients/client.entity';
import { Currency } from '../../references/entities/currency.entity';
import { CargoType } from '../../references/entities/cargo-type.entity';
import { TransportType } from '../../references/entities/transport-type.entity';
import { Driver } from '../../driver/entities/driver.entity';
import { CargoPackage } from '../../references/entities/cargo-package.entity';
import { CargoLoadMethod } from '../../references/entities/cargo-load-method.entity';
import { TransportKind } from '../../references/entities/transport-kind.entity';
import { CargoStatus } from '../../references/entities/cargo-status.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @ManyToOne(() => Client, client => client.orders)
  client: Client;

  @ManyToOne(() => Driver, driver => driver.orders)
  driver: Driver;

  @Column({ nullable: true })
  sendDate: Date;

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

  @ManyToOne(() => TransportKind, transportKind => transportKind.orders)
  transportKind: TransportKind;

  @Column({ nullable: true })
  isSafeTransaction: boolean;

  @Column({ nullable: true })
  loadingLocation: string;

  @Column({ nullable: true })
  deliveryLocation: string;

  @Column({ nullable: true })
  volume: number

  @ManyToOne(() => CargoLoadMethod, cargoLoadMethod => cargoLoadMethod.orders)
  loadingMethod?: CargoLoadMethod

  @ManyToOne(() => CargoPackage, cargoPackage => cargoPackage.orders)
  cargoPackage?: CargoPackage;

  @ManyToOne(() => CargoStatus, cargoStatus => cargoStatus.orders)
  cargoStatus?: CargoStatus;

  @Column({ nullable: true })
  customsPlaceLocation?: string;

  @Column({ nullable: true })
  customsClearancePlaceLocation?: string;

  @Column({ nullable: true })
  additionalLoadingLication?: string;

  @Column({ nullable: true })
  additionalLoadingLocation?: string;

  @Column({ nullable: true })
  isAdr?: boolean;

  @Column({ nullable: true })
  isCarnetTir?: string;

  @Column({ nullable: true })
  isGlonas?: boolean;

  @Column({ nullable: true })
  isParanom?: boolean;

  @Column({ nullable: true })
  offeredPrice?: number;

  @Column({ nullable: true })
  paymentMethod?: string;

  @Column({ nullable: true })
  inAdvancePrice?: number;

  @ManyToOne(() => Currency, currency => currency.offeredOrders)
  offeredPriceCurrency: Currency;

  @ManyToOne(() => Currency, currency => currency.inAdvanceOrders)
  inAdvancePriceCurrency: Currency;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  createdAt: Date;

  @Column({ default: true })
  active: boolean;

  @Column({ default: false })
  deleted: boolean;

  @Column({ default: false })
  canceled: boolean;
}