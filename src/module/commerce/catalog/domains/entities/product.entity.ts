import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { CategoryEntity } from './category.entity';
import { BrandEntity } from './brand.entity';
import { ProductVariantEntity } from './product-variant.entity';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 200, unique: true })
  slug: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'json', nullable: true })
  specifications: Record<string, string>;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  // Relations
  @ManyToOne(() => CategoryEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'categoryId' })
  category: CategoryEntity;

  @Column({ type: 'char', length: 36 })
  categoryId: string;

  @ManyToOne(() => BrandEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'brandId' })
  brand: BrandEntity;

  @Column({ type: 'char', length: 36, nullable: true })
  brandId: string;

  @OneToMany(() => ProductVariantEntity, (variant) => variant.product, {
    cascade: true,
  })
  variants: ProductVariantEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
