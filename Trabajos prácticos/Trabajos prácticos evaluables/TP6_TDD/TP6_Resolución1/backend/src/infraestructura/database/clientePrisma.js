import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '../../../generated/client.js';

/**
 * Cliente Prisma sobre libSQL: el mismo código sirve para `file:` (local y pruebas) y para
 * `libsql://` (Turso, en la demo).
 * @param {{ url: string, authToken?: string }} baseDatos
 */
export function crearClientePrisma({ url, authToken }) {
  return new PrismaClient({ adapter: new PrismaLibSql({ url, authToken }) });
}
