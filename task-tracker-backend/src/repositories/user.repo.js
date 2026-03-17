const { pool } = require('../config/db');

async function findByEmail(email) {
  const { rows } = await pool.query(
    `select id, email, password_hash, name, created_at
     from users
     where email = $1`,
    [email],
  );
  return rows[0] || null;
}

async function findById(id) {
  const { rows } = await pool.query(
    `select id, email, name, created_at
     from users
     where id = $1`,
    [id],
  );
  return rows[0] || null;
}

async function createUser({ email, passwordHash, name }) {
  const { rows } = await pool.query(
    `insert into users (email, password_hash, name)
     values ($1, $2, $3)
     returning id, email, name, created_at`,
    [email, passwordHash, name ?? null],
  );
  return rows[0];
}

module.exports = { findByEmail, findById, createUser };

