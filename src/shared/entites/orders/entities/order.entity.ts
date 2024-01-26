import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Client } from '../../clients/client.entity';
import { Currency } from '../../references/entities/currency.entity';
import { CargoType } from '../../references/entities/cargo-type.entity';
import { TransportType } from '../../references/entities/transport-type.entity';
import { Driver } from '../../driver/entities/driver.entity';
import { CargoPackage } from '../../references/entities/cargo-package.entity';
import { CargoLoadMethod } from '../../references/entities/cargo-load-method.entity';
import { TransportKind } from '../../references/entities/transport-kind.entity';
import { CargoStatus } from '../../references/entities/cargo-status.entity';
import { OrderTransportKind } from '../../references/entities/order-transport-kind.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @ManyToOne(() => Client, client => client.orders)
  client: Client;

  @ManyToOne(() => Client, client => client.additionalOrders)
  additionalClient: Client;

  @ManyToOne(() => Driver, driver => driver.orders)
  driver: Driver;

  @Column({ nullable: true, name: 'send_date' })
  sendDate: Date;

  @ManyToOne(() => CargoType, cargoType => cargoType.orders)
  @JoinColumn({ name: 'cargo_type_id' })
  cargoType: CargoType;

  @Column({ nullable: true, name: 'cargo_weight' })
  cargoWeight: number;

  @Column({ nullable: true, name: 'cargo_length' })
  cargoLength: number;

  @Column({ nullable: true, name: 'cargo_width' })
  cargiWidth: number;

  @Column({ nullable: true, name: 'cargo_height' })
  cargoHeight: number;

  @ManyToOne(() => TransportType, cargoType => cargoType.orders)
  @JoinColumn({ name: 'transport_type_id' })
  transportType: TransportType;

  @OneToMany(() => OrderTransportKind, orderTransportKind => orderTransportKind.order)
  orderTransportKinds: OrderTransportKind[];

  @ManyToMany(() => TransportKind, transportKind => transportKind.orders)
  @JoinTable()
  transportKinds: TransportKind[];

  @Column({ nullable: true, name: 'is_safe_transaction' })
  isSafeTransaction: boolean;

  @Column({ nullable: true, name: 'loading_location' })
  loadingLocation: string;

  @Column({ nullable: true, name: 'delivery_location' })
  deliveryLocation: string;

  @Column({ nullable: true })
  volume: number

  @ManyToOne(() => CargoLoadMethod, cargoLoadMethod => cargoLoadMethod.orders)
  @JoinColumn({ name: 'loading_method_id' })
  loadingMethod?: CargoLoadMethod

  @ManyToOne(() => CargoPackage, cargoPackage => cargoPackage.orders)
  @JoinColumn({ name: 'cargo_package_id' })
  cargoPackage?: CargoPackage;

  @ManyToOne(() => CargoStatus, cargoStatus => cargoStatus.orders)
  @JoinColumn({ name: 'cargo_status_id' })
  cargoStatus?: CargoStatus;

  @Column({ nullable: true, name: 'customs_place_location' })
  customsPlaceLocation?: string;

  @Column({ nullable: true, name: 'customs_clearance_place_location' })
  customsClearancePlaceLocation?: string;

  @Column({ nullable: true, name: 'additional_loading_location' })
  additionalLoadingLocation?: string;

  @Column({ nullable: true, name: 'refrigerator_from' })
  refrigeratorFrom?: string;

  @Column({ nullable: true, name: 'refrigerator_to' })
  refrigeratorTo?: string;

  @Column({ nullable: true, name: 'refrigerator_count' })
  refrigeratorCount?: number;

  @Column({ nullable: true, name: 'is_adr' })
  isAdr?: boolean;

  @Column({ nullable: true, name: 'is_carnet_tir' })
  isCarnetTir?: string;

  @Column({ nullable: true, name: 'is_glonas' })
  isGlonas?: boolean;

  @Column({ nullable: true, name: 'is_paranom' })
  isParanom?: boolean;

  @Column({ nullable: true, name: 'offered_price' })
  offeredPrice?: number;

  @Column({ nullable: true, name: 'payment_method' })
  paymentMethod?: string;

  @Column({ nullable: true, name: 'in_advance_price' })
  inAdvancePrice?: number;

  @ManyToOne(() => Currency, currency => currency.offeredOrders)
  @JoinColumn({ name: 'offered_price_currency' })
  offeredPriceCurrency: Currency;

  @ManyToOne(() => Currency, currency => currency.inAdvanceOrders)
  @JoinColumn({ name: 'in_advance_price_currency' })
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