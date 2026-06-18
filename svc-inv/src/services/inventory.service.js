const HttpError = require('../utils/httpError');

const SKU_PATTERN = /^[A-Za-z0-9-]{3,32}$/;

class InventoryService {
  constructor({ inventoryRepository }) {
    this.inventoryRepository = inventoryRepository;
  }

  toDto(stock) {
    return {
      sku: stock.sku,
      productName: stock.productName,
      site: stock.warehouseSite,
      stock: {
        physical: stock.physicalStock,
        reserved: stock.reservedStock,
        available: stock.availableStock,
        unit: stock.unit
      },
      lastUpdatedAt: stock.lastUpdatedAt instanceof Date ? stock.lastUpdatedAt.toISOString() : stock.lastUpdatedAt
    };
  }

  async listStocks() {
    const stocks = await this.inventoryRepository.listSantaClaraStocks();
    return {
      total: stocks.length,
      products: stocks.map((stock) => this.toDto(stock))
    };
  }

  async reserveStock(items) {
    if (!Array.isArray(items) || items.length === 0) {
      throw new HttpError(400, 'Bad Request', 'Items are required to reserve stock');
    }

    const invalidItem = items.find((item) => !item.sku || !SKU_PATTERN.test(item.sku) || !Number.isInteger(item.quantity) || item.quantity <= 0);
    if (invalidItem) {
      throw new HttpError(400, 'Bad Request', 'Each item must include a valid sku and positive integer quantity');
    }

    const requiredBySku = items.reduce((accumulator, item) => {
      const sku = item.sku.toUpperCase();
      accumulator.set(sku, (accumulator.get(sku) || 0) + item.quantity);
      return accumulator;
    }, new Map());

    const normalizedItems = Array.from(requiredBySku.entries()).map(([sku, quantity]) => ({ sku, quantity }));
    const stocks = await this.inventoryRepository.reserveStockForOrder(normalizedItems);

    return {
      reserved: true,
      products: stocks.map((stock) => this.toDto(stock))
    };
  }

  async updateStockQuantity(sku, physicalStock) {
    if (!sku || !SKU_PATTERN.test(sku)) {
      throw new HttpError(400, 'Bad Request', 'SKU must be alphanumeric and between 3 and 32 characters');
    }

    if (!Number.isInteger(physicalStock) || physicalStock < 0) {
      throw new HttpError(400, 'Bad Request', 'Physical stock must be a positive integer or zero');
    }

    const stock = await this.inventoryRepository.updateSantaClaraPhysicalStock(sku, physicalStock);
    return this.toDto(stock);
  }

  async findStockBySku(sku) {
    if (!SKU_PATTERN.test(sku)) {
      throw new HttpError(400, 'Bad Request', 'SKU must be alphanumeric and between 3 and 32 characters');
    }

    const stock = await this.inventoryRepository.findSantaClaraStockBySku(sku);
    if (!stock) {
      throw new HttpError(404, 'Not Found', 'Inventory stock not found for requested SKU');
    }

    return this.toDto(stock);
  }
}

module.exports = InventoryService;
