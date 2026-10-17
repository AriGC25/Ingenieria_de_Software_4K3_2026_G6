import { describe, it, expect } from 'vitest';
import { Actividad } from '../../../src/dominio/actividad.js';
import { datosDeActividad } from '../../builders/actividad.js';
import { unParticipante } from '../../builders/participante.js';

const actividad = (id) => new Actividad(datosDeActividad(id));

function errorAlPreparar(act, datos, opciones) {
  try {
    act.prepararParticipante(datos, opciones);
  } catch (error) {
    return error;
  }
  throw new Error('Se esperaba un error');
}

describe('Actividad', () => {
  it('ACT-01: si requiere talle, rechaza un participante sin talle', () => {
    const error = errorAlPreparar(actividad('tirolesa'), unParticipante({ talle: undefined }));

    expect(error.codigo).toBe('TALLE_REQUERIDO');
    expect(error.campo).toBe('participantes[0].talle');
    expect(error.mensaje).toBe('Ingresá el talle.');
  });

  it('ACT-02: si no requiere talle, acepta un participante sin talle', () => {
    const participante = actividad('safari').prepararParticipante(
      unParticipante({ talle: undefined }),
    );

    expect(participante.talle).toBeNull();
  });

  it('ACT-03: si no requiere talle, descarta el talle enviado (aunque no sea válido)', () => {
    expect(
      actividad('safari').prepararParticipante(unParticipante({ talle: 'M' })).talle,
    ).toBeNull();
    expect(
      actividad('safari').prepararParticipante(unParticipante({ talle: 'Z' })).talle,
    ).toBeNull();
  });

  it.each([
    ['tirolesa', 7, 8],
    ['palestra', 11, 12],
    ['tirolesa', 0, 8],
  ])('ACT-04: en %s, %i años es menos que la edad mínima', (id, edad, minima) => {
    const error = errorAlPreparar(actividad(id), unParticipante({ edad }), { indice: 1 });

    expect(error.codigo).toBe('EDAD_NO_PERMITIDA');
    expect(error.campo).toBe('participantes[1].edad');
    expect(error.mensaje).toBe(`Esta actividad es para personas de ${minima} años o más.`);
  });

  it.each([
    ['tirolesa', 8],
    ['palestra', 12],
  ])('ACT-05: en %s, la edad mínima exacta (%i) es aceptada', (id, edad) => {
    expect(actividad(id).prepararParticipante(unParticipante({ edad })).edad).toBe(edad);
  });

  it.each([['safari'], ['jardineria']])(
    'ACT-06: %s acepta cualquier edad válida (0 años)',
    (id) => {
      expect(actividad(id).prepararParticipante(unParticipante({ edad: 0 })).edad).toBe(0);
    },
  );

  it.each([['tirolesa'], ['safari'], ['palestra'], ['jardineria']])(
    'ACT-07: en %s, 100 años es válido y 101 es un dato inválido',
    (id) => {
      expect(actividad(id).prepararParticipante(unParticipante({ edad: 100 })).edad).toBe(100);
      expect(errorAlPreparar(actividad(id), unParticipante({ edad: 101 })).codigo).toBe(
        'DATOS_PARTICIPANTE_INVALIDOS',
      );
    },
  );

  it('rechaza un DNI que ya está en la inscripción, antes de validar la edad', () => {
    const error = errorAlPreparar(actividad('tirolesa'), unParticipante({ edad: 3 }), {
      indice: 1,
      dnisPrevios: ['40123456'],
    });

    expect(error.codigo).toBe('DNI_REPETIDO');
    expect(error.campo).toBe('participantes[1].dni');
    expect(error.mensaje).toBe('Este DNI ya está en la inscripción.');
  });

  it('valida en orden: nombre, DNI, DNI repetido, edad, edad mínima y talle', () => {
    const act = actividad('tirolesa');
    const todoMal = { nombre: '', dni: '1', edad: -1, talle: undefined };

    expect(errorAlPreparar(act, todoMal).campo).toBe('participantes[0].nombre');
    expect(errorAlPreparar(act, { ...todoMal, nombre: 'Ana' }).campo).toBe('participantes[0].dni');
    expect(errorAlPreparar(act, { ...todoMal, nombre: 'Ana', dni: '40123456' }).codigo).toBe(
      'DATOS_PARTICIPANTE_INVALIDOS',
    );
    expect(errorAlPreparar(act, unParticipante({ edad: 5, talle: undefined })).codigo).toBe(
      'EDAD_NO_PERMITIDA',
    );
  });

  it('expone sus datos', () => {
    const act = actividad('palestra');

    expect(act).toMatchObject({ id: 'palestra', nombre: 'Palestra', requiereTalle: true });
    expect(act.edadMinima).toBe(12);
    expect(act.cupoPorTurno).toBe(12);
    expect(act.terminos).toBe('Términos de Palestra.');
  });
});
