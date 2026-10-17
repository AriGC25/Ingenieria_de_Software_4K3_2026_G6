import { z } from 'zod';
import { EMAIL_MAX_CARACTERES, MAX_PARTICIPANTES_POR_SOLICITUD } from '../../dominio/constantes.js';
import { esFechaValida } from '../../dominio/fechas.js';

/** Forma de la consulta de turnos: `?fecha=YYYY-MM-DD`. */
export const esquemaConsultaTurnos = z.object({
  fecha: z.string().refine(esFechaValida),
});

/**
 * Forma de la solicitud de inscripción. Solo valida tipos y el tope técnico de participantes; las
 * reglas de negocio (lista vacía, términos en `false`, formatos de los datos) son del dominio.
 */
export const esquemaSolicitudInscripcion = z.object({
  turnoId: z.string().min(1),
  email: z.string().email().max(EMAIL_MAX_CARACTERES),
  aceptaTerminos: z.boolean(),
  participantes: z
    .array(
      z.object({
        nombre: z.string(),
        dni: z.string(),
        edad: z.number(),
        talle: z.string().optional().nullable(),
      }),
    )
    .max(MAX_PARTICIPANTES_POR_SOLICITUD),
});
