/** Datos de prueba con el reloj de referencia: martes 20/10/2026 09:00. */
export const ACTIVIDADES = [
  {
    id: 'tirolesa',
    nombre: 'Tirolesa',
    requiereTalle: true,
    edadMinima: 8,
    cupoPorTurno: 10,
    disponible: true,
    terminos: 'Términos y condiciones de la Tirolesa. Edad mínima 8 años.',
  },
  {
    id: 'safari',
    nombre: 'Safari',
    requiereTalle: false,
    edadMinima: null,
    cupoPorTurno: 8,
    disponible: true,
    terminos: 'Términos y condiciones del Safari.',
  },
  {
    id: 'palestra',
    nombre: 'Palestra',
    requiereTalle: true,
    edadMinima: 12,
    cupoPorTurno: 12,
    disponible: false,
    terminos: 'Términos y condiciones de la Palestra.',
  },
  {
    id: 'jardineria',
    nombre: 'Jardinería',
    requiereTalle: false,
    edadMinima: null,
    cupoPorTurno: 12,
    disponible: true,
    terminos: 'Términos y condiciones de Jardinería.',
  },
];

export const FECHAS = [
  { fecha: '2026-10-20', abierta: true },
  { fecha: '2026-10-21', abierta: true },
];

export const TURNOS = {
  fecha: '2026-10-20',
  abierta: true,
  turnos: [
    {
      id: 't-x-2026-10-20-09',
      hora: '09:00',
      cuposDisponibles: 10,
      estado: 'no_disponible',
      motivo: 'ya_empezo',
    },
    { id: 't-x-2026-10-20-10', hora: '10:00', cuposDisponibles: 3, estado: 'disponible' },
    { id: 't-x-2026-10-20-11', hora: '11:00', cuposDisponibles: 0, estado: 'agotado' },
  ],
};
