import { Inject, Injectable } from '@nestjs/common';
import {
  CATALOG_REPOSITORY_TOKEN,
  type ICatalogRepository,
} from '../../infrastructures/repositories/catalog.repository.interface';
import { CreateBrandDto } from '../dto/create-brand.dto';

@Injectable()
export class CreateBrandUseCase {
  constructor(
    @Inject(CATALOG_REPOSITORY_TOKEN)
    private readonly catalogRepo: ICatalogRepository,
  ) {}
  async execute(dto: CreateBrandDto) {
    const slug = dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return this.catalogRepo.createBrand({ ...dto, slug });
  }
}
