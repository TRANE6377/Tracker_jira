const { pool } = require('../config/db');

async function createComment({ taskId, authorId, body }) {
  const { rows } = await pool.query(
    `insert into comments (task_id, author_id, body)
     values ($1, $2, $3)
     returning id, task_id, author_id, body, created_at`,
    [taskId, authorId, body],
  );
  return rows[0];
}

async function listCommentsForTask(taskId) {
  const { rows } = await pool.query(
    `select c.id, c.task_id, c.author_id, c.body, c.created_at,
            u.email as author_email, u.name as author_name
     from comments c
     join users u on u.id = c.author_id
     where c.task_id = $1
     order by c.created_at asc`,
    [taskId],
  );
  return rows;
}

async function deleteComment(commentId) {
  const { rows } = await pool.query(
    `delete from comments where id = $1 returning id, task_id, author_id`,
    [commentId],
  );
  return rows[0] || null;
}

async function findCommentById(commentId) {
  const { rows } = await pool.query(
    `select id, task_id, author_id, body, created_at
     from comments
     where id = $1`,
    [commentId],
  );
  return rows[0] || null;
}

module.exports = { createComment, listCommentsForTask, deleteComment, findCommentById };

