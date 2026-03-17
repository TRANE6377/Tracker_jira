const { pool } = require('../config/db');

async function createTask({ ownerId, title, description, status, priority, dueDate }) {
  const { rows } = await pool.query(
    `insert into tasks (owner_id, title, description, status, priority, due_date)
     values ($1, $2, $3, $4, $5, $6)
     returning id, owner_id, title, description, status, priority, due_date, created_at, updated_at`,
    [ownerId, title, description ?? null, status, priority, dueDate ?? null],
  );
  return rows[0];
}

async function listTasksByOwner(ownerId, { status, q, limit, offset }) {
  const where = ['owner_id = $1'];
  const params = [ownerId];

  if (status) {
    params.push(status);
    where.push(`status = $${params.length}`);
  }

  if (q) {
    params.push(`%${q}%`);
    where.push(`(title ilike $${params.length} or description ilike $${params.length})`);
  }

  params.push(limit);
  const limitIdx = params.length;
  params.push(offset);
  const offsetIdx = params.length;

  const { rows } = await pool.query(
    `select id, owner_id, title, description, status, priority, due_date, created_at, updated_at
     from tasks
     where ${where.join(' and ')}
     order by created_at desc
     limit $${limitIdx} offset $${offsetIdx}`,
    params,
  );

  return rows;
}

async function findTaskByIdForOwner(taskId, ownerId) {
  const { rows } = await pool.query(
    `select id, owner_id, title, description, status, priority, due_date, created_at, updated_at
     from tasks
     where id = $1 and owner_id = $2`,
    [taskId, ownerId],
  );
  return rows[0] || null;
}

async function updateTaskForOwner(taskId, ownerId, patch) {
  const fields = [];
  const params = [];

  function add(field, value) {
    params.push(value);
    fields.push(`${field} = $${params.length}`);
  }

  if (patch.title !== undefined) add('title', patch.title);
  if (patch.description !== undefined) add('description', patch.description);
  if (patch.status !== undefined) add('status', patch.status);
  if (patch.priority !== undefined) add('priority', patch.priority);
  if (patch.dueDate !== undefined) add('due_date', patch.dueDate);

  if (fields.length === 0) return findTaskByIdForOwner(taskId, ownerId);

  params.push(taskId);
  const taskIdIdx = params.length;
  params.push(ownerId);
  const ownerIdIdx = params.length;

  const { rows } = await pool.query(
    `update tasks
     set ${fields.join(', ')}, updated_at = now()
     where id = $${taskIdIdx} and owner_id = $${ownerIdIdx}
     returning id, owner_id, title, description, status, priority, due_date, created_at, updated_at`,
    params,
  );
  return rows[0] || null;
}

async function deleteTaskForOwner(taskId, ownerId) {
  const { rows } = await pool.query(
    `delete from tasks
     where id = $1 and owner_id = $2
     returning id`,
    [taskId, ownerId],
  );
  return rows[0] || null;
}

module.exports = {
  createTask,
  listTasksByOwner,
  findTaskByIdForOwner,
  updateTaskForOwner,
  deleteTaskForOwner,
};

