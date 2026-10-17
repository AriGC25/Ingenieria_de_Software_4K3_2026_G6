import { describe, it, expect, vi, afterEach } from 'vitest';
import { crearReloj } from '../../../src/infraestructura/reloj.js';

describe('reloj', () => {
  afterEach(() => vi.useRealTimers());

  it('REL-01: con RELOJ_FIJO devuelve siempre esa fecha', () => {
    const fija = new Date('2026-10-20T10:00:00-03:00');
    const reloj = crearReloj(fija);

    expect(reloj.ahora()).toEqual(fija);
    expect(reloj.ahora()).toEqual(fija);
  });

  it('REL-01: devuelve una copia, para que nadie altere la fecha fija', () => {
    const reloj = crearReloj(new Date('2026-10-20T10:00:00-03:00'));

    reloj.ahora().setFullYear(2000);

    expect(reloj.ahora().getFullYear()).toBe(2026);
  });

  it('REL-02: sin RELOJ_FIJO usa el reloj del sistema', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2030-01-02T03:04:05Z'));

    expect(crearReloj(null).ahora()).toEqual(new Date('2030-01-02T03:04:05Z'));
  });
});
