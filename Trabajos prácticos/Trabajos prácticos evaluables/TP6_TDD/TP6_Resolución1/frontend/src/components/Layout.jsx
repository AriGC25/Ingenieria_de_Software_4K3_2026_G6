import { Outlet, useNavigate } from 'react-router';
import { useSesion } from '../features/sesion/SesionContexto.jsx';
import { Encabezado } from './Encabezado.jsx';
import styles from './Layout.module.css';

/** Estructura de todas las pantallas: encabezado y contenido centrado. */
export function Layout() {
  const { email, cerrarSesion } = useSesion();
  const navegar = useNavigate();

  function alCerrarSesion() {
    cerrarSesion();
    navegar('/ingreso');
  }

  return (
    <>
      <Encabezado email={email} onCerrarSesion={alCerrarSesion} />
      <main className={styles.contenido}>
        <Outlet />
      </main>
    </>
  );
}
