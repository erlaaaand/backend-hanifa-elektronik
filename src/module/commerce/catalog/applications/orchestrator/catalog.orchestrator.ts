import { Injectable } from '@nestjs/common';
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

  createCategory(dto: CreateCategoryDto) {
    return this.createCategoryUc.execute(dto);
  }
  findCategories() {
    return this.findCategoriesUc.execute();
  }
  createBrand(dto: CreateBrandDto) {
    return this.createBrandUc.execute(dto);
  }
  findBrands() {
    return this.findBrandsUc.execute();
  }
  createProduct(dto: CreateProductDto) {
    return this.createProductUc.execute(dto);
  }
  findProducts(query: QueryCatalogDto) {
    return this.findProductsUc.execute(query);
  }
  findProductBySlug(slug: string) {
    return this.findProductBySlugUc.execute(slug);
  }
}
