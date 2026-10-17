import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const CARPETA_MIGRACIONES = fileURLToPath(
  new URL('../../../database/migraciones', import.meta.url),
);

/**
 * Aplica los `migration.sql` que generó Prisma y todavía no se aplicaron, en orden. Es la misma
 * función para Turso (donde `prisma migrate` no corre) y para las bases de las pruebas.
 * @param {import('@libsql/client').Client} cliente
 * @param {string} [carpeta]
 * @returns {Promise<string[]>} los nombres de las migraciones aplicadas
 */
export async function aplicarMigraciones(cliente, carpeta = CARPETA_MIGRACIONES) {
  const pendientes = await migracionesPendientes(cliente, carpeta);
  for (const nombre of pendientes) {
    await aplicar(cliente, nombre, readFileSync(join(carpeta, nombre, 'migration.sql'), 'utf8'));
  }
  return pendientes;
}

async function migracionesPendientes(cliente, carpeta) {
  await cliente.execute(
    'CREATE TABLE IF NOT EXISTS _migraciones (nombre TEXT PRIMARY KEY, aplicadaEn TEXT NOT NULL)',
  );
  const { rows } = await cliente.execute('SELECT nombre FROM _migraciones');
  const yaAplicadas = new Set(rows.map((fila) => fila.nombre));
  return readdirSync(carpeta, { withFileTypes: true })
    .filter((entrada) => entrada.isDirectory() && !yaAplicadas.has(entrada.name))
    .map((entrada) => entrada.name)
    .sort();
}

async function aplicar(cliente, nombre, sql) {
  await cliente.executeMultiple(sql);
  await cliente.execute({
    sql: 'INSERT INTO _migraciones (nombre, aplicadaEn) VALUES (?, ?)',
    args: [nombre, new Date().toISOString()],
  });
}
