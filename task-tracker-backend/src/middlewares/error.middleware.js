const { AppError } = require('../utils/errors');
const { ErrorCodes } = require('../constants/errors');

function errorMiddleware(err, req, res, next) {
  const isApp = err instanceof AppError;
  const status = isApp ? err.status : 500;
  const code = isApp ? err.code : ErrorCodes.INTERNAL;

  if (!isApp) {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  const payload = {
    error: {
      code,
      message: isApp ? err.message : 'Internal Server Error',
      ...(isApp && err.details ? { details: err.details } : {}),
    },
  };

  res.status(status).json(payload);
}

module.exports = { errorMiddleware };

