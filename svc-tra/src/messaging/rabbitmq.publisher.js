const amqp = require('amqplib');
const env = require('../config/env');

class RabbitMqPublisher {
  constructor() {
    this.connection = null;
    this.channel = null;
  }

  async getChannel() {
    if (this.channel) {
      return this.channel;
    }

    this.connection = await amqp.connect(env.rabbitmqUrl);
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(env.queues.orderDelivered, { durable: true });
    return this.channel;
  }

  async publishOrderDelivered(event) {
    const channel = await this.getChannel();
    const payload = Buffer.from(JSON.stringify(event));

    return channel.sendToQueue(env.queues.orderDelivered, payload, {
      persistent: true,
      contentType: 'application/json',
      type: event.eventType,
      messageId: event.eventId,
      timestamp: Date.now()
    });
  }
}

module.exports = RabbitMqPublisher;
