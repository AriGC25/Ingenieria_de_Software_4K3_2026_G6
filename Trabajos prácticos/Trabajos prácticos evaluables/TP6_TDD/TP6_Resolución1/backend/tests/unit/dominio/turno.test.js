import { describe, it, expect } from 'vitest';
import { crearCalendarioParque } from '../../../src/dominio/calendarioParque.js';
import { ErrorDominio } from '../../../src/dominio/errores.js';
import { AHORA, unTurno } from '../../builders/turno.js';

const calendario = crearCalendarioParque();

describe('Turno', () => {
  it('TUR-01: los cupos disponibles son el máximo menos los ocupados', () => {
    expect(unTurno().conOcupados(3).build().cuposDisponibles()).toBe(7);
  });

  it('TUR-02: reservar descuenta los cupos', () => {
    const turno = unTurno().conOcupados(2).build();

    turno.reservar(3);

    expect(turno.cupoOcupado).toBe(5);
    expect(turno.cuposDisponibles()).toBe(5);
  });

  it('TUR-03: reservar exactamente los cupos restantes deja 0 disponibles', () => {
    const turno = unTurno().conOcupados(7).build();

    turno.reservar(3);

    expect(turno.cuposDisponibles()).toBe(0);
  });

  it.each([
    [7, 4],
    [9, 2],
    [10, 1],
    [0, 11],
  ])(
    'TUR-04: con %i ocupados, reservar %i lanza SIN_CUPO y no modifica el turno',
    (ocupados, n) => {
      const turno = unTurno().conOcupados(ocupados).build();

      expect(() => turno.reservar(n)).toThrow(ErrorDominio);
      expect(() => turno.reservar(n)).toThrow(expect.objectContaining({ codigo: 'SIN_CUPO' }));
      expect(turno.cupoOcupado).toBe(ocupados);
    },
  );

  it('TUR-05: el turno que ya empezó está no_disponible por ya_empezo', () => {
    expect(unTurno().aLas('09').build().estado(AHORA, calendario)).toEqual({
      estado: 'no_disponible',
      motivo: 'ya_empezo',
    });
  });

  it('TUR-05: el turno a más de 24 h está no_disponible por todavia_no_abre', () => {
    expect(unTurno().el('2026-10-21', '10').build().estado(AHORA, calendario)).toEqual({
      estado: 'no_disponible',
      motivo: 'todavia_no_abre',
    });
  });

  it('TUR-05: a menos de 15 minutos del inicio está no_disponible por inscripcion_cerrada', () => {
    const ahora = new Date('2026-10-20T09:50:00-03:00');

    expect(unTurno().build().estado(ahora, calendario)).toEqual({
      estado: 'no_disponible',
      motivo: 'inscripcion_cerrada',
    });
  });

  it('TUR-06: sin cupos está agotado', () => {
    expect(unTurno().conOcupados(10).build().estado(AHORA, calendario)).toEqual({
      estado: 'agotado',
    });
  });

  it('TUR-07: dentro de la ventana y con cupo está disponible', () => {
    expect(unTurno().build().estado(AHORA, calendario)).toEqual({ estado: 'disponible' });
  });

  it('TUR-08: fuera de la ventana y agotado, el estado es no_disponible', () => {
    const turno = unTurno().aLas('09').conOcupados(10).build();

    expect(turno.estado(AHORA, calendario).estado).toBe('no_disponible');
  });

  it('un turno en un día cerrado del parque está no_disponible por parque_cerrado', () => {
    const turno = unTurno().el('2026-12-25', '10').build();
    const ahora = new Date('2026-12-24T12:00:00-03:00');

    expect(turno.estado(ahora, calendario)).toEqual({
      estado: 'no_disponible',
      motivo: 'parque_cerrado',
    });
  });

  it('expone la fecha y la hora del turno en hora argentina', () => {
    const turno = unTurno().aLas('17').build();

    expect(turno.fecha).toBe('2026-10-20');
    expect(turno.hora).toBe('17:00');
  });
});
