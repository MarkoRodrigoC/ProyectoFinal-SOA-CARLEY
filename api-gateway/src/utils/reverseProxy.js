const http = require('http');
const https = require('https');
const HttpError = require('./httpError');

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];

    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

module.exports = (targetBaseUrl) => async (req, res, next) => {
  try {
    const target = new URL(req.originalUrl, targetBaseUrl);
    const body = await readRequestBody(req);
    const headers = {
      ...req.headers,
      host: target.host,
      'x-carley-user-id': req.identity?.userId || req.header('X-CARLEY-USER-ID') || '',
      'x-carley-role': req.identity?.role || req.header('X-CARLEY-ROLE') || ''
    };

    if (body.length > 0) {
      headers['content-length'] = body.length;
    } else {
      delete headers['content-length'];
    }

    const transport = target.protocol === 'https:' ? https : http;
    const proxyReq = transport.request(
      {
        method: req.method,
        protocol: target.protocol,
        hostname: target.hostname,
        port: target.port,
        path: `${target.pathname}${target.search}`,
        headers
      },
      (proxyRes) => {
        res.status(proxyRes.statusCode || 502);

        Object.entries(proxyRes.headers).forEach(([key, value]) => {
          if (value !== undefined) {
            res.setHeader(key, value);
          }
        });

        proxyRes.pipe(res);
      }
    );

    proxyReq.on('error', () => {
      next(new HttpError(502, 'Bad Gateway', 'Downstream service is unavailable'));
    });

    if (body.length > 0) {
      proxyReq.write(body);
    }

    proxyReq.end();
  } catch (error) {
    next(error);
  }
};
