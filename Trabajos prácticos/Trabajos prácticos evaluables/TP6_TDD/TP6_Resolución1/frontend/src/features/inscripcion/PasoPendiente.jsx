import { Navigate } from 'react-router';
import { useInscripcion } from './InscripcionContexto.jsx';

const PASOS = [
  { ruta: '/inscripcion/actividad', listo: (i) => Boolean(i.actividad) },
  { ruta: '/inscripcion/horario', listo: (i) => Boolean(i.turno) },
  { ruta: '/inscripcion/participantes', listo: (i) => i.participantesListos },
];

/**
 * Muestra el paso solo si los anteriores están completos; si no, lleva al primero pendiente.
 * @param {{ paso: 1 | 2 | 3 | 4, children: import('react').ReactNode }} props
 */
export function PasoPendiente({ paso, children }) {
  const inscripcion = useInscripcion();
  const pendiente = PASOS.slice(0, paso - 1).find((p) => !p.listo(inscripcion));
  return pendiente ? <Navigate to={pendiente.ruta} replace /> : children;
}
