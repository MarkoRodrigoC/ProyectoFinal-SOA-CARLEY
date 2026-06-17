const Order = require('./order.model');
const OrderItem = require('./orderItem.model');

Order.hasMany(OrderItem, {
  as: 'items',
  foreignKey: {
    name: 'orderId',
    allowNull: false
  },
  onDelete: 'CASCADE'
});

OrderItem.belongsTo(Order, {
  as: 'order',
  foreignKey: {
    name: 'orderId',
    allowNull: false
  }
});

module.exports = {
  Order,
  OrderItem
};
