const { ErrorCodes } = require('../constants/errors');

class AppError extends Error {
  constructor(message, { status = 500, code = ErrorCodes.INTERNAL, details } = {}) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

module.exports = { AppError };

