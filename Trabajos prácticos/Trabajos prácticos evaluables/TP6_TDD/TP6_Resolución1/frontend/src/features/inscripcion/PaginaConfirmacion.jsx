import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { Button } from '../../components/Button.jsx';
import { Checkbox } from '../../components/Checkbox.jsx';
import { Modal } from '../../components/Modal.jsx';
import { ResumenInscripcion } from '../../components/ResumenInscripcion.jsx';
import { Stepper } from '../../components/Stepper.jsx';
import { useSesion } from '../sesion/SesionContexto.jsx';
import { AccionesDelPaso } from './AccionesDelPaso.jsx';
import { AvisoEnfocado } from './AvisoEnfocado.jsx';
import { useInscripcion } from './InscripcionContexto.jsx';
import styles from './Pasos.module.css';
import { useEnvioInscripcion } from './useEnvioInscripcion.js';

const ELEGIR_OTRO_HORARIO = ['SIN_CUPO', 'HORARIO_NO_DISPONIBLE'];

/** PT-05: resumen, aceptación de los términos (con el modal PT-07) y envío. */
export function PaginaConfirmacion() {
  const { email } = useSesion();
  const { actividad, fecha, turno } = useInscripcion();
  const { register, watch, getValues, formState } = useFormContext();
  const { confirmar, enviando, errorGeneral } = useEnvioInscripcion();
  const [terminosAbiertos, setTerminosAbiertos] = useState(false);
  const navegar = useNavigate();

  const { participantes, cantidad } = getValues();

  return (
    <div className={styles.paso}>
      <Stepper pasoActual={4} />
      <h1>Confirmá la inscripción</h1>
      <ResumenInscripcion
        actividad={actividad.nombre}
        fecha={fecha}
        hora={turno.hora}
        email={email}
        requiereTalle={actividad.requiereTalle}
        participantes={participantes.slice(0, cantidad)}
      />
      <Checkbox
        id="aceptaTerminos"
        label={
          <>
            Acepto los{' '}
            <button
              type="button"
              className={styles.enlace}
              onClick={() => setTerminosAbiertos(true)}
            >
              términos y condiciones
            </button>{' '}
            de {actividad.nombre}
          </>
        }
        error={formState.errors.aceptaTerminos?.message}
        {...register('aceptaTerminos')}
      />
      <Modal
        abierto={terminosAbiertos}
        titulo={`Términos y condiciones de ${actividad.nombre}`}
        onCerrar={() => setTerminosAbiertos(false)}
      >
        {actividad.terminos}
      </Modal>
      {errorGeneral && (
        <div className={styles.seccion}>
          <AvisoEnfocado clave={errorGeneral}>{errorGeneral.mensaje}</AvisoEnfocado>
          {ELEGIR_OTRO_HORARIO.includes(errorGeneral.codigo) && (
            <Button variante="secundario" onClick={() => navegar('/inscripcion/horario')}>
              Elegir otro horario
            </Button>
          )}
        </div>
      )}
      <AccionesDelPaso
        onVolver={() => navegar('/inscripcion/participantes')}
        onContinuar={confirmar}
        textoContinuar="Confirmar inscripción"
        cargando={enviando}
        deshabilitado={!watch('aceptaTerminos')}
      />
    </div>
  );
}
