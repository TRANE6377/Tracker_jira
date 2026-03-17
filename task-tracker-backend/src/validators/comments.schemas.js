const { z } = require('zod');

const uuid = z.string().uuid();

const taskIdParams = z.object({
  taskId: uuid,
});

const commentIdParams = z.object({
  taskId: uuid,
  commentId: uuid,
});

const createCommentBody = z.object({
  body: z.string().min(1).max(5000),
});

module.exports = { taskIdParams, commentIdParams, createCommentBody };

