require('dotenv').config();

module.exports = {
  port: Number(process.env.PORT || 3004),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173'
};
