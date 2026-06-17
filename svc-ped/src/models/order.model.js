const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');

const Order = sequelize.define('Order', {
  orderId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  status: {
    type: DataTypes.STRING(30),
    allowNull: false,
    defaultValue: 'REGISTRADO'
  },
  customer: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  orderData: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  registeredByUserId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  registeredByRole: {
    type: DataTypes.STRING(40),
    allowNull: true
  }
}, {
  tableName: 'orders'
});

module.exports = Order;
