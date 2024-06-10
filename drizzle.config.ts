import { loadEnvConfig } from '@next/env';
import { defineConfig } from 'drizzle-kit';
import { parse } from 'pg-connection-string';

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const { host, port, user, password, database } = parse(process.env.POSTGRES_URL!);

export default defineConfig({
  schema: './drizzle/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    host: host!,
    port: port ? parseInt(port) : 5432, // Default port for PostgreSQL
    user: user!,
    password: password!,
    database: database!,
    ssl: false, // Set to true or configure based on your needs
  },
});
