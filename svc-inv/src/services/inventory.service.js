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
