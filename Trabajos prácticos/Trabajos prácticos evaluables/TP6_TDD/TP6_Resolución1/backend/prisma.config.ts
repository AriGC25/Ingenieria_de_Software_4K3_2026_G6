import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'database/schema.prisma',
  migrations: { path: 'database/migraciones' },
  datasource: { url: process.env.DATABASE_URL ?? 'file:./dev.db' },
});
