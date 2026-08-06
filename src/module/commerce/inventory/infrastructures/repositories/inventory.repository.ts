import { Injectable } from '@nestjs/common';
import { IInventoryRepository } from './inventory.repository.interface';

@Injectable()
export class InventoryRepository implements IInventoryRepository {
  constructor() {}
}
