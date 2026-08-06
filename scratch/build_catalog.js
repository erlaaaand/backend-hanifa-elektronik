const fs = require('fs');
const path = require('path');

const modDir = path.join(__dirname, '..', 'src', 'module', 'commerce', 'catalog');

const dirs = [
  'applications/dto',
  'applications/use-cases',
  'applications/orchestrator',
  'infrastructures/repositories',
  'interface/http'
];
for (const dir of dirs) {
  fs.mkdirSync(path.join(modDir, dir), { recursive: true });
}

const dtos = {
  'create-category.dto.ts': `import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  iconUrl?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  parentId?: string;

  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
`,
  'create-brand.dto.ts': `import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBrandDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  logoUrl?: string;

  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
`,
  'create-product.dto.ts': `import { IsString, IsOptional, IsBoolean, IsObject, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductVariantDto {
  @ApiProperty()
  @IsString()
  sku: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  barcode?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsNumber()
  purchasePrice: number;

  @ApiProperty()
  @IsNumber()
  sellingPrice: number;

  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  categoryId: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  brandId?: string;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  specifications?: Record<string, string>;

  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ type: [CreateProductVariantDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantDto)
  variants: CreateProductVariantDto[];
}
`,
  'query-catalog.dto.ts': `import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class QueryCatalogDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 10;
}
`
};

for (const [file, content] of Object.entries(dtos)) {
  fs.writeFileSync(path.join(modDir, 'applications', 'dto', file), content);
}

const repoInterface = `import { CategoryEntity } from '../../domains/entities/category.entity';
import { BrandEntity } from '../../domains/entities/brand.entity';
import { ProductEntity } from '../../domains/entities/product.entity';
import { ProductVariantEntity } from '../../domains/entities/product-variant.entity';

export const CATALOG_REPOSITORY_TOKEN = Symbol('CATALOG_REPOSITORY_TOKEN');

export interface ICatalogRepository {
  // Category
  createCategory(category: Partial<CategoryEntity>): Promise<CategoryEntity>;
  findCategories(): Promise<CategoryEntity[]>;
  findCategoryById(id: string): Promise<CategoryEntity | null>;
  
  // Brand
  createBrand(brand: Partial<BrandEntity>): Promise<BrandEntity>;
  findBrands(): Promise<BrandEntity[]>;
  findBrandById(id: string): Promise<BrandEntity | null>;
  
  // Product
  createProduct(product: Partial<ProductEntity>): Promise<ProductEntity>;
  findProducts(search?: string, page?: number, limit?: number): Promise<{ data: ProductEntity[]; total: number }>;
  findProductBySlug(slug: string): Promise<ProductEntity | null>;
  findProductById(id: string): Promise<ProductEntity | null>;
  
  // Variant
  createProductVariant(variant: Partial<ProductVariantEntity>): Promise<ProductVariantEntity>;
}
`;

fs.writeFileSync(path.join(modDir, 'infrastructures', 'repositories', 'catalog.repository.interface.ts'), repoInterface);

const repoImpl = `import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
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

  async createCategory(category: Partial<CategoryEntity>): Promise<CategoryEntity> {
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
  async findProducts(search?: string, page = 1, limit = 10): Promise<{ data: ProductEntity[]; total: number }> {
    const query = this.productRepo.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.variants', 'variants');

    if (search) {
      query.where('product.name LIKE :search', { search: \`%\${search}%\` });
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

  async createProductVariant(variant: Partial<ProductVariantEntity>): Promise<ProductVariantEntity> {
    const newVar = this.variantRepo.create(variant);
    return this.variantRepo.save(newVar);
  }
}
`;

fs.writeFileSync(path.join(modDir, 'infrastructures', 'repositories', 'catalog.repository.ts'), repoImpl);

