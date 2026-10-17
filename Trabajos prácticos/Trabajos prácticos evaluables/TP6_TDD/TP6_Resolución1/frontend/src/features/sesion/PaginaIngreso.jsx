import { Navigate, useNavigate } from 'react-router';
import { LoginForm } from './LoginForm.jsx';
import { useSesion } from './SesionContexto.jsx';
import styles from '../../components/Pagina.module.css';

/** PT-01: ingreso simulado. */
export function PaginaIngreso() {
  const { email, iniciarSesion } = useSesion();
  const navegar = useNavigate();

  if (email) return <Navigate to="/inscripcion/actividad" replace />;

  function alIngresar(nuevoEmail) {
    iniciarSesion(nuevoEmail);
    navegar('/inscripcion/actividad');
  }

  return (
    <div className={styles.pagina}>
      <h1>Ingresá para inscribirte</h1>
      <p className={styles.bajada}>
        Inscribite a la Tirolesa, el Safari, la Palestra o Jardinería y reservá tu lugar. Te
        enviamos la confirmación al email con el que ingresás.
      </p>
      <LoginForm onIngresar={alIngresar} />
    </div>
  );
}
