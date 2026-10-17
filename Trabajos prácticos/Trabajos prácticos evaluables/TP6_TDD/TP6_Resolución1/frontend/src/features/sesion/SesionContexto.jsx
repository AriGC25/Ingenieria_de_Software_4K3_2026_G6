import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { almacenSesion } from './almacenSesion.js';

const SesionContexto = createContext(null);

/**
 * Sesión simulada: solo el email, mientras la pestaña esté abierta (S-35). No se verifica nada.
 * @param {{ children: import('react').ReactNode }} props
 */
export function SesionProvider({ children }) {
  const [email, setEmail] = useState(almacenSesion.leer);

  const iniciarSesion = useCallback((nuevoEmail) => {
    almacenSesion.guardar(nuevoEmail);
    setEmail(nuevoEmail);
  }, []);

  const cerrarSesion = useCallback(() => {
    almacenSesion.borrar();
    setEmail(null);
  }, []);

  const valor = useMemo(
    () => ({ email, iniciarSesion, cerrarSesion }),
    [email, iniciarSesion, cerrarSesion],
  );
  return <SesionContexto.Provider value={valor}>{children}</SesionContexto.Provider>;
}

/** @returns {{ email: string | null, iniciarSesion: (email: string) => void, cerrarSesion: () => void }} */
export function useSesion() {
  return useContext(SesionContexto);
}
