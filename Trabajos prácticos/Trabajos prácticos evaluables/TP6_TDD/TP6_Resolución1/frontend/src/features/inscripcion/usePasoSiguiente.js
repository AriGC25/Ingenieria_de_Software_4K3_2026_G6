import { useState } from 'react';
import { useNavigate } from 'react-router';

/**
 * Avanza al paso siguiente si el actual está completo; si no, cuenta el intento para mostrar (y
 * volver a enfocar) el aviso de lo que falta.
 * @param {boolean} completo
 * @param {string} siguiente ruta del paso siguiente
 * @returns {{ continuar: () => void, intentosFallidos: number }}
 */
export function usePasoSiguiente(completo, siguiente) {
  const [intentosFallidos, setIntentosFallidos] = useState(0);
  const navegar = useNavigate();

  function continuar() {
    if (completo) navegar(siguiente);
    else setIntentosFallidos((veces) => veces + 1);
  }

  return { continuar, intentosFallidos };
}
