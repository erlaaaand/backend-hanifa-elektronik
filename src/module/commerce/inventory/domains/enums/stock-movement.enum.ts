export enum StockMovementType {
  IN = 'IN', // Barang masuk dari Supplier
  OUT = 'OUT', // Barang keluar (Penjualan)
  TRANSFER_OUT = 'TRANSFER_OUT', // Pindah ke gudang lain
  TRANSFER_IN = 'TRANSFER_IN', // Terima dari gudang lain
  ADJUSTMENT = 'ADJUSTMENT', // Stock opname / koreksi
  RETURN = 'RETURN', // Retur dari pembeli
}

export enum StockMovementStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}
