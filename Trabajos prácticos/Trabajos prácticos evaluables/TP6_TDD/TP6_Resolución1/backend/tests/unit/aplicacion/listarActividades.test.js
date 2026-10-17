import { describe, it, expect, beforeEach } from 'vitest';
import { ListarActividades } from '../../../src/aplicacion/listarActividades.js';
import { crearCalendarioParque } from '../../../src/dominio/calendarioParque.js';
import { unTurno } from '../../builders/turno.js';
import { relojFijo } from '../../dobles/reloj.js';
import { repositoriosEnMemoria } from '../../dobles/repositorios.js';

describe('ListarActividades', () => {
  let repos;
  let listar;

  beforeEach(() => {
    repos = repositoriosEnMemoria();
    listar = () =>
      new ListarActividades({
        repositorioActividades: repos.repositorioActividades,
        repositorioTurnos: repos.repositorioTurnos,
        reloj: relojFijo(),
        calendario: crearCalendarioParque(),
      }).ejecutar();
  });

  it('APP-20: lista las cuatro actividades con talle, edad mínima, cupo y términos', async () => {
    const actividades = await listar();

    expect(actividades.map((a) => a.id)).toEqual(['tirolesa', 'safari', 'palestra', 'jardineria']);
    expect(actividades[0]).toEqual({
      id: 'tirolesa',
      nombre: 'Tirolesa',
      requiereTalle: true,
      edadMinima: 8,
      cupoPorTurno: 10,
      terminos: 'Términos de Tirolesa.',
      disponible: false,
    });
    expect(actividades[1].edadMinima).toBeNull();
  });

  it('APP-21: indica disponible: true si tiene algún turno disponible ahora', async () => {
    repos.repositorioTurnos.agregar(unTurno().de('safari').aLas('15').build());

    const actividades = await listar();

    expect(actividades.find((a) => a.id === 'safari').disponible).toBe(true);
    expect(actividades.find((a) => a.id === 'tirolesa').disponible).toBe(false);
  });

  it('APP-22: indica disponible: false si sus turnos están agotados o fuera de la ventana', async () => {
    repos.repositorioTurnos
      .agregar(unTurno().aLas('10').conOcupados(10).build())
      .agregar(unTurno().aLas('09').build())
      .agregar(unTurno().el('2026-10-21', '10').build());

    const actividades = await listar();

    expect(actividades.find((a) => a.id === 'tirolesa').disponible).toBe(false);
  });
});
