import { readFileSync } from 'node:fs';
import { TZDate } from '@date-fns/tz';
import { format } from 'date-fns';
import { ZONA_HORARIA } from '../../dominio/constantes.js';
import { escaparHtml, renderizar } from './renderizador.js';

const PLANTILLA = readFileSync(
  new URL('./templates/confirmacion-inscripcion.html', import.meta.url),
  'utf8',
);

/**
 * Arma las filas HTML del listado de participantes. El talle solo aparece si la actividad lo pide.
 * @param {{ nombre: string, dni: string, edad: number, talle: string | null }[]} participantes
 * @param {boolean} requiereTalle
 * @returns {string}
 */
export function filasParticipantes(participantes, requiereTalle) {
  return participantes
    .map((p) => {
      const datos = [`DNI ${p.dni}`, `${p.edad} años`];
      if (requiereTalle) datos.push(`Talle ${p.talle}`);
      return (
        '<tr><td style="padding:8px 0;border-bottom:1px solid #D9CDA9;">' +
        `<strong>${escaparHtml(p.nombre)}</strong><br>` +
        `<span style="color:#4A5A48;font-size:14px;">${escaparHtml(datos.join(' · '))}</span>` +
        '</td></tr>'
      );
    })
    .join('');
}

/**
 * @param {import('../../aplicacion/puertos.js').DetalleInscripcion} inscripcion
 * @param {string} appUrl
 * @returns {{ asunto: string, html: string }}
 */
export function armarMailConfirmacion(inscripcion, appUrl) {
  const local = new TZDate(inscripcion.inicio, ZONA_HORARIA);
  const fecha = format(local, 'dd/MM/yyyy');
  const hora = format(local, 'HH:mm');
  const html = renderizar(
    PLANTILLA,
    {
      actividad: inscripcion.actividad,
      fecha,
      hora,
      cantidadParticipantes: inscripcion.participantes.length,
      participantes: filasParticipantes(inscripcion.participantes, inscripcion.requiereTalle),
      codigoInscripcion: inscripcion.codigo,
      emailUsuario: inscripcion.email,
      urlValidacion: `${appUrl}/validar-inscripcion`,
    },
    { html: ['participantes'] },
  );
  return {
    asunto: `Confirmación de inscripción: ${inscripcion.actividad}, ${fecha} ${hora}`,
    html,
  };
}
