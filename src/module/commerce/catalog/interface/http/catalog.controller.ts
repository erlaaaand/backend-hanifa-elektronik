import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

import { CatalogOrchestrator } from '../../applications/orchestrator/catalog.orchestrator';
import { CreateCategoryDto } from '../../applications/dto/create-category.dto';
import { CreateBrandDto } from '../../applications/dto/create-brand.dto';
import { CreateProductDto } from '../../applications/dto/create-product.dto';
import { QueryCatalogDto } from '../../applications/dto/query-catalog.dto';

// Auth & Roles
import { JwtAuthGuard } from '../../../../identity/auth/interface/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../identity/auth/interface/guards/roles.guard';
import { Roles } from '../../../../identity/auth/interface/decorators/roles.decorator';
import { UserRole } from '../../../../identity/users/applications/dto/admin-create-user.dto';

// Audit
import { Audit } from '../../../../shared/audit/decorators/audit.decorator';
import {
  AuditAction,
  AuditCategory,
  AuditSeverity,
} from '../../../../shared/audit/domains/enums/audit.enum';

// Exception Filter
import { UseFilters } from '@nestjs/common';
import { CatalogExceptionFilter } from '../filters/catalog-exception.filter';

@ApiTags('Commerce - Catalog')
@UseFilters(CatalogExceptionFilter)
@Controller('catalog')
export class CatalogController {
  constructor(private readonly orchestrator: CatalogOrchestrator) {}

  // ── CATEGORY ───────────────────────────────────────────────────────────────
  @Throttle({ dashboard: {} })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Audit({
    action: AuditAction.CATEGORY_CREATE,
    category: AuditCategory.PRODUCT,
    resource: 'Category',
    severity: AuditSeverity.INFO,
    description: 'Admin menambahkan kategori produk baru',
  })
  @Post('categories')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '(ADMIN) Buat Kategori Baru' })
  @ApiCreatedResponse({ description: 'Kategori berhasil dibuat.' })
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.orchestrator.createCategory(dto);
  }

  @SkipThrottle()
  @Get('categories')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Daftar Kategori Publik' })
  @ApiOkResponse({ description: 'Berhasil mendapatkan daftar kategori.' })
  findCategories() {
    return this.orchestrator.findCategories();
  }

  // ── BRAND ──────────────────────────────────────────────────────────────────
  @Throttle({ dashboard: {} })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Audit({
    action: AuditAction.BRAND_CREATE,
    category: AuditCategory.PRODUCT,
    resource: 'Brand',
    severity: AuditSeverity.INFO,
    description: 'Admin menambahkan brand baru',
  })
  @Post('brands')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '(ADMIN) Buat Brand Baru' })
  @ApiCreatedResponse({ description: 'Brand berhasil dibuat.' })
  createBrand(@Body() dto: CreateBrandDto) {
    return this.orchestrator.createBrand(dto);
  }

  @SkipThrottle()
  @Get('brands')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Daftar Brand Publik' })
  @ApiOkResponse({ description: 'Berhasil mendapatkan daftar brand.' })
  findBrands() {
    return this.orchestrator.findBrands();
  }

  // ── PRODUCT ────────────────────────────────────────────────────────────────
  @Throttle({ dashboard: {} })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Audit({
    action: AuditAction.PRODUCT_CREATE,
    category: AuditCategory.PRODUCT,
    resource: 'Product',
    severity: AuditSeverity.INFO,
    description: 'Admin menambahkan master produk baru beserta variannya',
  })
  @Post('products')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '(ADMIN) Buat Produk Baru beserta variannya' })
  @ApiCreatedResponse({ description: 'Produk berhasil dibuat.' })
  createProduct(@Body() dto: CreateProductDto) {
    return this.orchestrator.createProduct(dto);
  }

  @SkipThrottle()
  @Get('products')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Daftar Produk Publik Terpaging' })
  @ApiOkResponse({
    description: 'Berhasil mendapatkan daftar produk terpaging.',
  })
  findProducts(@Query() query: QueryCatalogDto) {
    return this.orchestrator.findProducts(query);
  }

  @SkipThrottle()
  @Get('products/:slug')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Detail Produk Publik berdasarkan Slug' })
  @ApiOkResponse({ description: 'Berhasil mendapatkan detail produk.' })
  findProductBySlug(@Param('slug') slug: string) {
    return this.orchestrator.findProductBySlug(slug);
  }
}
