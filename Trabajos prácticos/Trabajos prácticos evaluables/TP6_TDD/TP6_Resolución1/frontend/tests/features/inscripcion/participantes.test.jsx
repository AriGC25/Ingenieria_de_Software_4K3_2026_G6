import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderizarEn } from '../../renderizar.jsx';
import {
  ANA,
  EMAIL,
  JUAN,
  completarPersona,
  elegirActividad,
  elegirHorario,
  empezar,
  indicarCantidad,
} from './flujo.js';

async function llegarAParticipantes(actividad = 'Tirolesa') {
  empezar();
  await elegirActividad(actividad);
  await elegirHorario('10:00');
  await screen.findByRole('heading', { name: 'Indicá quiénes participan' });
}

const continuar = () => userEvent.click(screen.getByRole('button', { name: 'Continuar' }));
const campo = (nombre, persona = 1) =>
  screen
    .getAllByLabelText(new RegExp(`^${nombre}`))
    .find(
      (e) => e.closest('fieldset')?.querySelector('legend').textContent === `Persona ${persona}`,
    );

describe('paso 3: participantes', () => {
  it('muestra la actividad y el turno elegidos', async () => {
    await llegarAParticipantes();

    expect(screen.getByText('Tirolesa · 20/10/2026 10:00')).toBeInTheDocument();
  });

  it('INS-UI-05: la cantidad va de 1 a los cupos disponibles del turno', async () => {
    await llegarAParticipantes();
    const cantidad = screen.getByRole('spinbutton', { name: /Cantidad de personas/ });
    expect(cantidad).toHaveAccessibleDescription(/Hasta 3 personas/);

    await indicarCantidad(4);
    await continuar();
    expect(cantidad).toHaveAccessibleDescription(
      /Podés inscribir hasta 3 personas en este horario\./,
    );

    await indicarCantidad(0);
    await continuar();
    expect(cantidad).toHaveAccessibleDescription(/Agregá al menos una persona\./);
  });

  it('INS-UI-06: hay un formulario por persona', async () => {
    await llegarAParticipantes();

    await indicarCantidad(3);

    expect(screen.getAllByRole('group', { name: /^Persona \d$/ })).toHaveLength(3);
  });

  it('INS-UI-15: cambiar la cantidad conserva los formularios ya cargados', async () => {
    await llegarAParticipantes();
    await indicarCantidad(2);
    await completarPersona(0, ANA);
    await completarPersona(1, JUAN);

    await indicarCantidad(1);
    await indicarCantidad(2);

    expect(campo('Nombre', 1)).toHaveValue('Ana Pérez');
    expect(campo('Nombre', 2)).toHaveValue('Juan Pérez');
  });

  it('PART-UI-01: en Tirolesa el talle aparece y es obligatorio', async () => {
    await llegarAParticipantes('Tirolesa');
    await completarPersona(0, { nombre: 'Ana', dni: '40123456', edad: 25 });

    await continuar();

    expect(campo('Talle')).toHaveAccessibleDescription('Ingresá el talle.');
  });

  it('PART-UI-02: en Safari el talle no aparece', async () => {
    await llegarAParticipantes('Safari');

    expect(screen.queryByRole('combobox', { name: /Talle/ })).not.toBeInTheDocument();
  });

  it('PART-UI-03: un DNI inválido muestra su mensaje junto al campo', async () => {
    await llegarAParticipantes();
    await completarPersona(0, { ...ANA, dni: '40.123.456' });

    await continuar();

    expect(campo('DNI')).toHaveAccessibleDescription(
      /Ingresá un DNI válido \(7 u 8 números, sin puntos\)\./,
    );
  });

  it('PART-UI-04: el nombre y la edad son obligatorios', async () => {
    await llegarAParticipantes();
    await completarPersona(0, { dni: '40123456', talle: 'M' });

    await continuar();

    expect(campo('Nombre')).toHaveAccessibleDescription(
      'Ingresá un nombre válido (hasta 100 letras).',
    );
    expect(campo('Edad')).toHaveAccessibleDescription('Ingresá una edad entre 0 y 100.');
  });

  it('PART-UI-05: una edad menor a la mínima muestra el mensaje de la actividad', async () => {
    await llegarAParticipantes('Tirolesa');
    await completarPersona(0, { ...ANA, edad: 7 });

    await continuar();

    expect(campo('Edad')).toHaveAccessibleDescription(
      'Esta actividad es para personas de 8 años o más.',
    );
  });

  it('PART-UI-06: con varios campos inválidos muestra todos los errores y enfoca el primero', async () => {
    await llegarAParticipantes();
    await indicarCantidad(2);
    await completarPersona(0, { nombre: 'Ana', dni: '40123456', edad: 25, talle: 'M' });
    await completarPersona(1, { nombre: 'Juan 2', dni: '1', edad: 101 });

    await continuar();

    expect(campo('Nombre', 2)).toHaveAttribute('aria-invalid', 'true');
    expect(campo('DNI', 2)).toHaveAttribute('aria-invalid', 'true');
    expect(campo('Edad', 2)).toHaveAttribute('aria-invalid', 'true');
    expect(campo('Talle', 2)).toHaveAttribute('aria-invalid', 'true');
    expect(campo('Nombre', 1)).not.toHaveAttribute('aria-invalid');
    expect(campo('Nombre', 2)).toHaveFocus();
  });

  it('PART-UI-07: un DNI repetido muestra el error en el segundo DNI', async () => {
    await llegarAParticipantes();
    await indicarCantidad(2);
    await completarPersona(0, ANA);
    await completarPersona(1, { ...JUAN, dni: ANA.dni });

    await continuar();

    expect(campo('DNI', 2)).toHaveAccessibleDescription(/Este DNI ya está en la inscripción\./);
    expect(campo('DNI', 1)).not.toHaveAttribute('aria-invalid');
  });

  it('con datos válidos avanza a la confirmación', async () => {
    await llegarAParticipantes();
    await completarPersona(0, ANA);

    await continuar();

    expect(
      await screen.findByRole('heading', { name: 'Confirmá la inscripción' }),
    ).toBeInTheDocument();
  });

  it('INS-UI-13: volver al horario y regresar conserva los datos cargados', async () => {
    await llegarAParticipantes();
    await completarPersona(0, { nombre: 'Ana Pérez' });

    await userEvent.click(screen.getByRole('button', { name: 'Volver' }));
    expect(await screen.findByRole('button', { name: /10:00/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await userEvent.click(screen.getByRole('button', { name: 'Continuar' }));

    expect(campo('Nombre')).toHaveValue('Ana Pérez');
  });

  it('sin turno elegido, los participantes redirigen al primer paso pendiente', async () => {
    renderizarEn('/inscripcion/participantes', { email: EMAIL });

    expect(await screen.findByRole('heading', { name: 'Elegí la actividad' })).toBeInTheDocument();
  });
});
