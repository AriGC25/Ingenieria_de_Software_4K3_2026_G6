const CLAVE = 'ecoharmony.sesion';

/**
 * Guarda el email de la sesión en `sessionStorage`: se pierde al cerrar la pestaña (S-35). Si el
 * navegador no lo permite, la sesión dura lo que dure la página.
 */
export const almacenSesion = Object.freeze({
  /** @returns {string | null} */
  leer() {
    try {
      return sessionStorage.getItem(CLAVE);
    } catch {
      return null;
    }
  },
  /** @param {string} email */
  guardar(email) {
    try {
      sessionStorage.setItem(CLAVE, email);
    } catch {
      // Sin almacenamiento, la sesión vive solo en memoria.
    }
  },
  borrar() {
    try {
      sessionStorage.removeItem(CLAVE);
    } catch {
      // Nada que borrar.
    }
  },
});
