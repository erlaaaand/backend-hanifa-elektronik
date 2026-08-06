import { Inject, Injectable } from '@nestjs/common';
import {
  CATALOG_REPOSITORY_TOKEN,
  ICatalogRepository,
} from '../../infrastructures/repositories/catalog.repository.interface';

@Injectable()
export class FindCategoriesUseCase {
  constructor(
    @Inject(CATALOG_REPOSITORY_TOKEN)
    private readonly catalogRepo: ICatalogRepository,
  ) {}
  async execute() {
    return this.catalogRepo.findCategories();
  }
}
