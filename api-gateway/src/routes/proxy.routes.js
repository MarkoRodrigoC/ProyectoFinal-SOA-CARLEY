const { Router } = require('express');
const env = require('../config/env');
const reverseProxy = require('../utils/reverseProxy');

const router = Router();

router.use('/api/auth', reverseProxy(env.downstream.security));
router.use('/api/inventario', reverseProxy(env.downstream.inventory));
router.use('/api/pedidos', reverseProxy(env.downstream.orders));
router.use('/api/transporte', reverseProxy(env.downstream.transport));
router.use('/api/facturacion', reverseProxy(env.downstream.billing));

module.exports = router;
