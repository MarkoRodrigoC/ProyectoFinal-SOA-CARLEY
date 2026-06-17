const crypto = require('crypto');
const HttpError = require('../utils/httpError');

class OrdersService {
  constructor({ ordersRepository, inventoryClient }) {
    this.ordersRepository = ordersRepository;
    this.inventoryClient = inventoryClient;
  }

  async registerOrder(payload, identityHeaders) {
    this.validatePayload(payload);
    await this.reserveInventoryStock(payload.items);

    const order = {
      orderId: crypto.randomUUID(),
      status: 'REGISTRADO',
      customer: payload.customer,
      order: payload.order,
      items: payload.items,
      registeredBy: {
        userId: identityHeaders.userId || null,
        role: identityHeaders.role || null
      },
      createdAt: new Date().toISOString()
    };

    return this.ordersRepository.save(order);
  }

  async listOrders() {
    return this.ordersRepository.findAll();
  }

  validatePayload(payload) {
    if (!payload || typeof payload !== 'object') {
      throw new HttpError(400, 'Bad Request', 'Request payload is required');
    }

    if (!payload.customer || !payload.order || !Array.isArray(payload.items)) {
      throw new HttpError(400, 'Bad Request', 'Payload must include customer, order and items');
    }

    if (payload.items.length === 0) {
      throw new HttpError(400, 'Bad Request', 'Order must contain at least one item');
    }

    const invalidItem = payload.items.find((item) => !item.sku || !Number.isInteger(item.quantity) || item.quantity <= 0);
    if (invalidItem) {
      throw new HttpError(400, 'Bad Request', 'Each item must include sku and a positive integer quantity');
    }
  }

  async validateInventoryAvailability(items) {
    const requiredBySku = items.reduce((accumulator, item) => {
      const sku = item.sku.toUpperCase();
      accumulator.set(sku, (accumulator.get(sku) || 0) + item.quantity);
      return accumulator;
    }, new Map());

    const validations = Array.from(requiredBySku.entries()).map(async ([sku, requiredQuantity]) => {
      const stockDto = await this.inventoryClient.findStockBySku(sku);
      const availableStock = stockDto?.stock?.available;

      if (!Number.isInteger(availableStock)) {
        throw new HttpError(502, 'Bad Gateway', `Inventory service returned invalid stock for SKU ${sku}`);
      }

      if (availableStock < requiredQuantity) {
        throw new HttpError(
          409,
          'Conflict',
          `Insufficient stock for SKU ${sku}`,
          {
            sku,
            requestedQuantity: requiredQuantity,
            availableStock
          }
        );
      }
    });

    await Promise.all(validations);
  }

  async reserveInventoryStock(items) {
    const requiredBySku = items.reduce((accumulator, item) => {
      const sku = item.sku.toUpperCase();
      accumulator.set(sku, (accumulator.get(sku) || 0) + item.quantity);
      return accumulator;
    }, new Map());

    const normalizedItems = Array.from(requiredBySku.entries()).map(([sku, quantity]) => ({ sku, quantity }));
    await this.inventoryClient.reserveStock(normalizedItems);
  }
}

module.exports = OrdersService;
