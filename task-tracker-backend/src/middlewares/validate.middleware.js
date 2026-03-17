const { z } = require('zod');
const { AppError } = require('../utils/errors');
const { ErrorCodes } = require('../constants/errors');

function validate({ body, params, query } = {}) {
  return function validateMiddleware(req, res, next) {
    try {
      if (body) req.body = body.parse(req.body);
      if (params) req.params = params.parse(req.params);
      if (query) req.query = query.parse(req.query);
      next();
    } catch (e) {
      if (e instanceof z.ZodError) {
        return next(
          new AppError('Validation error', {
            status: 400,
            code: ErrorCodes.VALIDATION,
            details: e.flatten(),
          }),
        );
      }
      next(e);
    }
  };
}

module.exports = { validate };

