const crypto = require('crypto');
const HttpError = require('../utils/httpError');

class DeliveryService {
  constructor({ rabbitMqPublisher }) {
    this.rabbitMqPublisher = rabbitMqPublisher;
  }

  async confirmDelivery(payload, identityHeaders) {
    this.validatePayload(payload);

    const event = {
      eventId: crypto.randomUUID(),
      eventType: 'PedidoEntregado',
      sourceService: 'SVC-TRA',
      orderId: payload.orderId,
      deliveredAt: payload.deliveredAt || new Date().toISOString(),
      deliveredBy: {
        userId: identityHeaders.userId || null,
        role: identityHeaders.role || null
      },
      items: payload.items.map((item) => ({
        sku: item.sku.toUpperCase(),
        quantity: item.quantity
      }))
    };

    const published = await this.rabbitMqPublisher.publishOrderDelivered(event);

    if (!published) {
      throw new HttpError(503, 'Service Unavailable', 'RabbitMQ did not accept the delivery event');
    }

    return event;
  }

  validatePayload(payload) {
    if (!payload || typeof payload !== 'object') {
      throw new HttpError(400, 'Bad Request', 'Request payload is required');
    }

    if (!payload.orderId || !Array.isArray(payload.items) || payload.items.length === 0) {
      throw new HttpError(400, 'Bad Request', 'Payload must include orderId and items');
    }

    const invalidItem = payload.items.find((item) => !item.sku || !Number.isInteger(item.quantity) || item.quantity <= 0);
    if (invalidItem) {
      throw new HttpError(400, 'Bad Request', 'Each item must include sku and a positive integer quantity');
    }
  }
}

module.exports = DeliveryService;
