const { AppError } = require('../utils/errors');
const { ErrorCodes } = require('../constants/errors');
const taskRepo = require('../repositories/task.repo');

const AllowedStatuses = new Set(['todo', 'in_progress', 'done']);

function ensureStatus(status) {
  if (status && !AllowedStatuses.has(status)) {
    throw new AppError('Invalid status', { status: 400, code: ErrorCodes.VALIDATION });
  }
}

async function createTask(ownerId, dto) {
  ensureStatus(dto.status);
  return taskRepo.createTask({
    ownerId,
    title: dto.title,
    description: dto.description,
    status: dto.status ?? 'todo',
    priority: dto.priority ?? 0,
    dueDate: dto.dueDate ?? null,
  });
}

async function listTasks(ownerId, query) {
  ensureStatus(query.status);
  return taskRepo.listTasksByOwner(ownerId, query);
}

async function getTask(ownerId, taskId) {
  const task = await taskRepo.findTaskByIdForOwner(taskId, ownerId);
  if (!task) throw new AppError('Task not found', { status: 404, code: ErrorCodes.NOT_FOUND });
  return task;
}

async function updateTask(ownerId, taskId, patch) {
  ensureStatus(patch.status);
  const updated = await taskRepo.updateTaskForOwner(taskId, ownerId, patch);
  if (!updated) throw new AppError('Task not found', { status: 404, code: ErrorCodes.NOT_FOUND });
  return updated;
}

async function deleteTask(ownerId, taskId) {
  const deleted = await taskRepo.deleteTaskForOwner(taskId, ownerId);
  if (!deleted) throw new AppError('Task not found', { status: 404, code: ErrorCodes.NOT_FOUND });
  return { id: deleted.id };
}

module.exports = { createTask, listTasks, getTask, updateTask, deleteTask };

