const sequelize = require('./sequelize');
const InventoryStock = require('../models/inventoryStock.model');

const initialStock = [
  {
    sku: 'SKU123ABC',
    productName: 'Aceite premium CARLEY 1L',
    warehouseSite: 'Santa Clara',
    physicalStock: 120,
    reservedStock: 18,
    availableStock: 102,
    unit: 'UND',
    lastUpdatedAt: new Date('2026-06-09T00:00:00.000Z')
  },
  {
    sku: 'REPUESTO778',
    productName: 'Filtro industrial CARLEY',
    warehouseSite: 'Santa Clara',
    physicalStock: 64,
    reservedStock: 7,
    availableStock: 57,
    unit: 'UND',
    lastUpdatedAt: new Date('2026-06-09T00:00:00.000Z')
  }
];

async function initializeDatabase() {
  await sequelize.authenticate();
  await sequelize.sync();

  const count = await InventoryStock.count();
  if (count === 0) {
    await InventoryStock.bulkCreate(initialStock);
  }
}

module.exports = initializeDatabase;
