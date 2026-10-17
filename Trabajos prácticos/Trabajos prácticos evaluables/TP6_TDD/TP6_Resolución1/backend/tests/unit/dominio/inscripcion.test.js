import { describe, it, expect } from 'vitest';
import { crearCalendarioParque } from '../../../src/dominio/calendarioParque.js';
import { crearInscripcion } from '../../../src/dominio/inscripcion.js';
import { unaInscripcion } from '../../builders/inscripcion.js';
import { unParticipante } from '../../builders/participante.js';
import { AHORA, unTurno } from '../../builders/turno.js';

const calendario = crearCalendarioParque();

function inscribir(
  solicitud,
  { turno = unTurno().build(), dnisYaInscriptos = [], ahora = AHORA } = {},
) {
  return crearInscripcion({ ...solicitud, turno, ahora, calendario, dnisYaInscriptos });
}

function errorAlInscribir(solicitud, opciones) {
  try {
    inscribir(solicitud, opciones);
  } catch (error) {
    return error;
  }
  throw new Error('Se esperaba un error al inscribir');
}

describe('crearInscripcion', () => {
  it('INS-01: una inscripción válida reserva los cupos y guarda email, participantes y términos', () => {
    const turno = unTurno().conOcupados(2).build();

    const inscripcion = inscribir(unaInscripcion().conParticipantes(3).build(), { turno });

    expect(turno.cuposDisponibles()).toBe(5);
    expect(inscripcion.turno).toBe(turno);
    expect(inscripcion.email).toBe('ana@mail.com');
    expect(inscripcion.participantes).toHaveLength(3);
    expect(inscripcion.participantes[0]).toEqual({
      nombre: 'Ana Pérez',
      dni: '40000000',
      edad: 25,
      talle: 'M',
    });
  });

  it('INS-02: sin aceptar los términos lanza TERMINOS_NO_ACEPTADOS', () => {
    const error = errorAlInscribir(unaInscripcion().sinTerminos().build());

    expect(error.codigo).toBe('TERMINOS_NO_ACEPTADOS');
    expect(error.mensaje).toBe('Para continuar, aceptá los términos y condiciones.');
  });

  it('INS-03: sin participantes lanza DATOS_PARTICIPANTE_INVALIDOS en el campo participantes', () => {
    const error = errorAlInscribir(unaInscripcion().con().build());

    expect(error.codigo).toBe('DATOS_PARTICIPANTE_INVALIDOS');
    expect(error.campo).toBe('participantes');
    expect(error.mensaje).toBe('Agregá al menos una persona.');
  });

  it.each([['no-es-un-email'], [`${'a'.repeat(245)}@mail.com`], ['']])(
    'INS-04: el email "%s" lanza un error de dominio',
    (email) => {
      const error = errorAlInscribir(unaInscripcion().conEmail(email).build());

      expect(error.codigo).toBe('SOLICITUD_INVALIDA');
      expect(error.campo).toBe('email');
    },
  );

  it('INS-05: un DNI repetido en la inscripción lanza DNI_REPETIDO en el segundo participante', () => {
    const solicitud = unaInscripcion()
      .con(unParticipante(), unParticipante({ nombre: 'Juan Pérez' }))
      .build();

    const error = errorAlInscribir(solicitud);

    expect(error.codigo).toBe('DNI_REPETIDO');
    expect(error.campo).toBe('participantes[1].dni');
  });

  it('INS-06: un DNI ya inscripto en otro turno con el mismo inicio lanza INSCRIPCION_SUPERPUESTA', () => {
    const error = errorAlInscribir(unaInscripcion().build(), { dnisYaInscriptos: ['40123456'] });

    expect(error.codigo).toBe('INSCRIPCION_SUPERPUESTA');
    expect(error.mensaje).toBe(
      'Una de las personas ya está inscripta en este horario. Elegí otro.',
    );
  });

  it('INS-07: un DNI inscripto en otro horario no impide la inscripción', () => {
    expect(() =>
      inscribir(unaInscripcion().build(), { dnisYaInscriptos: ['39999999'] }),
    ).not.toThrow();
  });

  it('INS-08: un grupo más grande que los cupos se rechaza completo', () => {
    const turno = unTurno().conOcupados(7).build();

    const error = errorAlInscribir(unaInscripcion().conParticipantes(4).build(), { turno });

    expect(error.codigo).toBe('SIN_CUPO');
    expect(turno.cupoOcupado).toBe(7);
  });

  it.each([
    ['un día cerrado', unTurno().el('2026-12-25', '10'), new Date('2026-12-24T12:00:00-03:00')],
    ['un turno que ya empezó', unTurno().aLas('09'), AHORA],
    ['un turno que todavía no abre', unTurno().el('2026-10-21', '10'), AHORA],
  ])('INS-09: %s lanza HORARIO_NO_DISPONIBLE', (_caso, turno, ahora) => {
    const error = errorAlInscribir(unaInscripcion().build(), { turno: turno.build(), ahora });

    expect(error.codigo).toBe('HORARIO_NO_DISPONIBLE');
    expect(error.mensaje).toBe('Este horario no está disponible. Elegí otro.');
  });

  it('INS-10: turno no disponible y datos inválidos: gana HORARIO_NO_DISPONIBLE', () => {
    const solicitud = unaInscripcion()
      .con(unParticipante({ dni: '1' }))
      .sinTerminos()
      .build();

    const error = errorAlInscribir(solicitud, { turno: unTurno().aLas('09').build() });

    expect(error.codigo).toBe('HORARIO_NO_DISPONIBLE');
  });

  it('INS-11: más personas que cupos y datos inválidos: gana SIN_CUPO', () => {
    const solicitud = unaInscripcion().conParticipantes(11, { nombre: '' }).build();

    expect(errorAlInscribir(solicitud).codigo).toBe('SIN_CUPO');
  });

  it('INS-11: un turno agotado lanza SIN_CUPO', () => {
    const turno = unTurno().conOcupados(10).build();

    expect(errorAlInscribir(unaInscripcion().build(), { turno }).codigo).toBe('SIN_CUPO');
  });

  it('INS-12: con errores en los participantes 1 y 2 se informa el del participante 1', () => {
    const solicitud = unaInscripcion()
      .con(unParticipante({ talle: undefined }), unParticipante({ dni: '2', nombre: '' }))
      .build();

    const error = errorAlInscribir(solicitud);

    expect(error.codigo).toBe('TALLE_REQUERIDO');
    expect(error.campo).toBe('participantes[0].talle');
  });

  it('INS-12: dentro de un participante, el DNI repetido va antes que la edad mínima', () => {
    const solicitud = unaInscripcion()
      .con(unParticipante(), unParticipante({ edad: 5, talle: undefined }))
      .build();

    expect(errorAlInscribir(solicitud).codigo).toBe('DNI_REPETIDO');
  });

  it('INS-13: datos inválidos y términos sin aceptar: gana el error de datos', () => {
    const solicitud = unaInscripcion()
      .con(unParticipante({ edad: 101 }))
      .sinTerminos()
      .build();

    expect(errorAlInscribir(solicitud).codigo).toBe('DATOS_PARTICIPANTE_INVALIDOS');
  });

  it('INS-14: términos sin aceptar y DNI superpuesto: gana TERMINOS_NO_ACEPTADOS', () => {
    const error = errorAlInscribir(unaInscripcion().sinTerminos().build(), {
      dnisYaInscriptos: ['40123456'],
    });

    expect(error.codigo).toBe('TERMINOS_NO_ACEPTADOS');
  });

  it.each([
    [
      unaInscripcion().con(unParticipante(), unParticipante({ dni: '41000000', talle: 'Z' })),
      'participantes[1].talle',
    ],
    [unaInscripcion().sinTerminos(), 'aceptaTerminos'],
  ])('INS-15: el error de un dato indica su campo (%#)', (builder, campo) => {
    expect(errorAlInscribir(builder.build()).campo).toBe(campo);
  });

  it('INS-16: registra la fecha y hora de aceptación de los términos', () => {
    expect(inscribir(unaInscripcion().build()).terminosAceptadosEn).toEqual(AHORA);
  });

  it('en una actividad sin talle, el talle enviado no se guarda', () => {
    const turno = unTurno().de('safari').build();

    const inscripcion = inscribir(unaInscripcion().build(), { turno });

    expect(inscripcion.participantes[0].talle).toBeNull();
  });
});
