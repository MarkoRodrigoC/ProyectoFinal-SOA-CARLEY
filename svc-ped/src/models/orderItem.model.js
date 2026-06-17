const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  sku: {
    type: DataTypes.STRING(32),
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'order_items'
});

module.exports = OrderItem;
