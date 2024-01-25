import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Driver } from './driver.entity';
import { TransportVerification } from './transport-verification.entity';
import { TransportType } from '../../references/entities/transport-type.entity';

@Entity()
export class DriverTransport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true, name: 'cubic_capacity' })
  cubicCapacity?: string;

  @Column({ nullable: true, name: 'state_number' })
  stateNumber?: string

  @Column({ nullable: true, name: 'is_adr' })
  isAdr?: boolean;

  @Column({ nullable: true, name: 'tech_passport_front_photo_path' })
  techPassportFrontPhotoPath?: string;

  @Column({ nullable: true, name: 'tech_passport_back_photo_path' })
  techPassportBackPhotoPath?: string;

  @Column({ nullable: true, name: 'transport_photo_path' })
  transportPhotoPath?: string;

  @Column({ nullable: true, name: 'goods_transportation_license_card_photo_path' })
  goodsTransportationLicenseCardPhotoPath?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  createdAt: Date;  

  @Column({ default: true })
  active: boolean;

  @Column({ default: false })
  deleted: boolean;

  @OneToOne(() => TransportType, { cascade: true })
  @JoinColumn({ name: 'transport_type_id' })
  transportType: TransportType;

  @OneToOne(() => Driver, (driver) => driver.driverTransport)
  @JoinColumn({ name: 'driver_id' })
  driver: Driver;

  @OneToOne(() => TransportVerification, { cascade: true })
  @JoinColumn({ name: 'transport_verification_id' })
  transportVerification: TransportVerification;
}