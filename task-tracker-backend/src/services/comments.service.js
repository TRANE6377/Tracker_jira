const { AppError } = require('../utils/errors');
const { ErrorCodes } = require('../constants/errors');
const commentRepo = require('../repositories/comment.repo');
const taskRepo = require('../repositories/task.repo');

async function ensureTaskAccessible(taskId, ownerId) {
  const task = await taskRepo.findTaskByIdForOwner(taskId, ownerId);
  if (!task) throw new AppError('Task not found', { status: 404, code: ErrorCodes.NOT_FOUND });
  return task;
}

async function addComment({ taskId, ownerId, authorId, body }) {
  await ensureTaskAccessible(taskId, ownerId);
  return commentRepo.createComment({ taskId, authorId, body });
}

async function listComments({ taskId, ownerId }) {
  await ensureTaskAccessible(taskId, ownerId);
  return commentRepo.listCommentsForTask(taskId);
}

async function deleteComment({ taskId, commentId, ownerId, requesterId }) {
  await ensureTaskAccessible(taskId, ownerId);

  const comment = await commentRepo.findCommentById(commentId);
  if (!comment || comment.task_id !== taskId) {
    throw new AppError('Comment not found', { status: 404, code: ErrorCodes.NOT_FOUND });
  }

  if (comment.author_id !== requesterId) {
    throw new AppError('Forbidden', { status: 403, code: ErrorCodes.FORBIDDEN });
  }

  await commentRepo.deleteComment(commentId);
  return { id: commentId };
}

module.exports = { addComment, listComments, deleteComment };

