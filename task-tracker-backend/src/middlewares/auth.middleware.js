const { verifyAccessToken } = require('../utils/jwt');
const { AppError } = require('../utils/errors');
const { ErrorCodes } = require('../constants/errors');

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const [, token] = header.split(' ');

  if (!token) {
    return next(
      new AppError('Missing bearer token', { status: 401, code: ErrorCodes.UNAUTHORIZED }),
    );
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch {
    next(new AppError('Invalid token', { status: 401, code: ErrorCodes.UNAUTHORIZED }));
  }
}

module.exports = { authMiddleware };

