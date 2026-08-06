import { Injectable } from '@nestjs/common';
import { ICatalogRepository } from './catalog.repository.interface';

@Injectable()
export class CatalogRepository implements ICatalogRepository {
  constructor() {}
}
