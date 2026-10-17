import { useId } from 'react';
import { formatearFecha } from '../utils/formato.js';
import styles from './ResumenInscripcion.module.css';

/**
 * Resumen de la inscripción: antes de confirmar y en el resultado.
 * @param {{ actividad: string, fecha: string, hora: string, email: string,
 *   requiereTalle?: boolean, participantes: { nombre: string, dni: string, edad: number,
 *   talle?: string | null }[], titulo?: string }} props
 */
export function ResumenInscripcion({
  actividad,
  fecha,
  hora,
  email,
  requiereTalle = false,
  participantes,
  titulo = 'Resumen de la inscripción',
}) {
  const idTitulo = useId();
  return (
    <section className={styles.resumen} aria-labelledby={idTitulo}>
      <h2 id={idTitulo} className={styles.titulo}>
        {titulo}
      </h2>
      <dl className={styles.datos}>
        <dt>Actividad</dt>
        <dd>{actividad}</dd>
        <dt>Fecha</dt>
        <dd>{formatearFecha(fecha)}</dd>
        <dt>Hora</dt>
        <dd>{hora}</dd>
        <dt>Confirmación a</dt>
        <dd>{email}</dd>
      </dl>
      <h3 className={styles.subtitulo}>Participantes ({participantes.length})</h3>
      <ul className={styles.participantes}>
        {participantes.map((p) => (
          <li key={p.dni}>
            <strong>{p.nombre}</strong>
            <span className={styles.detalle}>
              {[`DNI ${p.dni}`, `${p.edad} años`, requiereTalle && `Talle ${p.talle}`]
                .filter(Boolean)
                .join(' · ')}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
