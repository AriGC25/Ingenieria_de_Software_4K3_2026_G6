import { createClient } from '@libsql/client';
import { aplicarMigraciones } from '../src/infraestructura/database/migraciones.js';

const url = process.env.TURSO_DATABASE_URL;
if (!url) {
  console.error('Falta TURSO_DATABASE_URL en backend/.env');
  process.exit(1);
}

const cliente = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN });
try {
  const aplicadas = await aplicarMigraciones(cliente);
  if (aplicadas.length === 0) console.log('No hay migraciones pendientes.');
  for (const nombre of aplicadas) console.log(`Migración aplicada: ${nombre}`);
} finally {
  cliente.close();
}
