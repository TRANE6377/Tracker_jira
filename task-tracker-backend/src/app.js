const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const { errorMiddleware } = require('./middlewares/error.middleware');
const { authRoutes } = require('./routes/auth.routes');
const { tasksRoutes } = require('./routes/tasks.routes');

function buildApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '1mb' }));
  app.use(morgan('dev'));

  app.get('/health', (req, res) => res.json({ ok: true }));

  app.use('/auth', authRoutes);
  app.use('/tasks', tasksRoutes);

  app.use((req, res) => res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Not found' } }));
  app.use(errorMiddleware);

  return app;
}

module.exports = { buildApp };

