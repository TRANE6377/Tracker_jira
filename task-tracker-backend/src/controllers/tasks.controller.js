const { asyncHandler } = require('../utils/asyncHandler');
const tasksService = require('../services/tasks.service');

const createTask = asyncHandler(async (req, res) => {
  const task = await tasksService.createTask(req.user.id, req.body);
  res.status(201).json({ task });
});

const listTasks = asyncHandler(async (req, res) => {
  const tasks = await tasksService.listTasks(req.user.id, req.query);
  res.json({ tasks });
});

const getTask = asyncHandler(async (req, res) => {
  const task = await tasksService.getTask(req.user.id, req.params.taskId);
  res.json({ task });
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await tasksService.updateTask(req.user.id, req.params.taskId, req.body);
  res.json({ task });
});

const deleteTask = asyncHandler(async (req, res) => {
  const result = await tasksService.deleteTask(req.user.id, req.params.taskId);
  res.json(result);
});

module.exports = { createTask, listTasks, getTask, updateTask, deleteTask };

