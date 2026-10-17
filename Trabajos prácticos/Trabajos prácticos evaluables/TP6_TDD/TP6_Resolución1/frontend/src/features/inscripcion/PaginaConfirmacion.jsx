import { useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { crearInscripcion } from '../../api/cliente.js';
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
import { armarSolicitud, ubicarCampo } from './solicitud.js';

const ELEGIR_OTRO_HORARIO = ['SIN_CUPO', 'HORARIO_NO_DISPONIBLE'];

/** PT-05: resumen, aceptación de los términos (con el modal PT-07) y envío. */
export function PaginaConfirmacion() {
  const { email } = useSesion();
  const inscripcion = useInscripcion();
  const { actividad, fecha, turno, setResultado, enfocarAlVolver } = inscripcion;
  const { register, watch, getValues, setError, formState } = useFormContext();
  const [terminosAbiertos, setTerminosAbiertos] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState(null);
  const enCurso = useRef(false);
  const navegar = useNavigate();

  const valores = getValues();
  const participantes = valores.participantes.slice(0, valores.cantidad);
  const aceptaTerminos = watch('aceptaTerminos');

  async function confirmar() {
    if (enCurso.current) return;
    enCurso.current = true;
    setEnviando(true);
    setErrorGeneral(null);
    try {
      const confirmada = await crearInscripcion(
        armarSolicitud(getValues(), { turno, actividad, email }),
      );
      setResultado({ tipo: 'exito', inscripcion: confirmada });
      navegar('/inscripcion/resultado');
    } catch (error) {
      manejarError(error);
    } finally {
      enCurso.current = false;
      setEnviando(false);
    }
  }

  function manejarError(error) {
    if (error.codigo === 'ENVIO_CONFIRMACION_FALLIDO') {
      setResultado({ tipo: 'envio_fallido', mensaje: error.mensaje });
      navegar('/inscripcion/resultado');
      return;
    }
    const ubicacion = error.campo && ubicarCampo(error.campo);
    if (!ubicacion) {
      setErrorGeneral(error);
      return;
    }
    setError(ubicacion.campo, { type: 'api', message: error.mensaje });
    enfocarAlVolver(ubicacion.campo);
    navegar(ubicacion.ruta);
  }

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
        participantes={participantes}
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
        deshabilitado={!aceptaTerminos}
      />
    </div>
  );
}
