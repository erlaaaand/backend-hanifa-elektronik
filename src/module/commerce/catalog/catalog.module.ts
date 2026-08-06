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
    CatalogOrchestrator,
    {
      provide: CATALOG_REPOSITORY_TOKEN,
      useClass: CatalogRepository,
    },
  ],
  exports: [CATALOG_REPOSITORY_TOKEN],
})
export class CatalogModule {}
