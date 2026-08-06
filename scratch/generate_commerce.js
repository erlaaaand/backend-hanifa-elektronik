const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src', 'module', 'commerce');

const modules = ['catalog', 'inventory'];

for (const mod of modules) {
  const modDir = path.join(srcDir, mod);
  
  // Create directories
  const dirs = [
    'applications/dto',
    'applications/use-cases',
    'applications/orchestrator',
    'infrastructures/repositories',
    'interface/http'
  ];
  
  for (const dir of dirs) {
    fs.mkdirSync(path.join(modDir, dir), { recursive: true });
  }
  
  // Capitalize name
  const Name = mod.charAt(0).toUpperCase() + mod.slice(1);
  
  // Module file
  fs.writeFileSync(path.join(modDir, `${mod}.module.ts`), `
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ${Name}Controller } from './interface/http/${mod}.controller';
import { ${Name}Orchestrator } from './applications/orchestrator/${mod}.orchestrator';
import { ${Name}Repository } from './infrastructures/repositories/${mod}.repository';
import { ${Name.toUpperCase()}_REPOSITORY_TOKEN } from './infrastructures/repositories/${mod}.repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [${Name}Controller],
  providers: [
    ${Name}Orchestrator,
    {
      provide: ${Name.toUpperCase()}_REPOSITORY_TOKEN,
      useClass: ${Name}Repository,
    },
  ],
  exports: [${Name.toUpperCase()}_REPOSITORY_TOKEN],
})
export class ${Name}Module {}
`.trim() + '\n');

  // Controller
  fs.writeFileSync(path.join(modDir, 'interface', 'http', `${mod}.controller.ts`), `
import { Controller } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ${Name}Orchestrator } from '../../applications/orchestrator/${mod}.orchestrator';

@ApiTags('Commerce - ${Name}')
@ApiBearerAuth('JWT')
@Controller('${mod}')
export class ${Name}Controller {
  constructor(private readonly orchestrator: ${Name}Orchestrator) {}
}
`.trim() + '\n');

  // Orchestrator
  fs.writeFileSync(path.join(modDir, 'applications', 'orchestrator', `${mod}.orchestrator.ts`), `
import { Injectable } from '@nestjs/common';

@Injectable()
export class ${Name}Orchestrator {
  constructor() {}
}
`.trim() + '\n');

  // Repository Interface
  fs.writeFileSync(path.join(modDir, 'infrastructures', 'repositories', `${mod}.repository.interface.ts`), `
export const ${Name.toUpperCase()}_REPOSITORY_TOKEN = Symbol('${Name.toUpperCase()}_REPOSITORY_TOKEN');

export interface I${Name}Repository {
  // Define methods here
}
`.trim() + '\n');

  // Repository Impl
  fs.writeFileSync(path.join(modDir, 'infrastructures', 'repositories', `${mod}.repository.ts`), `
import { Injectable } from '@nestjs/common';
import { I${Name}Repository } from './${mod}.repository.interface';

@Injectable()
export class ${Name}Repository implements I${Name}Repository {
  constructor() {}
}
`.trim() + '\n');
}

console.log('Boilerplate generated successfully.');
