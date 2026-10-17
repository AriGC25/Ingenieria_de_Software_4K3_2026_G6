import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderizarEn } from '../renderizar.jsx';

async function ingresar(email, contrasena) {
  if (email) {
    // Se pega en lugar de tipear: los emails largos de los valores límite hacen lenta la prueba.
    await userEvent.click(screen.getByRole('textbox', { name: /Email/ }));
    await userEvent.paste(email);
  }
  if (contrasena) await userEvent.type(screen.getByLabelText(/Contraseña/), contrasena);
  await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
}

describe('sesión simulada', () => {
  it('SES-UI-01: rechaza un email con formato inválido', async () => {
    renderizarEn('/ingreso');

    await ingresar('ana-mail.com', 'secreta');

    expect(screen.getByRole('textbox', { name: /Email/ })).toHaveAccessibleDescription(
      'Ingresá un email válido.',
    );
    expect(sessionStorage.getItem('ecoharmony.sesion')).toBeNull();
  });

  it('SES-UI-01: rechaza un email de más de 254 caracteres y acepta uno de 254', async () => {
    renderizarEn('/ingreso');
    const largo = (n) =>
      `${'a'.repeat(64)}@${'b'.repeat(63)}.${'c'.repeat(63)}.${'d'.repeat(n)}.com`;

    await ingresar(largo(58), 'x');
    expect(screen.getByRole('textbox', { name: /Email/ })).toHaveAccessibleDescription(
      'Ingresá un email válido.',
    );

    await userEvent.clear(screen.getByRole('textbox', { name: /Email/ }));
    await ingresar(largo(57));
    expect(await screen.findByRole('heading', { name: 'Elegí la actividad' })).toBeInTheDocument();
  });

  it('SES-UI-01: exige una contraseña no vacía, pero no la verifica', async () => {
    renderizarEn('/ingreso');

    await ingresar('ana@mail.com');

    expect(screen.getByLabelText(/Contraseña/)).toHaveAccessibleDescription(
      'Ingresá tu contraseña.',
    );
  });

  it('SES-UI-02: al ingresar guarda el email en sessionStorage y va a la elección de actividad', async () => {
    renderizarEn('/ingreso');

    await ingresar('ana@mail.com', 'cualquiera');

    expect(sessionStorage.getItem('ecoharmony.sesion')).toBe('ana@mail.com');
    expect(await screen.findByRole('heading', { name: 'Elegí la actividad' })).toBeInTheDocument();
    expect(screen.getByText('ana@mail.com')).toBeInTheDocument();
  });

  it.each([
    ['/inscripcion/actividad'],
    ['/inscripcion/horario'],
    ['/inscripcion/participantes'],
    ['/inscripcion/confirmacion'],
    ['/inscripcion/resultado'],
    ['/'],
  ])('SES-UI-03: sin sesión, %s redirige al ingreso', (ruta) => {
    renderizarEn(ruta);

    expect(screen.getByRole('heading', { name: 'Ingresá para inscribirte' })).toBeInTheDocument();
  });

  it('SES-UI-04: cerrar sesión borra el email y vuelve al ingreso', async () => {
    renderizarEn('/inscripcion/actividad', { email: 'ana@mail.com' });

    await userEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }));

    expect(sessionStorage.getItem('ecoharmony.sesion')).toBeNull();
    expect(screen.getByRole('heading', { name: 'Ingresá para inscribirte' })).toBeInTheDocument();
    expect(screen.queryByText('ana@mail.com')).not.toBeInTheDocument();
  });

  it('SES-UI-05: con los dos campos inválidos muestra los dos errores y el foco va al email', async () => {
    renderizarEn('/ingreso');

    await ingresar();

    const email = screen.getByRole('textbox', { name: /Email/ });
    expect(email).toHaveAccessibleDescription('Ingresá un email válido.');
    expect(screen.getByLabelText(/Contraseña/)).toHaveAccessibleDescription(
      'Ingresá tu contraseña.',
    );
    expect(email).toHaveFocus();
  });

  it('con sesión, el ingreso lleva directo a la elección de actividad', () => {
    renderizarEn('/ingreso', { email: 'ana@mail.com' });

    expect(screen.getByRole('heading', { name: 'Elegí la actividad' })).toBeInTheDocument();
  });
});

describe('pantalla de validación (QR)', () => {
  it('VAL-UI-01: muestra el mensaje de demostración y no requiere sesión', () => {
    renderizarEn('/validar-inscripcion');

    expect(
      screen.getByRole('heading', {
        name: 'Pantalla de validación de inscripciones: demostración',
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Ingresá para inscribirte' }),
    ).not.toBeInTheDocument();
  });
});
