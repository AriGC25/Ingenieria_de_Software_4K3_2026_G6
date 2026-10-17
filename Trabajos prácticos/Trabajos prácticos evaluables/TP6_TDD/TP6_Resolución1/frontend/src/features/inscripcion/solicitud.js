/**
 * Arma la solicitud de `POST /api/inscripciones` con los datos del formulario. El talle solo se
 * envía si la actividad lo requiere (RN-04).
 * @param {{ cantidad: number, participantes: object[], aceptaTerminos: boolean }} valores
 * @param {{ turno: { id: string }, actividad: { requiereTalle: boolean }, email: string }} eleccion
 */
export function armarSolicitud(valores, { turno, actividad, email }) {
  return {
    turnoId: turno.id,
    email,
    aceptaTerminos: valores.aceptaTerminos === true,
    participantes: valores.participantes.slice(0, valores.cantidad).map((p) => ({
      nombre: p.nombre.trim(),
      dni: p.dni,
      edad: Number(p.edad),
      ...(actividad.requiereTalle && { talle: p.talle }),
    })),
  };
}

/**
 * Traduce el campo de un error de la API al campo del formulario y al paso donde está.
 * `participantes[1].edad` → `participantes.1.edad` (paso de participantes).
 * @param {string} campo
 * @returns {{ campo: string, ruta: string } | null}
 */
export function ubicarCampo(campo) {
  if (campo === 'aceptaTerminos') return { campo, ruta: '/inscripcion/confirmacion' };
  if (campo === 'participantes') return { campo: 'cantidad', ruta: '/inscripcion/participantes' };
  const dato = /^participantes\[(\d+)\]\.(\w+)$/.exec(campo);
  if (dato)
    return { campo: `participantes.${dato[1]}.${dato[2]}`, ruta: '/inscripcion/participantes' };
  return null;
}
