const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');

const ProcessedInventoryEvent = sequelize.define('ProcessedInventoryEvent', {
  eventId: {
    type: DataTypes.UUID,
    primaryKey: true
  },
  eventType: {
    type: DataTypes.STRING(80),
    allowNull: false
  },
  sourceService: {
    type: DataTypes.STRING(80),
    allowNull: false
  },
  processedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'processed_inventory_events',
  updatedAt: false
});

module.exports = ProcessedInventoryEvent;
