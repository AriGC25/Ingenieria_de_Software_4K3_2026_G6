import { Navigate, Outlet } from 'react-router';
import { useSesion } from './SesionContexto.jsx';

/** Sin sesión, lleva al ingreso. */
export function RutaProtegida() {
  const { email } = useSesion();
  return email ? <Outlet /> : <Navigate to="/ingreso" replace />;
}
