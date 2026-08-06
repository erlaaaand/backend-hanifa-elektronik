import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ProductCreatedEvent } from '../events/catalog.events';

@Injectable()
export class CatalogListener {
  private readonly logger = new Logger(CatalogListener.name);

  @OnEvent('catalog.product.created', { async: true })
  handleProductCreatedEvent(event: ProductCreatedEvent) {
    this.logger.log(
      `[Event Listener] Produk master baru didaftarkan: ${event.productName} (ID: ${event.productId})`,
    );
    this.logger.log(
      `[Event Listener] Variasi SKU terdaftar: ${event.skuList.join(', ')}`,
    );

    // Future Note: Event ini dapat di-listen oleh InventoryModule untuk mempersiapkan
    // slot gudang (bin/rack) atau mengaktifkan status "Available for Stock In".
  }
}
