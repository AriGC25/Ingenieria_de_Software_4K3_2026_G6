import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { aplicarMigraciones } from '../../../src/infraestructura/database/migraciones.js';
import { baseTemporal } from '../baseTemporal.js';

function carpetaDeMigraciones(migraciones) {
  const carpeta = mkdtempSync(join(tmpdir(), 'migraciones-'));
  for (const [nombre, sql] of Object.entries(migraciones)) {
    mkdirSync(join(carpeta, nombre));
    writeFileSync(join(carpeta, nombre, 'migration.sql'), sql);
  }
  return carpeta;
}

describe('aplicarMigraciones', () => {
  let base;

  beforeEach(() => {
    base = baseTemporal();
  });

  afterEach(() => base.borrar());

  it('MIG-01: aplica las migraciones pendientes en orden', async () => {
    const carpeta = carpetaDeMigraciones({
      '20260102_segunda': 'INSERT INTO prueba (valor) VALUES (2);',
      '20260101_primera':
        'CREATE TABLE prueba (valor INTEGER);\nINSERT INTO prueba (valor) VALUES (1);',
    });

    const aplicadas = await aplicarMigraciones(base.cliente, carpeta);

    expect(aplicadas).toEqual(['20260101_primera', '20260102_segunda']);
    const { rows } = await base.cliente.execute('SELECT valor FROM prueba ORDER BY valor');
    expect(rows.map((r) => r.valor)).toEqual([1, 2]);
  });

  it('MIG-01: aplica las migraciones reales del esquema', async () => {
    await aplicarMigraciones(base.cliente);

    const { rows } = await base.cliente.execute(
      "SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name",
    );
    expect(rows.map((r) => r.name)).toEqual(
      expect.arrayContaining(['Actividad', 'Inscripcion', 'Participante', 'Turno']),
    );
  });

  it('MIG-02: ejecutarla dos veces no vuelve a aplicar nada', async () => {
    const carpeta = carpetaDeMigraciones({
      '20260101_unica': 'CREATE TABLE prueba (valor INTEGER);',
    });
    await aplicarMigraciones(base.cliente, carpeta);

    const segundaVez = await aplicarMigraciones(base.cliente, carpeta);

    expect(segundaVez).toEqual([]);
  });

  it('MIG-02: si se agrega una migración nueva, aplica solo esa', async () => {
    const carpeta = carpetaDeMigraciones({
      '20260101_primera': 'CREATE TABLE prueba (valor INTEGER);',
    });
    await aplicarMigraciones(base.cliente, carpeta);
    mkdirSync(join(carpeta, '20260102_segunda'));
    writeFileSync(
      join(carpeta, '20260102_segunda', 'migration.sql'),
      'ALTER TABLE prueba ADD otro TEXT;',
    );

    expect(await aplicarMigraciones(base.cliente, carpeta)).toEqual(['20260102_segunda']);
  });
});
