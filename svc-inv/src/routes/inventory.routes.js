const { Router } = require('express');
const asyncHandler = require('../utils/asyncHandler');
const InventoryRepository = require('../repositories/inventory.repository');
const InventoryService = require('../services/inventory.service');
const InventoryController = require('../controllers/inventory.controller');

const router = Router();
const inventoryRepository = new InventoryRepository();
const inventoryService = new InventoryService({ inventoryRepository });
const inventoryController = new InventoryController({ inventoryService });

router.get('/', asyncHandler(inventoryController.list));
router.post('/reservar', asyncHandler(inventoryController.reserve));
router.post('/actualizar-stock', asyncHandler(inventoryController.updateStock));
router.get('/buscar/:sku', asyncHandler(inventoryController.findBySku));

module.exports = router;
