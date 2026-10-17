/** Detalle de una inscripción confirmada, como lo recibe el notificador. */
export function unDetalleDeInscripcion(cambios = {}) {
  return {
    codigo: 'ECOPARK-7K3M9Q',
    actividad: 'Tirolesa',
    requiereTalle: true,
    inicio: new Date('2026-10-20T10:00:00-03:00'),
    fecha: '2026-10-20',
    hora: '10:00',
    email: 'ana@mail.com',
    participantes: [
      { nombre: 'Ana Pérez', dni: '40123456', edad: 25, talle: 'M' },
      { nombre: 'Juan Pérez', dni: '42123456', edad: 22, talle: 'L' },
    ],
    ...cambios,
  };
}
