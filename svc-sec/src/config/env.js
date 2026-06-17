require('dotenv').config();

module.exports = {
  port: Number(process.env.PORT || 3000),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:8000',
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-change-me',
    issuer: process.env.JWT_ISSUER || 'carley-svc-sec',
    audience: process.env.JWT_AUDIENCE || 'carley-digital-ecosystem',
    expiresIn: '8h',
    algorithm: 'HS256'
  },
  loginSignature: {
    secret: process.env.LOGIN_SIGNATURE_SECRET || 'dev-login-signature-secret',
    required: process.env.REQUIRE_LOGIN_SIGNATURE !== 'false'
  }
};
