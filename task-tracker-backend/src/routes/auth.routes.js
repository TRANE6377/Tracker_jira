const { Router } = require('express');
const { validate } = require('../middlewares/validate.middleware');
const { authMiddleware } = require('../middlewares/auth.middleware');
const authController = require('../controllers/auth.controller');
const authSchemas = require('../validators/auth.schemas');

const authRoutes = Router();

authRoutes.post('/register', validate({ body: authSchemas.registerBody }), authController.register);
authRoutes.post('/login', validate({ body: authSchemas.loginBody }), authController.login);
authRoutes.get('/me', authMiddleware, authController.me);

module.exports = { authRoutes };

