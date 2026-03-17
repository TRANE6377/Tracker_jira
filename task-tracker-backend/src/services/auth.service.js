const { AppError } = require('../utils/errors');
const { ErrorCodes } = require('../constants/errors');
const { hashPassword, verifyPassword } = require('../utils/password');
const { signAccessToken } = require('../utils/jwt');
const userRepo = require('../repositories/user.repo');

async function register({ email, password, name }) {
  const existing = await userRepo.findByEmail(email);
  if (existing) {
    throw new AppError('Email already registered', { status: 409, code: ErrorCodes.CONFLICT });
  }

  const passwordHash = await hashPassword(password);
  const user = await userRepo.createUser({ email, passwordHash, name });

  const token = signAccessToken({ sub: user.id, email: user.email });
  return { user, accessToken: token };
}

async function login({ email, password }) {
  const user = await userRepo.findByEmail(email);
  if (!user) {
    throw new AppError('Invalid credentials', { status: 401, code: ErrorCodes.UNAUTHORIZED });
  }

  const ok = await verifyPassword(password, user.password_hash);
  if (!ok) {
    throw new AppError('Invalid credentials', { status: 401, code: ErrorCodes.UNAUTHORIZED });
  }

  const token = signAccessToken({ sub: user.id, email: user.email });
  return {
    user: { id: user.id, email: user.email, name: user.name, created_at: user.created_at },
    accessToken: token,
  };
}

async function me(userId) {
  const user = await userRepo.findById(userId);
  if (!user) {
    throw new AppError('User not found', { status: 404, code: ErrorCodes.NOT_FOUND });
  }
  return user;
}

module.exports = { register, login, me };

