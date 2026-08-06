import { Inject, Injectable } from '@nestjs/common';
import {
  CATALOG_REPOSITORY_TOKEN,
  type ICatalogRepository,
} from '../../infrastructures/repositories/catalog.repository.interface';
import { CreateCategoryDto } from '../dto/create-category.dto';

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    @Inject(CATALOG_REPOSITORY_TOKEN)
    private readonly catalogRepo: ICatalogRepository,
  ) {}
  async execute(dto: CreateCategoryDto) {
    const slug = dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return this.catalogRepo.createCategory({ ...dto, slug });
  }
}
