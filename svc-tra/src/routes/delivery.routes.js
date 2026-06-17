const { Router } = require('express');
const asyncHandler = require('../utils/asyncHandler');
const RabbitMqPublisher = require('../messaging/rabbitmq.publisher');
const DeliveryService = require('../services/delivery.service');
const DeliveryController = require('../controllers/delivery.controller');

const router = Router();
const rabbitMqPublisher = new RabbitMqPublisher();
const deliveryService = new DeliveryService({ rabbitMqPublisher });
const deliveryController = new DeliveryController({ deliveryService });

router.post('/confirmar-entrega', asyncHandler(deliveryController.confirm));

module.exports = router;