const useCases = {
  'create-category.use-case.ts': `import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { CATALOG_REPOSITORY_TOKEN, ICatalogRepository } from '../../infrastructures/repositories/catalog.repository.interface';
import { CreateCategoryDto } from '../dto/create-category.dto';

@Injectable()
export class CreateCategoryUseCase {
  constructor(@Inject(CATALOG_REPOSITORY_TOKEN) private readonly catalogRepo: ICatalogRepository) {}
  async execute(dto: CreateCategoryDto) {
    const slug = dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return this.catalogRepo.createCategory({ ...dto, slug });
  }
}`,
  'find-categories.use-case.ts': `import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_REPOSITORY_TOKEN, ICatalogRepository } from '../../infrastructures/repositories/catalog.repository.interface';

@Injectable()
export class FindCategoriesUseCase {
  constructor(@Inject(CATALOG_REPOSITORY_TOKEN) private readonly catalogRepo: ICatalogRepository) {}
  async execute() {
    return this.catalogRepo.findCategories();
  }
}`,
  'create-brand.use-case.ts': `import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_REPOSITORY_TOKEN, ICatalogRepository } from '../../infrastructures/repositories/catalog.repository.interface';
import { CreateBrandDto } from '../dto/create-brand.dto';

@Injectable()
export class CreateBrandUseCase {
  constructor(@Inject(CATALOG_REPOSITORY_TOKEN) private readonly catalogRepo: ICatalogRepository) {}
  async execute(dto: CreateBrandDto) {
    const slug = dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return this.catalogRepo.createBrand({ ...dto, slug });
  }
}`,
  'find-brands.use-case.ts': `import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_REPOSITORY_TOKEN, ICatalogRepository } from '../../infrastructures/repositories/catalog.repository.interface';

@Injectable()
export class FindBrandsUseCase {
  constructor(@Inject(CATALOG_REPOSITORY_TOKEN) private readonly catalogRepo: ICatalogRepository) {}
  async execute() {
    return this.catalogRepo.findBrands();
  }
}`,
  'create-product.use-case.ts': `import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CATALOG_REPOSITORY_TOKEN, ICatalogRepository } from '../../infrastructures/repositories/catalog.repository.interface';
import { CreateProductDto } from '../dto/create-product.dto';

@Injectable()
export class CreateProductUseCase {
  constructor(@Inject(CATALOG_REPOSITORY_TOKEN) private readonly catalogRepo: ICatalogRepository) {}
  async execute(dto: CreateProductDto) {
    const category = await this.catalogRepo.findCategoryById(dto.categoryId);
    if (!category) throw new NotFoundException('Category not found');

    const slug = dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    
    return this.catalogRepo.createProduct({
      name: dto.name,
      description: dto.description,
      slug,
      categoryId: dto.categoryId,
      brandId: dto.brandId,
      specifications: dto.specifications,
      isActive: dto.isActive,
      variants: dto.variants as any,
    });
  }
}`,
  'find-products.use-case.ts': `import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_REPOSITORY_TOKEN, ICatalogRepository } from '../../infrastructures/repositories/catalog.repository.interface';
import { QueryCatalogDto } from '../dto/query-catalog.dto';

@Injectable()
export class FindProductsUseCase {
  constructor(@Inject(CATALOG_REPOSITORY_TOKEN) private readonly catalogRepo: ICatalogRepository) {}
  async execute(query: QueryCatalogDto) {
    return this.catalogRepo.findProducts(query.search, query.page, query.limit);
  }
}`,
  'find-product-by-slug.use-case.ts': `import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CATALOG_REPOSITORY_TOKEN, ICatalogRepository } from '../../infrastructures/repositories/catalog.repository.interface';

@Injectable()
export class FindProductBySlugUseCase {
  constructor(@Inject(CATALOG_REPOSITORY_TOKEN) private readonly catalogRepo: ICatalogRepository) {}
  async execute(slug: string) {
    const product = await this.catalogRepo.findProductBySlug(slug);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }
}`
};

for (const [file, content] of Object.entries(useCases)) {
  fs.writeFileSync(path.join(modDir, 'applications', 'use-cases', file), content);
}

const orchestrator = `import { Injectable } from '@nestjs/common';
import { CreateCategoryUseCase } from '../use-cases/create-category.use-case';
import { FindCategoriesUseCase } from '../use-cases/find-categories.use-case';
import { CreateBrandUseCase } from '../use-cases/create-brand.use-case';
import { FindBrandsUseCase } from '../use-cases/find-brands.use-case';
import { CreateProductUseCase } from '../use-cases/create-product.use-case';
import { FindProductsUseCase } from '../use-cases/find-products.use-case';
import { FindProductBySlugUseCase } from '../use-cases/find-product-by-slug.use-case';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { CreateBrandDto } from '../dto/create-brand.dto';
import { CreateProductDto } from '../dto/create-product.dto';
import { QueryCatalogDto } from '../dto/query-catalog.dto';

@Injectable()
export class CatalogOrchestrator {
  constructor(
    private readonly createCategoryUc: CreateCategoryUseCase,
    private readonly findCategoriesUc: FindCategoriesUseCase,
    private readonly createBrandUc: CreateBrandUseCase,
    private readonly findBrandsUc: FindBrandsUseCase,
    private readonly createProductUc: CreateProductUseCase,
    private readonly findProductsUc: FindProductsUseCase,
    private readonly findProductBySlugUc: FindProductBySlugUseCase,
  ) {}

  createCategory(dto: CreateCategoryDto) { return this.createCategoryUc.execute(dto); }
  findCategories() { return this.findCategoriesUc.execute(); }
  createBrand(dto: CreateBrandDto) { return this.createBrandUc.execute(dto); }
  findBrands() { return this.findBrandsUc.execute(); }
  createProduct(dto: CreateProductDto) { return this.createProductUc.execute(dto); }
  findProducts(query: QueryCatalogDto) { return this.findProductsUc.execute(query); }
  findProductBySlug(slug: string) { return this.findProductBySlugUc.execute(slug); }
}
`;

