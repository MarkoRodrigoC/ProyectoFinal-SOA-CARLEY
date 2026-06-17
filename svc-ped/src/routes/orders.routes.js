const { Router } = require('express');
const asyncHandler = require('../utils/asyncHandler');
const OrdersRepository = require('../repositories/orders.repository');
const OrdersService = require('../services/orders.service');
const OrdersController = require('../controllers/orders.controller');
const InventoryClient = require('../clients/inventory.client');

const router = Router();
const ordersRepository = new OrdersRepository();
const inventoryClient = new InventoryClient();
const ordersService = new OrdersService({ ordersRepository, inventoryClient });
const ordersController = new OrdersController({ ordersService });

router.post('/registrar', asyncHandler(ordersController.register));
router.get('/', asyncHandler(ordersController.list));

module.exports = router;
