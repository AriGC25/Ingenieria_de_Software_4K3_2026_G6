import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

const InscripcionContexto = createContext(null);

const VALORES_INICIALES = { cantidad: 1, participantes: [], aceptaTerminos: false };
const SIN_ELECCION = { actividad: null, fecha: null, turno: null };

/**
 * Estado de la inscripción en curso: la actividad, la fecha y el turno elegidos, y un único
 * formulario (React Hook Form) compartido por los pasos, para no perder datos al volver (S-33).
 * @param {{ children: import('react').ReactNode }} props
 */
export function InscripcionProvider({ children }) {
  const formulario = useForm({ defaultValues: VALORES_INICIALES });
  const [eleccion, setEleccion] = useState(SIN_ELECCION);
  const [participantesListos, setParticipantesListos] = useState(false);
  const [resultado, setResultado] = useState(null);
  const campoAEnfocar = useRef(null);

  const elegirActividad = useCallback((actividad) => {
    setParticipantesListos(false);
    setEleccion((actual) =>
      actual.actividad?.id === actividad.id ? actual : { ...SIN_ELECCION, actividad },
    );
  }, []);

  const elegirFecha = useCallback((fecha) => {
    setEleccion((actual) => (actual.fecha === fecha ? actual : { ...actual, fecha, turno: null }));
  }, []);

  const elegirTurno = useCallback((turno) => {
    setParticipantesListos(false);
    setEleccion((actual) => ({ ...actual, turno }));
  }, []);

  /** Recuerda el campo a enfocar cuando se vuelve a su paso por un error de la API. */
  const enfocarAlVolver = useCallback((campo) => {
    campoAEnfocar.current = campo;
  }, []);

  const tomarCampoAEnfocar = useCallback(() => {
    const campo = campoAEnfocar.current;
    campoAEnfocar.current = null;
    return campo;
  }, []);

  const { reset } = formulario;
  const reiniciar = useCallback(() => {
    reset(VALORES_INICIALES);
    setEleccion(SIN_ELECCION);
    setParticipantesListos(false);
    setResultado(null);
  }, [reset]);

  const valor = useMemo(
    () => ({
      ...eleccion,
      participantesListos,
      resultado,
      elegirActividad,
      elegirFecha,
      elegirTurno,
      setParticipantesListos,
      setResultado,
      reiniciar,
      enfocarAlVolver,
      tomarCampoAEnfocar,
    }),
    [
      eleccion,
      participantesListos,
      resultado,
      elegirActividad,
      elegirFecha,
      elegirTurno,
      reiniciar,
      enfocarAlVolver,
      tomarCampoAEnfocar,
    ],
  );

  return (
    <InscripcionContexto.Provider value={valor}>
      <FormProvider {...formulario}>{children}</FormProvider>
    </InscripcionContexto.Provider>
  );
}

export function useInscripcion() {
  return useContext(InscripcionContexto);
}
