import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  CATALOG_REPOSITORY_TOKEN,
  ICatalogRepository,
} from '../../infrastructures/repositories/catalog.repository.interface';
import { CreateProductDto } from '../dto/create-product.dto';

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(CATALOG_REPOSITORY_TOKEN)
    private readonly catalogRepo: ICatalogRepository,
  ) {}
  async execute(dto: CreateProductDto) {
    const category = await this.catalogRepo.findCategoryById(dto.categoryId);
    if (!category) throw new NotFoundException('Category not found');

    const slug =
      dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();

    return this.catalogRepo.createProduct({
      name: dto.name,
      description: dto.description,
      slug,
      categoryId: dto.categoryId,
      brandId: dto.brandId,
      specifications: dto.specifications,
      isActive: dto.isActive,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      variants: dto.variants as any,
    });
  }
}
