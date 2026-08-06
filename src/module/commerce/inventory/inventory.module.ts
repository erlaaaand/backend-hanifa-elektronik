import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryController } from './interface/http/inventory.controller';
import { InventoryOrchestrator } from './applications/orchestrator/inventory.orchestrator';
import { InventoryRepository } from './infrastructures/repositories/inventory.repository';
import { INVENTORY_REPOSITORY_TOKEN } from './infrastructures/repositories/inventory.repository.interface';
import { WarehouseEntity } from './domains/entities/warehouse.entity';
import { StockItemEntity } from './domains/entities/stock-item.entity';
import { StockMovementEntity } from './domains/entities/stock-movement.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WarehouseEntity,
      StockItemEntity,
      StockMovementEntity,
    ]),
  ],
  controllers: [InventoryController],
  providers: [
    InventoryOrchestrator,
    {
      provide: INVENTORY_REPOSITORY_TOKEN,
      useClass: InventoryRepository,
    },
  ],
  exports: [INVENTORY_REPOSITORY_TOKEN],
})
export class InventoryModule {}
