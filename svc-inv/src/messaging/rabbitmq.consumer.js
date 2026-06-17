const amqp = require('amqplib');
const env = require('../config/env');
const InventoryRepository = require('../repositories/inventory.repository');
const DeliveryEventService = require('../services/deliveryEvent.service');

class RabbitMqConsumer {
  constructor({ deliveryEventService }) {
    this.deliveryEventService = deliveryEventService;
    this.connection = null;
    this.channel = null;
  }

  async start() {
    this.connection = await amqp.connect(env.rabbitmqUrl);
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(env.queues.orderDelivered, { durable: true });
    await this.channel.prefetch(1);

    await this.channel.consume(env.queues.orderDelivered, async (message) => {
      if (!message) {
        return;
      }

      try {
        const event = JSON.parse(message.content.toString('utf8'));
        const result = await this.deliveryEventService.handlePedidoEntregado(event);
        this.channel.ack(message);
        console.log(`SVC-INV processed PedidoEntregado ${event.eventId}: ${result.reason || 'OK'}`);
      } catch (error) {
        console.error('SVC-INV failed to process PedidoEntregado:', error.message);
        this.channel.nack(message, false, false);
      }
    });

    console.log(`SVC-INV listening RabbitMQ queue ${env.queues.orderDelivered}`);
  }
}

const inventoryRepository = new InventoryRepository();
const deliveryEventService = new DeliveryEventService({ inventoryRepository });

module.exports = new RabbitMqConsumer({ deliveryEventService });
