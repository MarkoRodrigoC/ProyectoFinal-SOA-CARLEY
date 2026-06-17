const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');

const InventoryStock = sequelize.define('InventoryStock', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  sku: {
    type: DataTypes.STRING(32),
    allowNull: false,
    unique: true
  },
  productName: {
    type: DataTypes.STRING(160),
    allowNull: false
  },
  warehouseSite: {
    type: DataTypes.STRING(80),
    allowNull: false,
    defaultValue: 'Santa Clara'
  },
  physicalStock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  reservedStock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  availableStock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  unit: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: 'UND'
  },
  lastUpdatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'inventory_stocks'
});

module.exports = InventoryStock;
