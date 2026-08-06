import { Inject, Injectable } from '@nestjs/common';
import {
  CATALOG_REPOSITORY_TOKEN,
  type ICatalogRepository,
} from '../../infrastructures/repositories/catalog.repository.interface';
import { QueryCatalogDto } from '../dto/query-catalog.dto';

@Injectable()
export class FindProductsUseCase {
  constructor(
    @Inject(CATALOG_REPOSITORY_TOKEN)
    private readonly catalogRepo: ICatalogRepository,
  ) {}
  async execute(query: QueryCatalogDto) {
    return this.catalogRepo.findProducts(query.search, query.page, query.limit);
  }
}
