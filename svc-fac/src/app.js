const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const billingRoutes = require('./routes/billing.routes');
const errorHandler = require('./middlewares/errorHandler');
const HttpError = require('./utils/httpError');

const app = express();

app.use(cors({
  origin: env.corsOrigin,
  methods: ['POST'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CARLEY-USER-ID', 'X-CARLEY-ROLE']
}));
app.use(express.json({ limit: '1mb' }));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'SVC-FAC' });
});

app.use('/api/facturacion', billingRoutes);

app.use((req, res, next) => {
  next(new HttpError(404, 'Not Found', 'Resource not found'));
});

app.use(errorHandler);

module.exports = app;
