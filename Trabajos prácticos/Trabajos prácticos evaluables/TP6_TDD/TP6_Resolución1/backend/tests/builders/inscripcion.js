import { unParticipante } from './participante.js';

/**
 * Builder de la solicitud de inscripción. Por defecto: `ana@mail.com`, términos aceptados y un
 * participante válido para Tirolesa.
 */
export function unaInscripcion() {
  const solicitud = {
    turnoId: 't-tirolesa-2026-10-20-10',
    email: 'ana@mail.com',
    aceptaTerminos: true,
    participantes: [unParticipante()],
  };

  const builder = {
    alTurno(turnoId) {
      solicitud.turnoId = turnoId;
      return builder;
    },
    conEmail(email) {
      solicitud.email = email;
      return builder;
    },
    sinTerminos() {
      solicitud.aceptaTerminos = false;
      return builder;
    },
    conParticipantes(cantidad, cambios = {}) {
      solicitud.participantes = Array.from({ length: cantidad }, (_, i) =>
        unParticipante({ dni: String(40000000 + i), ...cambios }),
      );
      return builder;
    },
    con(...participantes) {
      solicitud.participantes = participantes;
      return builder;
    },
    build() {
      return structuredClone(solicitud);
    },
  };
  return builder;
}
