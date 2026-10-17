import { useNavigate } from 'react-router';
import { listarFechas, listarTurnos } from '../../api/cliente.js';
import { SelectorFecha } from '../../components/SelectorFecha.jsx';
import { Stepper } from '../../components/Stepper.jsx';
import { TurnoChip } from '../../components/TurnoChip.jsx';
import { useCarga } from '../../hooks/useCarga.js';
import { AccionesDelPaso } from './AccionesDelPaso.jsx';
import { AvisoEnfocado } from './AvisoEnfocado.jsx';
import { EleccionActual } from './EleccionActual.jsx';
import { useInscripcion } from './InscripcionContexto.jsx';
import styles from './Pasos.module.css';
import { usePasoSiguiente } from './usePasoSiguiente.js';

/** PT-03: elección de la fecha y el turno. Las fechas las define el backend (no calcula "hoy"). */
export function PaginaHorario() {
  const { actividad, fecha, turno, elegirFecha, elegirTurno } = useInscripcion();
  const fechas = useCarga(listarFechas, []);
  const turnos = useCarga(fecha ? () => listarTurnos(actividad.id, fecha) : null, [fecha]);
  const { continuar, intentosFallidos } = usePasoSiguiente(
    Boolean(turno),
    '/inscripcion/participantes',
  );
  const navegar = useNavigate();

  const error = fechas.error ?? turnos.error;
  return (
    <div className={styles.paso}>
      <Stepper pasoActual={2} />
      <div className={styles.encabezado}>
        <h1>Elegí el horario</h1>
        <EleccionActual />
      </div>
      {error && <AvisoEnfocado>{error.mensaje}</AvisoEnfocado>}
      {fechas.datos && (
        <section className={styles.seccion}>
          <h2>Fecha</h2>
          <SelectorFecha fechas={fechas.datos} seleccionada={fecha} onSeleccionar={elegirFecha} />
        </section>
      )}
      {turnos.cargando && <p className={styles.cargando}>Cargando turnos...</p>}
      {turnos.datos && (
        <section className={styles.seccion}>
          <h2>Turno</h2>
          {turnos.datos.turnos.length === 0 ? (
            <p>No hay turnos para esta fecha.</p>
          ) : (
            <div className={styles.turnos} role="group" aria-label="Turnos">
              {turnos.datos.turnos.map((t) => (
                <TurnoChip
                  key={t.id}
                  turno={t}
                  seleccionado={t.id === turno?.id}
                  onSeleccionar={elegirTurno}
                />
              ))}
            </div>
          )}
        </section>
      )}
      {intentosFallidos > 0 && !turno && (
        <AvisoEnfocado clave={intentosFallidos}>Elegí un horario para continuar.</AvisoEnfocado>
      )}
      <AccionesDelPaso onVolver={() => navegar('/inscripcion/actividad')} onContinuar={continuar} />
    </div>
  );
}
