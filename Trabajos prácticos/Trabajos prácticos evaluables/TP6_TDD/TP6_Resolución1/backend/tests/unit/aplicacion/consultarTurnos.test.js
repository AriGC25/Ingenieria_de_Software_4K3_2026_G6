import { describe, it, expect, beforeEach } from 'vitest';
import { ConsultarTurnos } from '../../../src/aplicacion/consultarTurnos.js';
import { crearCalendarioParque } from '../../../src/dominio/calendarioParque.js';
import { unTurno } from '../../builders/turno.js';
import { relojFijo } from '../../dobles/reloj.js';
import { repositoriosEnMemoria } from '../../dobles/repositorios.js';

describe('ConsultarTurnos', () => {
  let repos;
  let consultarTurnos;

  beforeEach(() => {
    repos = repositoriosEnMemoria();
    consultarTurnos = new ConsultarTurnos({
      repositorioActividades: repos.repositorioActividades,
      repositorioTurnos: repos.repositorioTurnos,
      reloj: relojFijo(),
      calendario: crearCalendarioParque(),
    });
  });

  it('APP-40: con una actividad inexistente lanza ACTIVIDAD_INEXISTENTE', async () => {
    await expect(
      consultarTurnos.ejecutar({ actividadId: 'paracaidismo', fecha: '2026-10-20' }),
    ).rejects.toMatchObject({ codigo: 'ACTIVIDAD_INEXISTENTE' });
  });

  it('APP-41: devuelve los turnos de la fecha con su hora, cupos disponibles y estado', async () => {
    repos.repositorioTurnos
      .agregar(unTurno().aLas('10').conOcupados(3).build())
      .agregar(unTurno().aLas('11').conOcupados(10).build())
      .agregar(unTurno().el('2026-10-21', '10').build());

    const resultado = await consultarTurnos.ejecutar({
      actividadId: 'tirolesa',
      fecha: '2026-10-20',
    });

    expect(resultado).toEqual({
      fecha: '2026-10-20',
      abierta: true,
      turnos: [
        {
          id: 't-tirolesa-2026-10-20-10',
          hora: '10:00',
          cuposDisponibles: 7,
          estado: 'disponible',
        },
        { id: 't-tirolesa-2026-10-20-11', hora: '11:00', cuposDisponibles: 0, estado: 'agotado' },
      ],
    });
  });

  it('APP-42: un día cerrado devuelve abierta: false, el motivo y una lista vacía', async () => {
    const resultado = await consultarTurnos.ejecutar({
      actividadId: 'safari',
      fecha: '2026-10-19',
    });

    expect(resultado).toEqual({ fecha: '2026-10-19', abierta: false, motivo: 'lunes', turnos: [] });
  });

  it('APP-43: los turnos vienen ordenados por hora', async () => {
    ['17', '09', '13', '10'].forEach((hora) =>
      repos.repositorioTurnos.agregar(unTurno().aLas(hora).build()),
    );

    const { turnos } = await consultarTurnos.ejecutar({
      actividadId: 'tirolesa',
      fecha: '2026-10-20',
    });

    expect(turnos.map((t) => t.hora)).toEqual(['09:00', '10:00', '13:00', '17:00']);
  });

  it('APP-44: los turnos no disponibles traen su motivo', async () => {
    repos.repositorioTurnos
      .agregar(unTurno().aLas('09').build())
      .agregar(unTurno().el('2026-10-21', '10').build());

    const hoy = await consultarTurnos.ejecutar({ actividadId: 'tirolesa', fecha: '2026-10-20' });
    const manana = await consultarTurnos.ejecutar({ actividadId: 'tirolesa', fecha: '2026-10-21' });

    expect(hoy.turnos[0]).toMatchObject({ estado: 'no_disponible', motivo: 'ya_empezo' });
    expect(manana.turnos[0]).toMatchObject({ estado: 'no_disponible', motivo: 'todavia_no_abre' });
  });
});
