var Pool = require('pg').Pool;

var pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: Number(process.env.PGPORT || 5432),
  database: process.env.PGDATABASE || 'auxilius_tasks',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres'
});

function getTasks() {
  return pool.query(
    'SELECT id, title, completed, created_at AS "createdAt" FROM tasks ORDER BY id ASC'
  );
}

module.exports = {
  getTasks: getTasks,
  pool: pool
};

