const policies = require('../config/rbacPolicies');
const HttpError = require('../utils/httpError');

function resolvePolicy(path) {
  return policies.find((policy) => path.startsWith(policy.prefix));
}

module.exports = (req, res, next) => {
  const policy = resolvePolicy(req.path);

  if (!policy) {
    return next();
  }

  if (!req.identity || !policy.roles.includes(req.identity.role)) {
    throw new HttpError(403, 'Forbidden', 'Access Denied');
  }

  return next();
};
