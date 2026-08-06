import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity('product_variants')
export class ProductVariantEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 50, unique: true })
  sku: string; // Stock Keeping Unit

  @Column({ type: 'varchar', length: 100, nullable: true })
  barcode: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  name: string; // e.g., "Color: Black, Size: XL"

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  purchasePrice: number; // Harga Beli (HPP - Internal)

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  sellingPrice: number; // Harga Jual Publik

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ManyToOne(() => ProductEntity, (product) => product.variants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: ProductEntity;

  @Column({ type: 'char', length: 36 })
  productId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
