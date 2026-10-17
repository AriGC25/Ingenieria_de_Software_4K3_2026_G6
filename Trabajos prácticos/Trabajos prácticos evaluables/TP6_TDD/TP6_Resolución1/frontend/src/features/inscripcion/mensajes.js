/** Mensajes del catálogo (diseño: contenido y mensajes), iguales a los del backend. */
export const MENSAJES = Object.freeze({
  nombre: 'Ingresá un nombre válido (hasta 100 letras).',
  dni: 'Ingresá un DNI válido (7 u 8 números, sin puntos).',
  dniRepetido: 'Este DNI ya está en la inscripción.',
  edad: 'Ingresá una edad entre 0 y 100.',
  edadMinima: (edadMinima) => `Esta actividad es para personas de ${edadMinima} años o más.`,
  talleRequerido: 'Ingresá el talle.',
  talle: 'Elegí un talle de la lista.',
  sinPersonas: 'Agregá al menos una persona.',
  maximoPersonas: (cupos) => `Podés inscribir hasta ${cupos} personas en este horario.`,
  terminos: 'Para continuar, aceptá los términos y condiciones.',
});
