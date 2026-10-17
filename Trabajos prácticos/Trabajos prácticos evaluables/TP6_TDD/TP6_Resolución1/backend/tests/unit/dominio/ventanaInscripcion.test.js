import { describe, it, expect } from 'vitest';
import { evaluarVentana, dentroDeLaVentana } from '../../../src/dominio/ventanaInscripcion.js';

const art = (texto) => new Date(`${texto}-03:00`);
const inicioMiercoles = art('2026-10-21T09:00:00');

describe('ventanaInscripcion', () => {
  it('VEN-01: exactamente 24 h antes del inicio está dentro', () => {
    expect(dentroDeLaVentana(inicioMiercoles, art('2026-10-20T09:00:00'))).toBe(true);
  });

  it('VEN-02: 24 h y 1 s antes está fuera, porque todavía no abre', () => {
    expect(evaluarVentana(inicioMiercoles, art('2026-10-20T08:59:59'))).toEqual({
      dentro: false,
      motivo: 'todavia_no_abre',
    });
  });

  it('VEN-03: exactamente 15 min antes está dentro', () => {
    expect(evaluarVentana(inicioMiercoles, art('2026-10-21T08:45:00'))).toEqual({ dentro: true });
  });

  it('VEN-04: 14 min 59 s antes está fuera, porque la inscripción cerró', () => {
    expect(evaluarVentana(inicioMiercoles, art('2026-10-21T08:45:01'))).toEqual({
      dentro: false,
      motivo: 'inscripcion_cerrada',
    });
  });

  it.each([['2026-10-21T09:00:00'], ['2026-10-21T09:30:00'], ['2026-10-22T10:00:00']])(
    'VEN-05: con el turno iniciado o pasado (%s) está fuera, porque ya empezó',
    (ahora) => {
      expect(evaluarVentana(inicioMiercoles, art(ahora))).toEqual({
        dentro: false,
        motivo: 'ya_empezo',
      });
    },
  );

  it('VEN-06: un turno del día siguiente a menos de 24 h está dentro (ventana móvil)', () => {
    expect(dentroDeLaVentana(art('2026-10-21T08:00:00'), art('2026-10-20T09:00:00'))).toBe(true);
  });

  it.each([
    ['2026-10-20T09:00:01', true],
    ['2026-10-21T08:44:59', true],
  ])('valores límite: con ahora = %s está dentro = %s', (ahora, dentro) => {
    expect(dentroDeLaVentana(inicioMiercoles, art(ahora))).toBe(dentro);
  });
});
