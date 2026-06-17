const http = require('http');
const https = require('https');
const env = require('../config/env');
const HttpError = require('../utils/httpError');

class InventoryClient {
  constructor({ baseUrl = env.inventoryServiceUrl } = {}) {
    this.baseUrl = baseUrl;
  }

  async findStockBySku(sku) {
    const url = new URL(`/api/inventario/buscar/${encodeURIComponent(sku)}`, this.baseUrl);
    return this.requestJson(url, { method: 'GET' }, `SKU ${sku} does not exist in inventory`);
  }

  async reserveStock(items) {
    const url = new URL('/api/inventario/reservar', this.baseUrl);
    return this.requestJson(
      url,
      {
        method: 'POST',
        body: JSON.stringify({ items }),
        headers: {
          'Content-Type': 'application/json'
        }
      },
      'Inventory service rejected stock reservation'
    );
  }

  async requestJson(url, options, conflictMessage) {
    const transport = url.protocol === 'https:' ? https : http;

    return new Promise((resolve, reject) => {
      const req = transport.request(
        {
          method: options.method,
          protocol: url.protocol,
          hostname: url.hostname,
          port: url.port,
          path: `${url.pathname}${url.search}`,
          timeout: 5000,
          headers: {
            Accept: 'application/json',
            ...(options.headers || {})
          }
        },
        (res) => {
          const chunks = [];

          res.on('data', (chunk) => chunks.push(chunk));
          res.on('end', () => {
            const rawBody = Buffer.concat(chunks).toString('utf8');
            let body = {};

            try {
              body = rawBody ? JSON.parse(rawBody) : {};
            } catch (error) {
              return reject(new HttpError(502, 'Bad Gateway', 'Inventory service returned invalid JSON'));
            }

            if (res.statusCode === 404) {
              return reject(new HttpError(409, 'Conflict', conflictMessage));
            }

            if (res.statusCode === 409) {
              return reject(new HttpError(409, 'Conflict', body.message || conflictMessage, body.details));
            }

            if (res.statusCode < 200 || res.statusCode >= 300) {
              return reject(new HttpError(502, 'Bad Gateway', body.message || 'Inventory service rejected request'));
            }

            return resolve(body);
          });
        }
      );

      req.on('timeout', () => {
        req.destroy(new HttpError(502, 'Bad Gateway', 'Inventory service timeout'));
      });

      req.on('error', (error) => {
        if (error instanceof HttpError) {
          return reject(error);
        }

        return reject(new HttpError(502, 'Bad Gateway', 'Inventory service is unavailable'));
      });

      if (options.body) {
        req.write(options.body);
      }

      req.end();
    });
  }
}

module.exports = InventoryClient;
