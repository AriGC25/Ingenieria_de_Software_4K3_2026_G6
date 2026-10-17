import { describe, it, expect } from 'vitest';
import { crearCalendarioParque } from '../../../src/dominio/calendarioParque.js';

describe('calendarioParque', () => {
  const calendario = crearCalendarioParque();

  it('CAL-01: un martes no feriado está abierto', () => {
    expect(calendario.estaAbierto('2026-10-20')).toBe(true);
  });

  it('CAL-02: un lunes está cerrado, con el motivo lunes', () => {
    expect(calendario.estaAbierto('2026-10-19')).toBe(false);
    expect(calendario.motivoCierre('2026-10-19')).toBe('lunes');
  });

  it('CAL-03: el 25 de diciembre está cerrado aunque no sea lunes', () => {
    expect(calendario.estaAbierto('2026-12-25')).toBe(false);
    expect(calendario.motivoCierre('2026-12-25')).toBe('feriado');
  });

  it('CAL-04: el 1 de enero está cerrado', () => {
    expect(calendario.estaAbierto('2027-01-01')).toBe(false);
  });

  it('CAL-05: los feriados se repiten todos los años', () => {
    expect(calendario.estaAbierto('2026-12-25')).toBe(false);
    expect(calendario.estaAbierto('2027-12-25')).toBe(false);
  });

  it('CAL-06: respeta otra configuración de días cerrados', () => {
    const cerradoDomingos = crearCalendarioParque({ diasCerrados: [0], feriadosCerrados: [] });

    expect(cerradoDomingos.estaAbierto('2026-10-25')).toBe(false);
    expect(cerradoDomingos.motivoCierre('2026-10-25')).toBe('domingo');
    expect(cerradoDomingos.estaAbierto('2026-10-19')).toBe(true);
  });

  it('CAL-07: evalúa en hora argentina (domingo 23:30 ART es lunes en UTC)', () => {
    const domingoNocheArgentina = new Date('2026-10-25T23:30:00-03:00');

    expect(calendario.estaAbierto(domingoNocheArgentina)).toBe(true);
  });

  it('CAL-08: un lunes que además es feriado está cerrado', () => {
    expect(calendario.estaAbierto('2028-12-25')).toBe(false);
    expect(calendario.motivoCierre('2028-12-25')).toBe('feriado');
  });

  it.each([
    ['2026-10-19', false],
    ['2026-10-20', true],
    ['2026-12-24', true],
    ['2026-12-25', false],
    ['2026-12-26', true],
    ['2026-12-31', true],
    ['2027-01-01', false],
    ['2027-01-02', true],
  ])('días vecinos a los cierres: %s abierto = %s', (fecha, abierto) => {
    expect(calendario.estaAbierto(fecha)).toBe(abierto);
  });

  it('un día abierto no tiene motivo de cierre', () => {
    expect(calendario.motivoCierre('2026-10-20')).toBeNull();
  });
});
