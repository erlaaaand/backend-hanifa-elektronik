import { DeepPartial } from 'typeorm';
import { CategoryEntity } from '../../domains/entities/category.entity';
import { BrandEntity } from '../../domains/entities/brand.entity';
import { ProductEntity } from '../../domains/entities/product.entity';
import { ProductVariantEntity } from '../../domains/entities/product-variant.entity';

export const CATALOG_REPOSITORY_TOKEN = Symbol('CATALOG_REPOSITORY_TOKEN');

export interface ICatalogRepository {
  // Category
  createCategory(
    category: DeepPartial<CategoryEntity>,
  ): Promise<CategoryEntity>;
  findCategories(): Promise<CategoryEntity[]>;
  findCategoryById(id: string): Promise<CategoryEntity | null>;

  // Brand
  createBrand(brand: DeepPartial<BrandEntity>): Promise<BrandEntity>;
  findBrands(): Promise<BrandEntity[]>;
  findBrandById(id: string): Promise<BrandEntity | null>;

  // Product
  createProduct(product: DeepPartial<ProductEntity>): Promise<ProductEntity>;
  findProducts(
    search?: string,
    page?: number,
    limit?: number,
  ): Promise<{ data: ProductEntity[]; total: number }>;
  findProductBySlug(slug: string): Promise<ProductEntity | null>;
  findProductById(id: string): Promise<ProductEntity | null>;

  // Variant
  createProductVariant(
    variant: DeepPartial<ProductVariantEntity>,
  ): Promise<ProductVariantEntity>;
}
