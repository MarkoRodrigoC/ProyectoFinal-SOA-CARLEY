require('dotenv').config();

module.exports = {
  port: Number(process.env.PORT || 3003),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:8000',
  rabbitmqUrl: process.env.RABBITMQ_URL || 'amqp://carley_admin:CarleyRabbit2026@localhost:5672',
  queues: {
    orderDelivered: process.env.ORDER_DELIVERED_QUEUE || 'carley.pedidos.entregados'
  }
};
