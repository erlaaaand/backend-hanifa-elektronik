import { Controller } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CatalogOrchestrator } from '../../applications/orchestrator/catalog.orchestrator';

@ApiTags('Commerce - Catalog')
@ApiBearerAuth('JWT')
@Controller('catalog')
export class CatalogController {
  constructor(private readonly orchestrator: CatalogOrchestrator) {}
}
