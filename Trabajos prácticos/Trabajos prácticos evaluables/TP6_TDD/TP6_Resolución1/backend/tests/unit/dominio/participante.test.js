import { describe, it, expect } from 'vitest';
import { crearParticipante } from '../../../src/dominio/participante.js';
import { ErrorDominio } from '../../../src/dominio/errores.js';
import { unParticipante } from '../../builders/participante.js';

function errorAlCrear(datos, indice) {
  try {
    crearParticipante(datos, indice);
  } catch (error) {
    return error;
  }
  throw new Error('Se esperaba un error al crear el participante');
}

describe('participante', () => {
  it('PAR-01: con datos válidos se crea correctamente', () => {
    const participante = crearParticipante(unParticipante());

    expect(participante).toEqual({ nombre: 'Ana Pérez', dni: '40123456', edad: 25, talle: 'M' });
  });

  it('PAR-02: un DNI de 7 dígitos es válido', () => {
    expect(crearParticipante(unParticipante({ dni: '4012345' })).dni).toBe('4012345');
  });

  it.each([['401234'], ['401234567'], ['4012345A'], ['40.123.456'], ['40 123 456'], ['']])(
    'PAR-03: el DNI "%s" es inválido',
    (dni) => {
      const error = errorAlCrear(unParticipante({ dni }));

      expect(error).toBeInstanceOf(ErrorDominio);
      expect(error.codigo).toBe('DATOS_PARTICIPANTE_INVALIDOS');
      expect(error.campo).toBe('participantes[0].dni');
    },
  );

  it.each([[''], ['   ']])('PAR-04: el nombre "%s" es inválido', (nombre) => {
    const error = errorAlCrear(unParticipante({ nombre }));

    expect(error.codigo).toBe('DATOS_PARTICIPANTE_INVALIDOS');
    expect(error.campo).toBe('participantes[0].nombre');
  });

  it('PAR-05: el nombre se guarda sin espacios en los extremos', () => {
    expect(crearParticipante(unParticipante({ nombre: '  Ana  ' })).nombre).toBe('Ana');
  });

  it.each([[-1], [2.5], [101], ['veinte'], [null]])('PAR-06: la edad %s es inválida', (edad) => {
    const error = errorAlCrear(unParticipante({ edad }));

    expect(error.codigo).toBe('DATOS_PARTICIPANTE_INVALIDOS');
    expect(error.campo).toBe('participantes[0].edad');
  });

  it.each([[0], [100]])('PAR-07: la edad %s es válida', (edad) => {
    expect(crearParticipante(unParticipante({ edad })).edad).toBe(edad);
  });

  it.each([['XXXL'], ['mediano']])('PAR-08: el talle "%s" es inválido', (talle) => {
    const error = errorAlCrear(unParticipante({ talle }));

    expect(error.codigo).toBe('DATOS_PARTICIPANTE_INVALIDOS');
    expect(error.campo).toBe('participantes[0].talle');
  });

  it('PAR-09: el error indica el campo inválido y el mensaje de ese campo', () => {
    const error = errorAlCrear(unParticipante({ dni: '123' }), 2);

    expect(error.campo).toBe('participantes[2].dni');
    expect(error.mensaje).toBe('Ingresá un DNI válido (7 u 8 números, sin puntos).');
  });

  it('PAR-10: con varios datos inválidos informa solo el primero (nombre, DNI, edad, talle)', () => {
    const datos = { nombre: '', dni: 'x', edad: -1, talle: 'Z' };

    expect(errorAlCrear(datos).campo).toBe('participantes[0].nombre');
    expect(errorAlCrear({ ...datos, nombre: 'Ana' }).campo).toBe('participantes[0].dni');
    expect(errorAlCrear({ ...datos, nombre: 'Ana', dni: '40123456' }).campo).toBe(
      'participantes[0].edad',
    );
  });

  it.each([
    ['A', true],
    ['A'.repeat(100), true],
    ['A'.repeat(101), false],
    [`  ${'A'.repeat(100)}  `, true],
  ])('PAR-11: un nombre de largo %# es válido = %s', (nombre, valido) => {
    const crear = () => crearParticipante(unParticipante({ nombre }));

    if (valido) expect(crear).not.toThrow();
    else expect(crear).toThrow(ErrorDominio);
  });

  it.each([
    ['José Ñandú', true],
    ["María O'Connor", true],
    ['Ana-Laura Gómez', true],
    ['Ana 2', false],
    ['Ana <b>', false],
    ['Ana@', false],
  ])('PAR-12: el nombre "%s" es válido = %s', (nombre, valido) => {
    const crear = () => crearParticipante(unParticipante({ nombre }));

    if (valido) expect(crear).not.toThrow();
    else expect(crear).toThrow(ErrorDominio);
  });

  it('PAR-13: un DNI con ceros a la izquierda es válido y se conserva como texto', () => {
    expect(crearParticipante(unParticipante({ dni: '0123456' })).dni).toBe('0123456');
  });

  it('PAR-14: un talle en minúsculas es inválido', () => {
    expect(errorAlCrear(unParticipante({ talle: 'm' })).campo).toBe('participantes[0].talle');
  });

  it.each([['XS'], ['XXL']])(
    'el primer y el último talle de la lista (%s) son válidos',
    (talle) => {
      expect(crearParticipante(unParticipante({ talle })).talle).toBe(talle);
    },
  );

  it('sin talle, el participante queda sin talle', () => {
    expect(crearParticipante(unParticipante({ talle: undefined })).talle).toBeNull();
  });
});
