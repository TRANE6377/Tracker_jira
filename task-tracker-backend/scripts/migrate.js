const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

require('dotenv').config();

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required to run migrations');
  }

  const client = new Client({ connectionString: databaseUrl });
  await client.connect();

  try {
    await client.query(`
      create table if not exists schema_migrations (
        filename text primary key,
        applied_at timestamptz not null default now()
      )
    `);

    const migrationsDir = path.resolve(__dirname, '../src/db/migrations');
    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort((a, b) => a.localeCompare(b));

    const applied = await client.query('select filename from schema_migrations');
    const appliedSet = new Set(applied.rows.map((r) => r.filename));

    const pending = files.filter((f) => !appliedSet.has(f));
    if (pending.length === 0) {
      // eslint-disable-next-line no-console
      console.log('No pending migrations');
      return;
    }

    for (const filename of pending) {
      const fullPath = path.join(migrationsDir, filename);
      const sql = fs.readFileSync(fullPath, 'utf8');

      // eslint-disable-next-line no-console
      console.log(`Applying ${filename}...`);

      await client.query('begin');
      try {
        await client.query(sql);
        await client.query('insert into schema_migrations (filename) values ($1)', [filename]);
        await client.query('commit');
      } catch (e) {
        await client.query('rollback');
        throw e;
      }
    }

    // eslint-disable-next-line no-console
    console.log('Migrations applied');
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

