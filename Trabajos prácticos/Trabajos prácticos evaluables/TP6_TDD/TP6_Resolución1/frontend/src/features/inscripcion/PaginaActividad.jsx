import { useState } from 'react';
import { useNavigate } from 'react-router';
import { listarActividades } from '../../api/cliente.js';
import { ActividadCard } from '../../components/ActividadCard.jsx';
import { Button } from '../../components/Button.jsx';
import { Stepper } from '../../components/Stepper.jsx';
import { useCarga } from '../../hooks/useCarga.js';
import { AvisoEnfocado } from './AvisoEnfocado.jsx';
import { useInscripcion } from './InscripcionContexto.jsx';
import styles from './Pasos.module.css';

/** PT-02: elección de la actividad. */
export function PaginaActividad() {
  const { actividad, elegirActividad } = useInscripcion();
  const { datos: actividades, cargando, error } = useCarga(listarActividades, []);
  const [faltaElegir, setFaltaElegir] = useState(0);
  const navegar = useNavigate();

  function continuar() {
    if (actividad) navegar('/inscripcion/horario');
    else setFaltaElegir((veces) => veces + 1);
  }

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
      {faltaElegir > 0 && !actividad && (
        <AvisoEnfocado clave={faltaElegir}>Elegí una actividad para continuar.</AvisoEnfocado>
      )}
      <div className={styles.acciones}>
        <span />
        <Button onClick={continuar}>Continuar</Button>
      </div>
    </div>
  );
}
