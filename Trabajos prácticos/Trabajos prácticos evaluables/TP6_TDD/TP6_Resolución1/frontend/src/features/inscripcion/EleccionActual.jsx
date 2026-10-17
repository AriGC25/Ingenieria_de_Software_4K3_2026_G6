import { formatearFecha } from '../../utils/formato.js';
import { useInscripcion } from './InscripcionContexto.jsx';
import styles from './Pasos.module.css';

/** La actividad y el turno elegidos, visibles en los pasos siguientes. */
export function EleccionActual() {
  const { actividad, fecha, turno } = useInscripcion();
  if (!actividad) return null;
  return (
    <p className={styles.eleccion} data-eleccion>
      {actividad.nombre}
      {turno && ` · ${formatearFecha(fecha)} ${turno.hora}`}
    </p>
  );
}
