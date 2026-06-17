require('dotenv').config();

module.exports = {
  port: Number(process.env.PORT || 3001),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:8000',
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    name: process.env.DB_NAME || 'carley_inventario',
    user: process.env.DB_USER || 'carley_user',
    password: process.env.DB_PASSWORD || 'CarleyPassword123!'
  }
};
