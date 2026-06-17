const crypto = require('crypto');
const env = require('../config/env');
const HttpError = require('../utils/httpError');

function canonicalizeBody(body) {
  return JSON.stringify(body || {});
}

module.exports = (req, res, next) => {
  if (!env.loginSignature.required) {
    return next();
  }

  const receivedSignature = req.header('X-CARLEY-SIGNATURE');
  if (!receivedSignature) {
    throw new HttpError(401, 'Unauthorized', 'Missing cryptographic request signature');
  }

  const expectedSignature = crypto
    .createHmac('sha256', env.loginSignature.secret)
    .update(canonicalizeBody(req.body))
    .digest('hex');

  const received = Buffer.from(receivedSignature, 'hex');
  const expected = Buffer.from(expectedSignature, 'hex');

  if (received.length !== expected.length || !crypto.timingSafeEqual(received, expected)) {
    throw new HttpError(401, 'Unauthorized', 'Invalid cryptographic request signature');
  }

  return next();
};
