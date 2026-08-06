import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { WarehouseEntity } from './warehouse.entity';
import { ProductVariantEntity } from '../../../catalog/domains/entities/product-variant.entity';

@Entity('stock_items')
@Unique(['warehouseId', 'productVariantId'])
export class StockItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', default: 0 })
  physicalStock: number; // Fisik barang riil di gudang

  @Column({ type: 'int', default: 0 })
  reservedStock: number; // Barang di keranjang/transaksi (belum dibayar lunas)

  @Column({ type: 'int', default: 0 })
  minStockAlert: number; // Batas peringatan stok menipis

  @ManyToOne(() => WarehouseEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'warehouseId' })
  warehouse: WarehouseEntity;

  @Column({ type: 'char', length: 36 })
  warehouseId: string;

  @ManyToOne((): typeof ProductVariantEntity => ProductVariantEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productVariantId' })
  productVariant: ProductVariantEntity;

  @Column({ type: 'char', length: 36 })
  productVariantId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
