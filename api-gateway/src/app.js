const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const authMiddleware = require('./middlewares/authMiddleware');
const rbacMiddleware = require('./middlewares/rbacMiddleware');
const proxyRoutes = require('./routes/proxy.routes');
const errorHandler = require('./middlewares/errorHandler');
const HttpError = require('./utils/httpError');
const reverseProxy = require('./utils/reverseProxy');

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || env.corsOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new HttpError(403, 'Forbidden', 'CORS origin denied'));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CARLEY-SIGNATURE'],
  credentials: false
}));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'API-GATEWAY' });
});

app.get('/', (req, res) => {
  res.status(200).json({
    service: 'CARLEY API Gateway',
    status: 'UP',
    publicEndpoints: {
      health: 'GET /health',
      login: 'POST /api/auth/login'
    },
    protectedEndpoints: {
      inventoryList: 'GET /api/inventario',
      inventory: 'GET /api/inventario/buscar/:sku',
      registerOrder: 'POST /api/pedidos/registrar',
      listOrders: 'GET /api/pedidos',
      confirmDelivery: 'POST /api/transporte/confirmar-entrega'
    }
  });
});

app.post('/api/auth/login', reverseProxy(env.downstream.security));
app.use(authMiddleware);
app.use(rbacMiddleware);
app.use(proxyRoutes);

app.use((req, res, next) => {
  next(new HttpError(404, 'Not Found', 'Route not found'));
});

app.use(errorHandler);

module.exports = app;
