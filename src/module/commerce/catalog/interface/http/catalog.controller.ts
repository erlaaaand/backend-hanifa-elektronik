import { Controller, Post, Get, Body, Query, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CatalogOrchestrator } from '../../applications/orchestrator/catalog.orchestrator';
import { CreateCategoryDto } from '../../applications/dto/create-category.dto';
import { CreateBrandDto } from '../../applications/dto/create-brand.dto';
import { CreateProductDto } from '../../applications/dto/create-product.dto';
import { QueryCatalogDto } from '../../applications/dto/query-catalog.dto';

@ApiTags('Commerce - Catalog')
@ApiBearerAuth('JWT')
@Controller('catalog')
export class CatalogController {
  constructor(private readonly orchestrator: CatalogOrchestrator) {}

  @Post('categories')
  @ApiOperation({ summary: 'Buat Kategori Baru' })
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.orchestrator.createCategory(dto);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Daftar Kategori' })
  findCategories() {
    return this.orchestrator.findCategories();
  }

  @Post('brands')
  @ApiOperation({ summary: 'Buat Brand Baru' })
  createBrand(@Body() dto: CreateBrandDto) {
    return this.orchestrator.createBrand(dto);
  }

  @Get('brands')
  @ApiOperation({ summary: 'Daftar Brand' })
  findBrands() {
    return this.orchestrator.findBrands();
  }

  @Post('products')
  @ApiOperation({ summary: 'Buat Produk Baru beserta variannya' })
  createProduct(@Body() dto: CreateProductDto) {
    return this.orchestrator.createProduct(dto);
  }

  @Get('products')
  @ApiOperation({ summary: 'Daftar Produk Terpaging' })
  findProducts(@Query() query: QueryCatalogDto) {
    return this.orchestrator.findProducts(query);
  }

  @Get('products/:slug')
  @ApiOperation({ summary: 'Detail Produk berdasarkan Slug' })
  findProductBySlug(@Param('slug') slug: string) {
    return this.orchestrator.findProductBySlug(slug);
  }
}
