import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { servidor } from '../../msw/servidor.js';
import { renderizarEn } from '../../renderizar.jsx';
import { EMAIL, elegirActividad, empezar } from './flujo.js';

describe('paso 1: actividad', () => {
  it('INS-UI-01: lista las actividades de la API con su edad mínima', async () => {
    empezar();

    expect(await screen.findByRole('button', { name: /Tirolesa/ })).toHaveTextContent(
      'Desde 8 años',
    );
    expect(screen.getByRole('button', { name: /Safari/ })).toHaveTextContent('Todas las edades');
    expect(screen.getByRole('button', { name: /Jardinería/ })).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Pasos de la inscripción' })).toBeInTheDocument();
  });

  it('INS-UI-02: una actividad sin cupos aparece deshabilitada', async () => {
    empezar();

    const palestra = await screen.findByRole('button', { name: /Palestra/ });
    expect(palestra).toBeDisabled();
    expect(palestra).toHaveTextContent('Sin cupos');
  });

  it('pide elegir una actividad antes de continuar', async () => {
    empezar();
    await screen.findByRole('button', { name: /Tirolesa/ });

    await userEvent.click(screen.getByRole('button', { name: 'Continuar' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Elegí una actividad para continuar.');
    expect(screen.getByRole('alert')).toHaveFocus();
  });

  it('un error de la API al listar muestra el mensaje genérico', async () => {
    servidor.use(http.get('*/api/actividades', () => HttpResponse.error()));
    empezar();

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Algo salió mal. Intentá de nuevo en unos minutos.',
    );
  });
});

describe('paso 2: horario', () => {
  it('INS-UI-03: ofrece las fechas de GET /api/fechas y deshabilita las cerradas', async () => {
    servidor.use(
      http.get('*/api/fechas', () =>
        HttpResponse.json([
          { fecha: '2026-10-25', abierta: true },
          { fecha: '2026-10-26', abierta: false, motivo: 'lunes' },
        ]),
      ),
    );
    empezar();

    await elegirActividad('Tirolesa');

    expect(await screen.findByRole('heading', { name: 'Elegí el horario' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /25\/10\/2026/ })).toBeEnabled();
    expect(screen.getByRole('button', { name: /26\/10\/2026/ })).toBeDisabled();
    expect(screen.getByText(/Tirolesa/, { selector: '[data-eleccion]' })).toBeInTheDocument();
  });

  it('INS-UI-04: solo se pueden elegir los turnos disponibles', async () => {
    empezar();
    await elegirActividad('Tirolesa');

    await userEvent.click(await screen.findByRole('button', { name: /^Hoy/ }));

    const turnos = within(await screen.findByRole('group', { name: 'Turnos' }));
    expect(await turnos.findByRole('button', { name: /09:00/ })).toBeDisabled();
    expect(turnos.getByRole('button', { name: /09:00/ })).toHaveTextContent('Ya empezó');
    expect(turnos.getByRole('button', { name: /11:00/ })).toBeDisabled();
    expect(turnos.getByRole('button', { name: /10:00/ })).toBeEnabled();
    expect(turnos.getByRole('button', { name: /10:00/ })).toHaveTextContent('3 cupos');
  });

  it('pide elegir un turno antes de continuar', async () => {
    empezar();
    await elegirActividad('Tirolesa');
    await userEvent.click(await screen.findByRole('button', { name: /^Hoy/ }));

    await userEvent.click(screen.getByRole('button', { name: 'Continuar' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Elegí un horario para continuar.');
  });

  it('sin actividad elegida, el horario redirige al primer paso pendiente', async () => {
    renderizarEn('/inscripcion/horario', { email: EMAIL });

    expect(await screen.findByRole('heading', { name: 'Elegí la actividad' })).toBeInTheDocument();
  });

  it('INS-UI-13: volver a la actividad conserva la elección', async () => {
    empezar();
    await elegirActividad('Safari');

    await userEvent.click(await screen.findByRole('button', { name: 'Volver' }));

    expect(await screen.findByRole('button', { name: /Safari/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });
});