fs.writeFileSync(path.join(modDir, 'applications', 'orchestrator', 'catalog.orchestrator.ts'), orchestrator);

const controller = `import { Controller, Post, Get, Body, Query, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CatalogOrchestrator } from '../../applications/orchestrator/catalog.orchestrator';
import { CreateCategoryDto } from '../../applications/dto/create-category.dto';
import { CreateBrandDto } from '../../applications/dto/create-brand.dto';
import { CreateProductDto } from '../../applications/dto/create-product.dto';
import { QueryCatalogDto } from '../../applications/dto/query-catalog.dto';

@ApiTags('Commerce - Catalog')
@ApiBearerAuth('JWT')
@Controller('catalog')
export class CatalogController {
  constructor(private readonly orchestrator: CatalogOrchestrator) {}

  @Post('categories')
  @ApiOperation({ summary: 'Buat Kategori Baru' })
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.orchestrator.createCategory(dto);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Daftar Kategori' })
  findCategories() {
    return this.orchestrator.findCategories();
  }

  @Post('brands')
  @ApiOperation({ summary: 'Buat Brand Baru' })
  createBrand(@Body() dto: CreateBrandDto) {
    return this.orchestrator.createBrand(dto);
  }

  @Get('brands')
  @ApiOperation({ summary: 'Daftar Brand' })
  findBrands() {
    return this.orchestrator.findBrands();
  }

  @Post('products')
  @ApiOperation({ summary: 'Buat Produk Baru beserta variannya' })
  createProduct(@Body() dto: CreateProductDto) {
    return this.orchestrator.createProduct(dto);
  }

  @Get('products')
  @ApiOperation({ summary: 'Daftar Produk Terpaging' })
  findProducts(@Query() query: QueryCatalogDto) {
    return this.orchestrator.findProducts(query);
  }

  @Get('products/:slug')
  @ApiOperation({ summary: 'Detail Produk berdasarkan Slug' })
  findProductBySlug(@Param('slug') slug: string) {
    return this.orchestrator.findProductBySlug(slug);
  }
}
`;

fs.writeFileSync(path.join(modDir, 'interface', 'http', 'catalog.controller.ts'), controller);

const moduleFile = `import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogController } from './interface/http/catalog.controller';
import { CatalogOrchestrator } from './applications/orchestrator/catalog.orchestrator';
import { CatalogRepository } from './infrastructures/repositories/catalog.repository';
import { CATALOG_REPOSITORY_TOKEN } from './infrastructures/repositories/catalog.repository.interface';
import { CategoryEntity } from './domains/entities/category.entity';
import { BrandEntity } from './domains/entities/brand.entity';
import { ProductEntity } from './domains/entities/product.entity';
import { ProductVariantEntity } from './domains/entities/product-variant.entity';

// Use Cases
import { CreateCategoryUseCase } from './applications/use-cases/create-category.use-case';
import { FindCategoriesUseCase } from './applications/use-cases/find-categories.use-case';
import { CreateBrandUseCase } from './applications/use-cases/create-brand.use-case';
import { FindBrandsUseCase } from './applications/use-cases/find-brands.use-case';
import { CreateProductUseCase } from './applications/use-cases/create-product.use-case';
import { FindProductsUseCase } from './applications/use-cases/find-products.use-case';
import { FindProductBySlugUseCase } from './applications/use-cases/find-product-by-slug.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CategoryEntity,
      BrandEntity,
      ProductEntity,
      ProductVariantEntity,
    ]),
  ],
  controllers: [CatalogController],
  providers: [
    CreateCategoryUseCase,
    FindCategoriesUseCase,
    CreateBrandUseCase,
    FindBrandsUseCase,
    CreateProductUseCase,
    FindProductsUseCase,
    FindProductBySlugUseCase,
    CatalogOrchestrator,
    {
      provide: CATALOG_REPOSITORY_TOKEN,
      useClass: CatalogRepository,
    },
  ],
  exports: [CATALOG_REPOSITORY_TOKEN],
})
export class CatalogModule {}
`;

fs.writeFileSync(path.join(modDir, 'catalog.module.ts'), moduleFile);

console.log('Catalog completely generated.');
