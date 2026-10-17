import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Actividad } from '../../../src/dominio/actividad.js';
import { Turno } from '../../../src/dominio/turno.js';
import {
  RepositorioActividadesPrisma,
  RepositorioTurnosPrisma,
} from '../../../src/infraestructura/database/repositorios.js';
import { basePrismaDePrueba } from '../basePrisma.js';

describe('repositorios de actividades y turnos (Prisma)', () => {
  let base;
  let turnos;
  let actividades;

  beforeEach(async () => {
    base = await basePrismaDePrueba();
    await base.cargarActividades();
    turnos = new RepositorioTurnosPrisma(base.prisma);
    actividades = new RepositorioActividadesPrisma(base.prisma);
  });

  afterEach(() => base.cerrar());

  it('REPO-01: obtiene un turno con su actividad', async () => {
    await base.cargarTurno({ ocupados: 3 });

    const turno = await turnos.obtenerPorId('t-tirolesa-2026-10-20-10');

    expect(turno).toBeInstanceOf(Turno);
    expect(turno.actividad).toBeInstanceOf(Actividad);
    expect(turno.actividad.nombre).toBe('Tirolesa');
    expect(turno.inicio).toEqual(new Date('2026-10-20T13:00:00Z'));
    expect(turno.cuposDisponibles()).toBe(7);
  });

  it('REPO-01: devuelve null si el turno no existe', async () => {
    expect(await turnos.obtenerPorId('t-tirolesa-2026-10-20-18')).toBeNull();
  });

  it('REPO-07: lista los turnos de una actividad en una fecha argentina, incluido el de las 17:00', async () => {
    await base.cargarTurno({ hora: '09' });
    await base.cargarTurno({ hora: '17' });
    await base.cargarTurno({ fecha: '2026-10-21', hora: '09' });
    await base.cargarTurno({ actividadId: 'safari', hora: '10' });

    const delDia = await turnos.listarPorActividadYFecha('tirolesa', '2026-10-20');

    expect(delDia.map((t) => t.hora).sort()).toEqual(['09:00', '17:00']);
  });

  it('REPO-09: lista los turnos con cupo libre que empiezan entre dos instantes', async () => {
    await base.cargarTurno({ hora: '10' });
    await base.cargarTurno({ hora: '11', ocupados: 10 });
    await base.cargarTurno({ actividadId: 'safari', hora: '12' });
    await base.cargarTurno({ fecha: '2026-10-22', hora: '10' });

    const disponibles = await turnos.listarDisponiblesEntre(
      new Date('2026-10-20T09:00:00-03:00'),
      new Date('2026-10-21T09:00:00-03:00'),
    );

    expect(disponibles.map((t) => t.id).sort()).toEqual([
      't-safari-2026-10-20-12',
      't-tirolesa-2026-10-20-10',
    ]);
    expect(disponibles[0].actividad).toBeInstanceOf(Actividad);
  });

  it('lista las actividades y obtiene una por id', async () => {
    const todas = await actividades.listar();

    expect(todas).toHaveLength(4);
    expect(todas.every((a) => a instanceof Actividad)).toBe(true);
    expect((await actividades.obtenerPorId('palestra')).edadMinima).toBe(12);
    expect(await actividades.obtenerPorId('paracaidismo')).toBeNull();
  });
});
