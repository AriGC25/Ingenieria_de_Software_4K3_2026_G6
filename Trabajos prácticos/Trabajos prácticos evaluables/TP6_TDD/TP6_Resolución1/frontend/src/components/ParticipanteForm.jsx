import { useFormContext } from 'react-hook-form';
import { Select } from './Select.jsx';
import { TextField } from './TextField.jsx';
import styles from './ParticipanteForm.module.css';

const TALLES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

/**
 * Campos de una persona dentro del formulario de la inscripción. El talle solo aparece si la
 * actividad lo requiere.
 * @param {{ indice: number, requiereTalle: boolean }} props
 */
export function ParticipanteForm({ indice, requiereTalle }) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const ruta = `participantes.${indice}`;
  const errores = errors.participantes?.[indice] ?? {};
  const id = (dato) => `participante-${indice}-${dato}`;

  return (
    <fieldset className={styles.persona}>
      <legend className={styles.titulo}>Persona {indice + 1}</legend>
      <TextField
        id={id('nombre')}
        label="Nombre y apellido"
        requerido
        autoComplete="off"
        error={errores.nombre?.message}
        {...register(`${ruta}.nombre`)}
      />
      <TextField
        id={id('dni')}
        label="DNI"
        requerido
        inputMode="numeric"
        ayuda="Sin puntos ni espacios"
        error={errores.dni?.message}
        {...register(`${ruta}.dni`)}
      />
      <TextField
        id={id('edad')}
        label="Edad"
        type="number"
        requerido
        min={0}
        max={100}
        error={errores.edad?.message}
        {...register(`${ruta}.edad`)}
      />
      {requiereTalle && (
        <Select
          id={id('talle')}
          label="Talle"
          requerido
          opciones={TALLES}
          error={errores.talle?.message}
          {...register(`${ruta}.talle`)}
        />
      )}
    </fieldset>
  );
}
