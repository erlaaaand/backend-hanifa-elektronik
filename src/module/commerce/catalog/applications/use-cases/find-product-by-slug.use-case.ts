import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  CATALOG_REPOSITORY_TOKEN,
  type ICatalogRepository,
} from '../../infrastructures/repositories/catalog.repository.interface';

@Injectable()
export class FindProductBySlugUseCase {
  constructor(
    @Inject(CATALOG_REPOSITORY_TOKEN)
    private readonly catalogRepo: ICatalogRepository,
  ) {}
  async execute(slug: string) {
    const product = await this.catalogRepo.findProductBySlug(slug);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }
}
