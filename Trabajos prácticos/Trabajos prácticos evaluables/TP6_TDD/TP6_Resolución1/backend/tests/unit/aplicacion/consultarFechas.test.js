import { describe, it, expect } from 'vitest';
import { ConsultarFechas } from '../../../src/aplicacion/consultarFechas.js';
import { crearCalendarioParque } from '../../../src/dominio/calendarioParque.js';
import { relojFijo } from '../../dobles/reloj.js';

const consultar = (instante) =>
  new ConsultarFechas({
    reloj: relojFijo(instante),
    calendario: crearCalendarioParque(),
  }).ejecutar();

describe('ConsultarFechas', () => {
  it('APP-30: devuelve hoy y mañana según el reloj inyectado', async () => {
    expect(await consultar()).toEqual([
      { fecha: '2026-10-20', abierta: true },
      { fecha: '2026-10-21', abierta: true },
    ]);
  });

  it('APP-30: calcula hoy en hora argentina aunque en UTC ya sea el día siguiente', async () => {
    const fechas = await consultar(new Date('2026-10-20T23:30:00-03:00'));

    expect(fechas.map((f) => f.fecha)).toEqual(['2026-10-20', '2026-10-21']);
  });

  it('APP-31: marca los días cerrados con su motivo', async () => {
    const fechas = await consultar(new Date('2026-12-24T10:00:00-03:00'));

    expect(fechas).toEqual([
      { fecha: '2026-12-24', abierta: true },
      { fecha: '2026-12-25', abierta: false, motivo: 'feriado' },
    ]);
  });

  it('APP-32: con el reloj en un domingo, el lunes siguiente aparece cerrado', async () => {
    const fechas = await consultar(new Date('2026-10-25T10:00:00-03:00'));

    expect(fechas[1]).toEqual({ fecha: '2026-10-26', abierta: false, motivo: 'lunes' });
  });
});
