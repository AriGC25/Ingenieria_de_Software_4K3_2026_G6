import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { crearCalendarioParque } from '../../../src/dominio/calendarioParque.js';
import { fechaArgentina, horaArgentina } from '../../../src/dominio/fechas.js';
import { sembrarDatos } from '../../../src/infraestructura/database/sembrarDatos.js';
import { basePrismaDePrueba } from '../basePrisma.js';

// Martes 20/10/2026: los 7 días van del martes 20 al lunes 26 (cerrado).
const opciones = {
  ahora: new Date('2026-10-20T09:00:00-03:00'),
  calendario: crearCalendarioParque(),
  diasAdelante: 7,
};

describe('sembrarDatos', () => {
  let base;

  beforeEach(async () => {
    base = await basePrismaDePrueba();
  });

  afterEach(() => base.cerrar());

  it('SEED-01: carga las 4 actividades con cupo, talle, edad mínima y términos', async () => {
    await sembrarDatos(base.prisma, opciones);

    const actividades = await base.prisma.actividad.findMany({ orderBy: { id: 'asc' } });
    expect(actividades.map(({ terminos: _t, ...a }) => a)).toEqual([
      {
        id: 'jardineria',
        nombre: 'Jardinería',
        requiereTalle: false,
        edadMinima: null,
        cupoPorTurno: 12,
      },
      { id: 'palestra', nombre: 'Palestra', requiereTalle: true, edadMinima: 12, cupoPorTurno: 12 },
      { id: 'safari', nombre: 'Safari', requiereTalle: false, edadMinima: null, cupoPorTurno: 8 },
      { id: 'tirolesa', nombre: 'Tirolesa', requiereTalle: true, edadMinima: 8, cupoPorTurno: 10 },
    ]);
    for (const actividad of actividades) {
      expect(actividad.terminos).toMatch(/edad/i);
      expect(actividad.terminos).toMatch(/seguridad/i);
      expect(actividad.terminos).toMatch(/equipo/i);
    }
  });

  it('SEED-02: crea los turnos de 09:00 a 17:00 de los próximos 7 días, salteando lunes y feriados', async () => {
    await sembrarDatos(base.prisma, opciones);

    const turnos = await base.prisma.turno.findMany({ where: { actividadId: 'tirolesa' } });
    const fechas = [...new Set(turnos.map((t) => fechaArgentina(t.inicio)))].sort();
    expect(fechas).toEqual([
      '2026-10-20',
      '2026-10-21',
      '2026-10-22',
      '2026-10-23',
      '2026-10-24',
      '2026-10-25',
    ]);
    expect(turnos).toHaveLength(6 * 9);
    expect(await base.prisma.turno.count()).toBe(4 * 6 * 9);
    expect(
      await base.prisma.turno.findUnique({ where: { id: 't-tirolesa-2026-10-20-17' } }),
    ).not.toBeNull();
  });

  it('SEED-02: saltea los feriados cerrados', async () => {
    await sembrarDatos(base.prisma, {
      ...opciones,
      ahora: new Date('2026-12-24T09:00:00-03:00'),
      diasAdelante: 3,
    });

    const turnos = await base.prisma.turno.findMany({ where: { actividadId: 'safari' } });
    const fechas = [...new Set(turnos.map((t) => fechaArgentina(t.inicio)))].sort();
    expect(fechas).toEqual(['2026-12-24', '2026-12-26']);
  });

  it('SEED-03: no crea turnos a las 08:00, a las 18:00 ni a horas que no sean en punto', async () => {
    await sembrarDatos(base.prisma, opciones);

    const horas = new Set((await base.prisma.turno.findMany()).map((t) => horaArgentina(t.inicio)));
    expect([...horas].sort()).toEqual([
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
    ]);
  });

  it('SEED-04: volver a correrlo no duplica datos ni modifica las inscripciones', async () => {
    await sembrarDatos(base.prisma, opciones);
    await base.prisma.turno.update({
      where: { id: 't-safari-2026-10-20-10' },
      data: { cupoOcupado: 2 },
    });
    await base.prisma.inscripcion.create({
      data: {
        codigo: 'ECOPARK-7K3M9Q',
        turnoId: 't-safari-2026-10-20-10',
        email: 'ana@mail.com',
        terminosAceptadosEn: new Date(),
        participantes: { create: [{ nombre: 'Ana', dni: '40123456', edad: 25 }] },
      },
    });

    await sembrarDatos(base.prisma, { ...opciones, diasAdelante: 8 });

    expect(await base.prisma.actividad.count()).toBe(4);
    expect(await base.prisma.turno.count()).toBe(4 * 7 * 9);
    expect(await base.prisma.inscripcion.count()).toBe(1);
    const turno = await base.prisma.turno.findUnique({ where: { id: 't-safari-2026-10-20-10' } });
    expect(turno.cupoOcupado).toBe(2);
  });

  it('SEED-05: cada turno nace con 0 cupos ocupados y el cupo máximo de su actividad', async () => {
    await sembrarDatos(base.prisma, opciones);

    const turnos = await base.prisma.turno.findMany({ include: { actividad: true } });
    expect(turnos.every((t) => t.cupoOcupado === 0)).toBe(true);
    expect(turnos.every((t) => t.cupoMaximo === t.actividad.cupoPorTurno)).toBe(true);
  });
});
