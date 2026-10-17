import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { Aplicacion } from './rutas.jsx';
import './styles/base.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Aplicacion />
    </BrowserRouter>
  </StrictMode>,
);
