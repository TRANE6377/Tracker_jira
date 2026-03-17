const { z } = require('zod');

const uuid = z.string().uuid();

const taskIdParams = z.object({
  taskId: uuid,
});

const listTasksQuery = z.object({
  status: z.enum(['todo', 'in_progress', 'done']).optional(),
  q: z.string().min(1).max(200).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  offset: z.coerce.number().int().min(0).max(10_000).optional().default(0),
});

const createTaskBody = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(5000).optional(),
  status: z.enum(['todo', 'in_progress', 'done']).optional(),
  priority: z.number().int().min(0).max(10).optional(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(), // YYYY-MM-DD
});

const updateTaskBody = z
  .object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().max(5000).nullable().optional(),
    status: z.enum(['todo', 'in_progress', 'done']).optional(),
    priority: z.number().int().min(0).max(10).optional(),
    dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: 'At least one field is required' });

module.exports = { taskIdParams, listTasksQuery, createTaskBody, updateTaskBody };

