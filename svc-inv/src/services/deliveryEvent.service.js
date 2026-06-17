const HttpError = require('../utils/httpError');

class DeliveryEventService {
  constructor({ inventoryRepository }) {
    this.inventoryRepository = inventoryRepository;
  }

  async handlePedidoEntregado(event) {
    this.validateEvent(event);
    return this.inventoryRepository.applyDeliveredOrderEvent(event);
  }

  validateEvent(event) {
    if (!event || event.eventType !== 'PedidoEntregado') {
      throw new HttpError(400, 'Bad Request', 'Unsupported inventory event');
    }

    if (!event.eventId || !event.orderId || !Array.isArray(event.items) || event.items.length === 0) {
      throw new HttpError(400, 'Bad Request', 'PedidoEntregado event must include eventId, orderId and items');
    }

    const invalidItem = event.items.find((item) => !item.sku || !Number.isInteger(item.quantity) || item.quantity <= 0);
    if (invalidItem) {
      throw new HttpError(400, 'Bad Request', 'PedidoEntregado items must include sku and positive integer quantity');
    }
  }
}

module.exports = DeliveryEventService;
