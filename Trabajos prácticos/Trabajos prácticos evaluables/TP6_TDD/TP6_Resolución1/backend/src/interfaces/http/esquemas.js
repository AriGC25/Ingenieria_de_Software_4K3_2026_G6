import { z } from 'zod';
import { esFechaValida } from '../../dominio/fechas.js';

/** Forma de la consulta de turnos: `?fecha=YYYY-MM-DD`. */
export const esquemaConsultaTurnos = z.object({
  fecha: z.string().refine(esFechaValida),
});
