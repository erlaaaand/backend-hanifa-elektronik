import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  CATALOG_REPOSITORY_TOKEN,
  type ICatalogRepository,
} from '../../infrastructures/repositories/catalog.repository.interface';
import { CreateProductDto } from '../dto/create-product.dto';
import { ProductCreatedEvent } from '../events/catalog.events';

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(CATALOG_REPOSITORY_TOKEN)
    private readonly catalogRepo: ICatalogRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  async execute(dto: CreateProductDto) {
    const category = await this.catalogRepo.findCategoryById(dto.categoryId);
    if (!category) throw new NotFoundException('Category not found');

    const slug =
      dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();

    const savedProduct = await this.catalogRepo.createProduct({
      name: dto.name,
      description: dto.description,
      slug,
      categoryId: dto.categoryId,
      brandId: dto.brandId,
      specifications: dto.specifications,
      isActive: dto.isActive,
      variants: dto.variants,
    });

    const skus = dto.variants.map((v) => v.sku);
    this.eventEmitter.emit(
      'catalog.product.created',
      new ProductCreatedEvent(savedProduct.id, savedProduct.name, skus),
    );

    return savedProduct;
  }
}
