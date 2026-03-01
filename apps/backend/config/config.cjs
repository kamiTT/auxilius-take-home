const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const appRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(appRoot, '..', '..');
const environment = process.env.NODE_ENV || 'development';
const envFiles = [
  '.env',
  '.env.local',
  '.env.' + environment,
  '.env.' + environment + '.local'
];

const loadEnvFrom = (baseDir) => {
  envFiles.forEach((envFile) => {
    const envPath = path.join(baseDir, envFile);
    if (fs.existsSync(envPath)) {
      dotenv.config({ path: envPath, override: true });
    }
  });
};

// Load repo-level env first, then backend-level env.
loadEnvFrom(repoRoot);
loadEnvFrom(appRoot);

const envConfig = () => ({
  username: process.env.PGUSER || process.env.DB_USER || 'postgres',
  password: process.env.PGPASSWORD || process.env.DB_PASSWORD || 'postgres',
  database: process.env.PGDATABASE || process.env.DB_NAME || 'auxilius_tasks',
  host: process.env.PGHOST || process.env.DB_HOST || 'localhost',
  port: Number(process.env.PGPORT || process.env.DB_PORT || 5432),
  dialect: 'postgres',
  logging: false
});

module.exports = {
  development: envConfig(),
  test: envConfig(),
  production: envConfig()
};
