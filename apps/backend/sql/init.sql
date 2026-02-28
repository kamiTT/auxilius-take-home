CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO tasks (title, completed)
VALUES
  ('Set up backend API', TRUE),
  ('Connect API to Postgres', TRUE),
  ('Expose tasks endpoint', FALSE);
