import { listarActividades } from '../../api/cliente.js';
import { ActividadCard } from '../../components/ActividadCard.jsx';
import { Stepper } from '../../components/Stepper.jsx';
import { useCarga } from '../../hooks/useCarga.js';
import { AccionesDelPaso } from './AccionesDelPaso.jsx';
import { AvisoEnfocado } from './AvisoEnfocado.jsx';
import { useInscripcion } from './InscripcionContexto.jsx';
import styles from './Pasos.module.css';
import { usePasoSiguiente } from './usePasoSiguiente.js';

/** PT-02: elección de la actividad. */
export function PaginaActividad() {
  const { actividad, elegirActividad } = useInscripcion();
  const { datos: actividades, cargando, error } = useCarga(listarActividades, []);
  const { continuar, intentosFallidos } = usePasoSiguiente(
    Boolean(actividad),
    '/inscripcion/horario',
  );

  return (
    <div className={styles.paso}>
      <Stepper pasoActual={1} />
      <h1>Elegí la actividad</h1>
      {cargando && <p className={styles.cargando}>Cargando actividades...</p>}
      {error && <AvisoEnfocado>{error.mensaje}</AvisoEnfocado>}
      {actividades && (
        <div className={styles.grilla}>
          {actividades.map((a) => (
            <ActividadCard
              key={a.id}
              actividad={a}
              seleccionada={a.id === actividad?.id}
              onSeleccionar={elegirActividad}
            />
          ))}
        </div>
      )}
      {intentosFallidos > 0 && !actividad && (
        <AvisoEnfocado clave={intentosFallidos}>Elegí una actividad para continuar.</AvisoEnfocado>
      )}
      <AccionesDelPaso onContinuar={continuar} />
    </div>
  );
}
