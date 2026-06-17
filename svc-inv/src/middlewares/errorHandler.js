module.exports = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const status = err.status || 500;
  return res.status(status).json({
    status,
    error: err.error || 'Internal Server Error',
    message: err.message || 'Unexpected inventory service error',
    ...(err.details ? { details: err.details } : {})
  });
};
