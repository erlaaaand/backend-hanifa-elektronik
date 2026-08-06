import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICatalogRepository } from './catalog.repository.interface';
import { CategoryEntity } from '../../domains/entities/category.entity';
import { BrandEntity } from '../../domains/entities/brand.entity';
import { ProductEntity } from '../../domains/entities/product.entity';
import { ProductVariantEntity } from '../../domains/entities/product-variant.entity';

@Injectable()
export class CatalogRepository implements ICatalogRepository {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: Repository<CategoryEntity>,
    @InjectRepository(BrandEntity)
    private readonly brandRepo: Repository<BrandEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
    @InjectRepository(ProductVariantEntity)
    private readonly variantRepo: Repository<ProductVariantEntity>,
  ) {}

  async createCategory(
    category: Partial<CategoryEntity>,
  ): Promise<CategoryEntity> {
    const newCat = this.categoryRepo.create(category);
    return this.categoryRepo.save(newCat);
  }
  async findCategories(): Promise<CategoryEntity[]> {
    return this.categoryRepo.find({ relations: ['children'] });
  }
  async findCategoryById(id: string): Promise<CategoryEntity | null> {
    return this.categoryRepo.findOne({ where: { id } });
  }

  async createBrand(brand: Partial<BrandEntity>): Promise<BrandEntity> {
    const newBrand = this.brandRepo.create(brand);
    return this.brandRepo.save(newBrand);
  }
  async findBrands(): Promise<BrandEntity[]> {
    return this.brandRepo.find();
  }
  async findBrandById(id: string): Promise<BrandEntity | null> {
    return this.brandRepo.findOne({ where: { id } });
  }

  async createProduct(product: Partial<ProductEntity>): Promise<ProductEntity> {
    const newProd = this.productRepo.create(product);
    return this.productRepo.save(newProd);
  }
  async findProducts(
    search?: string,
    page = 1,
    limit = 10,
  ): Promise<{ data: ProductEntity[]; total: number }> {
    const query = this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.variants', 'variants');

    if (search) {
      query.where('product.name LIKE :search', { search: `%${search}%` });
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }
  async findProductBySlug(slug: string): Promise<ProductEntity | null> {
    return this.productRepo.findOne({
      where: { slug },
      relations: ['category', 'brand', 'variants'],
    });
  }
  async findProductById(id: string): Promise<ProductEntity | null> {
    return this.productRepo.findOne({
      where: { id },
      relations: ['category', 'brand', 'variants'],
    });
  }

  async createProductVariant(
    variant: Partial<ProductVariantEntity>,
  ): Promise<ProductVariantEntity> {
    const newVar = this.variantRepo.create(variant);
    return this.variantRepo.save(newVar);
  }
}
