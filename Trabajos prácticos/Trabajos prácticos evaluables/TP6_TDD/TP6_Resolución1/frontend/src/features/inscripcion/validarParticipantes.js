import { MENSAJES } from './mensajes.js';

const NOMBRE = /^[\p{L}\s'’-]+$/u;
const DNI = /^\d{7,8}$/;
const EDAD = /^\d{1,3}$/;
const TALLES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

/**
 * Valida el paso de participantes para la experiencia de uso (la regla la decide el backend).
 * Devuelve todos los errores, en el orden del formulario, con el campo de React Hook Form.
 * @param {{ cantidad: number, participantes: object[] }} valores
 * @param {{ cupos: number, requiereTalle: boolean, edadMinima: number | null }} contexto
 * @returns {{ campo: string, mensaje: string }[]}
 */
export function validarParticipantes({ cantidad, participantes }, contexto) {
  if (!Number.isInteger(cantidad) || cantidad < 1) {
    return [{ campo: 'cantidad', mensaje: MENSAJES.sinPersonas }];
  }
  if (cantidad > contexto.cupos) {
    return [{ campo: 'cantidad', mensaje: MENSAJES.maximoPersonas(contexto.cupos) }];
  }
  const dnis = [];
  return participantes.slice(0, cantidad).flatMap((persona = {}, i) => {
    const errores = erroresDePersona(persona, contexto, dnis);
    dnis.push(persona.dni);
    return errores.map(([dato, mensaje]) => ({ campo: `participantes.${i}.${dato}`, mensaje }));
  });
}

function erroresDePersona({ nombre = '', dni = '', edad = '', talle = '' }, contexto, dnisPrevios) {
  const recortado = nombre.trim();
  return [
    [
      'nombre',
      !recortado || recortado.length > 100 || !NOMBRE.test(recortado) ? MENSAJES.nombre : null,
    ],
    ['dni', errorDeDni(dni, dnisPrevios)],
    ['edad', errorDeEdad(String(edad), contexto.edadMinima)],
    ['talle', contexto.requiereTalle ? errorDeTalle(talle) : null],
  ].filter(([, mensaje]) => mensaje);
}

function errorDeDni(dni, dnisPrevios) {
  if (!DNI.test(dni)) return MENSAJES.dni;
  return dnisPrevios.includes(dni) ? MENSAJES.dniRepetido : null;
}

function errorDeEdad(edad, edadMinima) {
  if (!EDAD.test(edad) || Number(edad) > 100) return MENSAJES.edad;
  return edadMinima !== null && Number(edad) < edadMinima ? MENSAJES.edadMinima(edadMinima) : null;
}

function errorDeTalle(talle) {
  if (!talle) return MENSAJES.talleRequerido;
  return TALLES.includes(talle) ? null : MENSAJES.talle;
}
