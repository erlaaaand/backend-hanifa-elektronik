import { Module } from '@nestjs/common';
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

// Events & Listeners
import { CatalogListener } from './applications/listeners/catalog.listener';

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
    CatalogListener,
    {
      provide: CATALOG_REPOSITORY_TOKEN,
      useClass: CatalogRepository,
    },
  ],
  exports: [CATALOG_REPOSITORY_TOKEN],
})
export class CatalogModule {}
