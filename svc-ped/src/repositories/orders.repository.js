const sequelize = require('../database/sequelize');
const { Order, OrderItem } = require('../models');

class OrdersRepository {
  async save(order) {
    return sequelize.transaction(async (transaction) => {
      const createdOrder = await Order.create({
        orderId: order.orderId,
        status: order.status,
        customer: order.customer,
        orderData: order.order,
        registeredByUserId: order.registeredBy.userId,
        registeredByRole: order.registeredBy.role,
        createdAt: order.createdAt,
        updatedAt: order.createdAt
      }, { transaction });

      await OrderItem.bulkCreate(
        order.items.map((item) => ({
          orderId: createdOrder.orderId,
          sku: item.sku,
          quantity: item.quantity
        })),
        { transaction }
      );

      return this.mapOrder(createdOrder, order.items);
    });
  }

  async findAll() {
    const orders = await Order.findAll({
      include: [{ model: OrderItem, as: 'items' }],
      order: [['createdAt', 'DESC']]
    });

    return orders.map((order) => this.mapOrder(order, order.items));
  }

  mapOrder(orderRecord, items) {
    const order = orderRecord.get ? orderRecord.get({ plain: true }) : orderRecord;

    return {
      orderId: order.orderId,
      status: order.status,
      customer: order.customer,
      order: order.orderData,
      items: items.map((item) => ({
        sku: item.sku,
        quantity: item.quantity
      })),
      registeredBy: {
        userId: order.registeredByUserId,
        role: order.registeredByRole
      },
      createdAt: order.createdAt instanceof Date ? order.createdAt.toISOString() : order.createdAt
    };
  }
}

module.exports = OrdersRepository;
