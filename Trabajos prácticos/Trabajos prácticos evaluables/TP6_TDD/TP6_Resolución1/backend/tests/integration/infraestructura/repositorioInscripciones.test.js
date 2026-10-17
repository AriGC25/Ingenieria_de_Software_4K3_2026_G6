import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { SinCupo } from '../../../src/dominio/errores.js';
import { CodigoDuplicado } from '../../../src/aplicacion/puertos.js';
import { RepositorioInscripcionesPrisma } from '../../../src/infraestructura/database/repositorioInscripciones.js';
import { basePrismaDePrueba } from '../basePrisma.js';

const TURNO = 't-tirolesa-2026-10-20-10';
const ACEPTADOS = new Date('2026-10-20T09:00:00-03:00');

function unaInscripcionARegistrar({
  codigo = 'ECOPARK-7K3M9Q',
  turnoId = TURNO,
  dnis = ['40123456'],
} = {}) {
  return {
    codigo,
    turnoId,
    email: 'ana@mail.com',
    terminosAceptadosEn: ACEPTADOS,
    participantes: dnis.map((dni, i) => ({ nombre: `Persona ${i}`, dni, edad: 30, talle: 'M' })),
  };
}

describe('RepositorioInscripcionesPrisma', () => {
  let base;
  let repositorio;

  const cupoOcupado = async (id = TURNO) =>
    (await base.prisma.turno.findUnique({ where: { id } })).cupoOcupado;

  beforeEach(async () => {
    base = await basePrismaDePrueba();
    await base.cargarActividades();
    await base.cargarTurno();
    repositorio = new RepositorioInscripcionesPrisma(base.prisma);
  });

  afterEach(() => base.cerrar());

  it('REPO-02: guarda la inscripción con sus participantes y descuenta los cupos', async () => {
    const { id } = await repositorio.registrarConReserva(
      unaInscripcionARegistrar({ dnis: ['40123456', '42123456'] }),
    );

    const guardada = await base.prisma.inscripcion.findUnique({
      where: { id },
      include: { participantes: true },
    });
    expect(guardada).toMatchObject({
      codigo: 'ECOPARK-7K3M9Q',
      turnoId: TURNO,
      email: 'ana@mail.com',
      terminosAceptadosEn: ACEPTADOS,
    });
    expect(guardada.participantes.map((p) => p.dni).sort()).toEqual(['40123456', '42123456']);
    expect(await cupoOcupado()).toBe(2);
  });

  it('REPO-03: sin cupo suficiente no guarda nada y lanza SinCupo', async () => {
    await base.prisma.turno.update({ where: { id: TURNO }, data: { cupoOcupado: 9 } });

    await expect(
      repositorio.registrarConReserva(unaInscripcionARegistrar({ dnis: ['1111111', '2222222'] })),
    ).rejects.toBeInstanceOf(SinCupo);

    expect(await base.prisma.inscripcion.count()).toBe(0);
    expect(await cupoOcupado()).toBe(9);
  });

  it('REPO-04: 20 reservas concurrentes sobre 8 cupos dejan 8 exitosas y el cupo en 8', async () => {
    await base.cargarTurno({ actividadId: 'safari' });
    const reservas = Array.from({ length: 20 }, (_, i) =>
      repositorio.registrarConReserva(
        unaInscripcionARegistrar({
          codigo: `ECOPARK-${String(i).padStart(6, 'A')}`,
          turnoId: 't-safari-2026-10-20-10',
          dnis: [String(30000000 + i)],
        }),
      ),
    );

    const resultados = await Promise.allSettled(reservas);

    const exitosas = resultados.filter((r) => r.status === 'fulfilled');
    const rechazadas = resultados.filter((r) => r.status === 'rejected');
    expect(exitosas).toHaveLength(8);
    expect(rechazadas.every((r) => r.reason instanceof SinCupo)).toBe(true);
    expect(await cupoOcupado('t-safari-2026-10-20-10')).toBe(8);
  });

  it('REPO-05: un código duplicado se informa como colisión y no ocupa cupos', async () => {
    await repositorio.registrarConReserva(unaInscripcionARegistrar());

    await expect(
      repositorio.registrarConReserva(unaInscripcionARegistrar({ dnis: ['39000000'] })),
    ).rejects.toBeInstanceOf(CodigoDuplicado);

    expect(await cupoOcupado()).toBe(1);
  });

  it('REPO-06: devuelve los DNI inscriptos en turnos con el mismo inicio, de cualquier actividad', async () => {
    await base.cargarTurno({ actividadId: 'safari' });
    await base.cargarTurno({ hora: '11' });
    await repositorio.registrarConReserva(
      unaInscripcionARegistrar({ turnoId: 't-safari-2026-10-20-10', dnis: ['40123456'] }),
    );
    await repositorio.registrarConReserva(
      unaInscripcionARegistrar({
        codigo: 'ECOPARK-BBBBBB',
        turnoId: 't-tirolesa-2026-10-20-11',
        dnis: ['42123456'],
      }),
    );

    const dnis = await repositorio.dnisInscriptosEnInicio(new Date('2026-10-20T10:00:00-03:00'), [
      '40123456',
      '42123456',
      '43000000',
    ]);

    expect(dnis).toEqual(['40123456']);
  });

  it('REPO-08: anular borra la inscripción con sus participantes y devuelve los cupos', async () => {
    await base.prisma.turno.update({ where: { id: TURNO }, data: { cupoOcupado: 4 } });
    const { id } = await repositorio.registrarConReserva(
      unaInscripcionARegistrar({ dnis: ['40123456', '42123456', '43123456'] }),
    );

    await repositorio.anular(id);

    expect(await base.prisma.inscripcion.count()).toBe(0);
    expect(await base.prisma.participante.count()).toBe(0);
    expect(await cupoOcupado()).toBe(4);
  });
});
