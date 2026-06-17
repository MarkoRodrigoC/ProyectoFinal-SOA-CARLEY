const InventoryStock = require('../models/inventoryStock.model');

class InventoryRepository {
  async findSantaClaraStockBySku(sku) {
    const stock = await InventoryStock.findOne({
      where: {
        sku: sku.toUpperCase(),
        warehouseSite: 'Santa Clara'
      }
    });

    return stock ? stock.get({ plain: true }) : null;
  }
}

module.exports = InventoryRepository;
