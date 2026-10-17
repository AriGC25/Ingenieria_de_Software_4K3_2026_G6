import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { ParticipanteForm } from '../../components/ParticipanteForm.jsx';
import { Stepper } from '../../components/Stepper.jsx';
import { TextField } from '../../components/TextField.jsx';
import { AccionesDelPaso } from './AccionesDelPaso.jsx';
import { EleccionActual } from './EleccionActual.jsx';
import { useInscripcion } from './InscripcionContexto.jsx';
import styles from './Pasos.module.css';
import { validarParticipantes } from './validarParticipantes.js';

/** PT-04: cantidad de personas y datos de cada una. */
export function PaginaParticipantes() {
  const { actividad, turno, setParticipantesListos, tomarCampoAEnfocar } = useInscripcion();
  const { register, watch, getValues, setError, clearErrors, setFocus, formState } =
    useFormContext();
  const navegar = useNavigate();
  const cupos = turno.cuposDisponibles;
  const cantidad = watch('cantidad');
  const visibles = Number.isInteger(cantidad) ? Math.min(Math.max(cantidad, 0), cupos) : 0;

  // Si se volvió por un error de la API, el foco va al campo con el error.
  useEffect(() => {
    const campo = tomarCampoAEnfocar();
    if (campo) setFocus(campo);
  }, [tomarCampoAEnfocar, setFocus]);

  // Se muestran todos los errores a la vez y el foco va al primero, en el orden del formulario.
  function mostrarErrores(errores) {
    errores.forEach(({ campo, mensaje }) =>
      setError(campo, { type: 'validacion', message: mensaje }),
    );
    setFocus(errores[0].campo);
  }

  function continuar() {
    clearErrors();
    const errores = validarParticipantes(getValues(), {
      cupos,
      requiereTalle: actividad.requiereTalle,
      edadMinima: actividad.edadMinima,
    });
    if (errores.length === 0) {
      setParticipantesListos(true);
      navegar('/inscripcion/confirmacion');
      return;
    }
    mostrarErrores(errores);
  }

  return (
    <div className={styles.paso}>
      <Stepper pasoActual={3} />
      <div className={styles.encabezado}>
        <h1>Indicá quiénes participan</h1>
        <EleccionActual />
      </div>
      <p className={styles.nota}>Los campos con * son obligatorios.</p>
      <TextField
        id="cantidad"
        label="Cantidad de personas"
        type="number"
        requerido
        min={1}
        max={cupos}
        ayuda={`Hasta ${cupos} ${cupos === 1 ? 'persona' : 'personas'} (cupos disponibles).`}
        error={formState.errors.cantidad?.message}
        {...register('cantidad', { valueAsNumber: true })}
      />
      {Array.from({ length: visibles }, (_, i) => (
        <ParticipanteForm key={i} indice={i} requiereTalle={actividad.requiereTalle} />
      ))}
      <AccionesDelPaso onVolver={() => navegar('/inscripcion/horario')} onContinuar={continuar} />
    </div>
  );
}
