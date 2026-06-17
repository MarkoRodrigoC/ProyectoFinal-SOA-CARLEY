class HttpError extends Error {
  constructor(status, error, message, details) {
    super(message);
    this.status = status;
    this.error = error;
    this.details = details;
  }
}

module.exports = HttpError;
