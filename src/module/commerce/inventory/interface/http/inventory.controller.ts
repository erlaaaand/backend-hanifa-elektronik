import { Controller } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { InventoryOrchestrator } from '../../applications/orchestrator/inventory.orchestrator';

@ApiTags('Commerce - Inventory')
@ApiBearerAuth('JWT')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly orchestrator: InventoryOrchestrator) {}
}
