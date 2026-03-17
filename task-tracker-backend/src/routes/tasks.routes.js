const { Router } = require('express');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const tasksController = require('../controllers/tasks.controller');
const commentsController = require('../controllers/comments.controller');
const tasksSchemas = require('../validators/tasks.schemas');
const commentsSchemas = require('../validators/comments.schemas');

const tasksRoutes = Router();

tasksRoutes.use(authMiddleware);

tasksRoutes.post('/', validate({ body: tasksSchemas.createTaskBody }), tasksController.createTask);
tasksRoutes.get('/', validate({ query: tasksSchemas.listTasksQuery }), tasksController.listTasks);
tasksRoutes.get(
  '/:taskId',
  validate({ params: tasksSchemas.taskIdParams }),
  tasksController.getTask,
);
tasksRoutes.patch(
  '/:taskId',
  validate({ params: tasksSchemas.taskIdParams, body: tasksSchemas.updateTaskBody }),
  tasksController.updateTask,
);
tasksRoutes.delete(
  '/:taskId',
  validate({ params: tasksSchemas.taskIdParams }),
  tasksController.deleteTask,
);

tasksRoutes.post(
  '/:taskId/comments',
  validate({ params: commentsSchemas.taskIdParams, body: commentsSchemas.createCommentBody }),
  commentsController.addComment,
);
tasksRoutes.get(
  '/:taskId/comments',
  validate({ params: commentsSchemas.taskIdParams }),
  commentsController.listComments,
);
tasksRoutes.delete(
  '/:taskId/comments/:commentId',
  validate({ params: commentsSchemas.commentIdParams }),
  commentsController.deleteComment,
);

module.exports = { tasksRoutes };

