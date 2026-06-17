const jwt = require('jsonwebtoken');
const env = require('../config/env');
const HttpError = require('../utils/httpError');

module.exports = (req, res, next) => {
  const authorization = req.header('Authorization');

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new HttpError(401, 'Unauthorized', 'Missing Bearer token');
  }

  const token = authorization.slice('Bearer '.length).trim();
  if (!token) {
    throw new HttpError(401, 'Unauthorized', 'Missing Bearer token');
  }

  try {
    req.identity = jwt.verify(token, env.jwt.secret, {
      algorithms: [env.jwt.algorithm],
      issuer: env.jwt.issuer,
      audience: env.jwt.audience
    });
    return next();
  } catch (error) {
    throw new HttpError(401, 'Unauthorized', 'Invalid or expired Bearer token');
  }
};
