require('dotenv').config();

module.exports = {
  port: Number(process.env.PORT || 8000),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-change-me',
    issuer: process.env.JWT_ISSUER || 'carley-svc-sec',
    audience: process.env.JWT_AUDIENCE || 'carley-digital-ecosystem',
    algorithm: 'HS256'
  },
  downstream: {
    security: process.env.SVC_SEC_URL || 'http://localhost:3000',
    inventory: process.env.SVC_INV_URL || 'http://localhost:3001',
    orders: process.env.SVC_PED_URL || 'http://localhost:3002'
  }
};
