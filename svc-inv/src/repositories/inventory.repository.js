const InventoryStock = require('../models/inventoryStock.model');
const ProcessedInventoryEvent = require('../models/processedInventoryEvent.model');
const sequelize = require('../database/sequelize');
const HttpError = require('../utils/httpError');

class InventoryRepository {
  async listSantaClaraStocks() {
    const stocks = await InventoryStock.findAll({
      where: {
        warehouseSite: 'Santa Clara'
      },
      order: [['sku', 'ASC']]
    });

    return stocks.map((stock) => stock.get({ plain: true }));
  }

  async findSantaClaraStockBySku(sku) {
    const stock = await InventoryStock.findOne({
      where: {
        sku: sku.toUpperCase(),
        warehouseSite: 'Santa Clara'
      }
    });

    return stock ? stock.get({ plain: true }) : null;
  }

  async applyDeliveredOrderEvent(event) {
    return sequelize.transaction(async (transaction) => {
      const alreadyProcessed = await ProcessedInventoryEvent.findByPk(event.eventId, { transaction });

      if (alreadyProcessed) {
        return { processed: false, reason: 'DUPLICATED_EVENT' };
      }

      for (const item of event.items) {
        const sku = item.sku.toUpperCase();
        const stock = await InventoryStock.findOne({
          where: {
            sku,
            warehouseSite: 'Santa Clara'
          },
          transaction,
          lock: transaction.LOCK.UPDATE
        });

        if (!stock) {
          throw new HttpError(409, 'Conflict', `SKU ${sku} does not exist in inventory`);
        }

        if (stock.availableStock < item.quantity || stock.physicalStock < item.quantity) {
          throw new HttpError(409, 'Conflict', `Insufficient stock to deliver SKU ${sku}`);
        }

        stock.physicalStock -= item.quantity;
        stock.availableStock -= item.quantity;
        stock.lastUpdatedAt = new Date();
        await stock.save({ transaction });
      }

      await ProcessedInventoryEvent.create({
        eventId: event.eventId,
        eventType: event.eventType,
        sourceService: event.sourceService,
        processedAt: new Date()
      }, { transaction });

      return { processed: true };
    });
  }
}

module.exports = InventoryRepository;
