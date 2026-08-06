import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { WarehouseEntity } from './warehouse.entity';
import { ProductVariantEntity } from '../../../catalog/domains/entities/product-variant.entity';
import {
  StockMovementType,
  StockMovementStatus,
} from '../enums/stock-movement.enum';

@Entity('stock_movements')
export class StockMovementEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: StockMovementType })
  type: StockMovementType;

  @Column({
    type: 'enum',
    enum: StockMovementStatus,
    default: StockMovementStatus.COMPLETED,
  })
  status: StockMovementStatus;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  reference: string; // PO Number, Order ID, Transfer ID

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column({ type: 'char', length: 36, nullable: true })
  actorId: string; // Siapa yang melakukan transaksi (UUID)

  @ManyToOne(() => WarehouseEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'warehouseId' })
  warehouse: WarehouseEntity;

  @Column({ type: 'char', length: 36 })
  warehouseId: string;

  @ManyToOne((): typeof ProductVariantEntity => ProductVariantEntity, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'productVariantId' })
  productVariant: ProductVariantEntity;

  @Column({ type: 'char', length: 36 })
  productVariantId: string;

  @CreateDateColumn()
  createdAt: Date;
}
