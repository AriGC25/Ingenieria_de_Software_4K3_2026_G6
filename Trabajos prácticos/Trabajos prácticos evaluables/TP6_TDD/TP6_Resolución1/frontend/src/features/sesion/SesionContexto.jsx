import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const CLAVE = 'ecoharmony.sesion';
const SesionContexto = createContext(null);

function leerGuardado() {
  try {
    return sessionStorage.getItem(CLAVE);
  } catch {
    return null;
  }
}

function guardar(email) {
  try {
    if (email) sessionStorage.setItem(CLAVE, email);
    else sessionStorage.removeItem(CLAVE);
  } catch {
    // Sin sessionStorage la sesión dura lo que dure la página.
  }
}

/**
 * Sesión simulada: solo el email, mientras la pestaña esté abierta (S-35). No se verifica nada.
 * @param {{ children: import('react').ReactNode }} props
 */
export function SesionProvider({ children }) {
  const [email, setEmail] = useState(leerGuardado);

  const iniciarSesion = useCallback((nuevoEmail) => {
    guardar(nuevoEmail);
    setEmail(nuevoEmail);
  }, []);

  const cerrarSesion = useCallback(() => {
    guardar(null);
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
