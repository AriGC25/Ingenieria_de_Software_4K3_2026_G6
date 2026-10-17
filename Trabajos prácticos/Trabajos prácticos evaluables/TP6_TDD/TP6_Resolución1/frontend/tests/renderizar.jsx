import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Aplicacion } from '../src/rutas.jsx';

/**
 * Renderiza la aplicación completa en una ruta, con o sin sesión iniciada.
 * @param {string} ruta
 * @param {{ email?: string }} [opciones]
 */
export function renderizarEn(ruta, { email } = {}) {
  if (email) sessionStorage.setItem('ecoharmony.sesion', email);
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <Aplicacion />
    </MemoryRouter>,
  );
}
