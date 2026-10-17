import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

const InscripcionContexto = createContext(null);

const VALORES_INICIALES = { cantidad: 1, participantes: [], aceptaTerminos: false };

/**
 * Estado de la inscripción en curso: la actividad, la fecha y el turno elegidos, y un único
 * formulario (React Hook Form) compartido por los pasos, para no perder datos al volver (S-33).
 * @param {{ children: import('react').ReactNode }} props
 */
export function InscripcionProvider({ children }) {
  const formulario = useForm({ defaultValues: VALORES_INICIALES });
  const [eleccion, setEleccion] = useState({ actividad: null, fecha: null, turno: null });
  const [participantesListos, setParticipantesListos] = useState(false);
  const [resultado, setResultado] = useState(null);

  const elegirActividad = useCallback((actividad) => {
    setParticipantesListos(false);
    setEleccion((actual) =>
      actual.actividad?.id === actividad.id ? actual : { actividad, fecha: null, turno: null },
    );
  }, []);

  const elegirFecha = useCallback((fecha) => {
    setEleccion((actual) => (actual.fecha === fecha ? actual : { ...actual, fecha, turno: null }));
  }, []);

  const elegirTurno = useCallback((turno) => {
    setParticipantesListos(false);
    setEleccion((actual) => ({ ...actual, turno }));
  }, []);

  const reiniciar = useCallback(() => {
    formulario.reset(VALORES_INICIALES);
    setEleccion({ actividad: null, fecha: null, turno: null });
    setParticipantesListos(false);
    setResultado(null);
  }, [formulario]);

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
    }),
    [
      eleccion,
      participantesListos,
      resultado,
      elegirActividad,
      elegirFecha,
      elegirTurno,
      reiniciar,
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
