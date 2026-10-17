import { Navigate, Route, Routes } from 'react-router';
import { Layout } from './components/Layout.jsx';
import { PaginaActividad } from './features/inscripcion/PaginaActividad.jsx';
import { PaginaIngreso } from './features/sesion/PaginaIngreso.jsx';
import { RutaProtegida } from './features/sesion/RutaProtegida.jsx';
import { SesionProvider } from './features/sesion/SesionContexto.jsx';
import { PaginaValidacion } from './features/validacion/PaginaValidacion.jsx';

/** La aplicación con sus proveedores y rutas. El router lo pone quien la monta. */
export function Aplicacion() {
  return (
    <SesionProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/ingreso" element={<PaginaIngreso />} />
          <Route path="/validar-inscripcion" element={<PaginaValidacion />} />
          <Route element={<RutaProtegida />}>
            <Route path="/inscripcion/actividad" element={<PaginaActividad />} />
            <Route
              path="/inscripcion/*"
              element={<Navigate to="/inscripcion/actividad" replace />}
            />
          </Route>
          <Route path="*" element={<Navigate to="/inscripcion/actividad" replace />} />
        </Route>
      </Routes>
    </SesionProvider>
  );
}
