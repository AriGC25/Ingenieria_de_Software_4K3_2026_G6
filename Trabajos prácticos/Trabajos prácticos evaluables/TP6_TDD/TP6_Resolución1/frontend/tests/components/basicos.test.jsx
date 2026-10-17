import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Alert } from '../../src/components/Alert.jsx';
import { Button } from '../../src/components/Button.jsx';
import { Checkbox } from '../../src/components/Checkbox.jsx';
import { Select } from '../../src/components/Select.jsx';
import { TextField } from '../../src/components/TextField.jsx';

describe('Button', () => {
  it('dispara onClick al hacer clic', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Continuar</Button>);

    await userEvent.click(screen.getByRole('button', { name: 'Continuar' }));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('CMP-01: deshabilitado no dispara onClick', async () => {
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled>
        Continuar
      </Button>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Continuar' }));

    expect(onClick).not.toHaveBeenCalled();
  });

  it('CMP-01: cargando muestra "Enviando..." y queda deshabilitado', () => {
    render(<Button cargando>Confirmar inscripción</Button>);

    const boton = screen.getByRole('button', { name: 'Enviando...' });
    expect(boton).toBeDisabled();
    expect(boton).toHaveAttribute('aria-busy', 'true');
  });
});

describe('TextField', () => {
  it('CMP-02: asocia el label y la ayuda', () => {
    render(<TextField id="dni" label="DNI" ayuda="Sin puntos" requerido />);

    const campo = screen.getByRole('textbox', { name: /DNI/ });
    expect(campo).toBeRequired();
    expect(campo).toHaveAccessibleDescription('Sin puntos');
    expect(campo).not.toHaveAttribute('aria-invalid', 'true');
  });

  it('CMP-02: con error queda inválido y el error lo describe', () => {
    render(<TextField id="dni" label="DNI" ayuda="Sin puntos" error="Ingresá un DNI válido." />);

    const campo = screen.getByRole('textbox', { name: 'DNI' });
    expect(campo).toHaveAttribute('aria-invalid', 'true');
    expect(campo).toHaveAccessibleDescription('Sin puntos Ingresá un DNI válido.');
  });

  it('acepta los tipos número y contraseña', () => {
    render(
      <>
        <TextField id="edad" label="Edad" type="number" />
        <TextField id="clave" label="Contraseña" type="password" />
      </>,
    );

    expect(screen.getByRole('spinbutton', { name: 'Edad' })).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toHaveAttribute('type', 'password');
  });
});

describe('Select y Checkbox', () => {
  it('CMP-03: el Select es accesible por rol y nombre, con sus opciones', async () => {
    render(<Select id="talle" label="Talle" opciones={['S', 'M']} error="Ingresá el talle." />);

    const select = screen.getByRole('combobox', { name: 'Talle' });
    expect(select).toHaveAttribute('aria-invalid', 'true');
    expect(select).toHaveAccessibleDescription('Ingresá el talle.');
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual(['Elegí', 'S', 'M']);
    await userEvent.selectOptions(select, 'M');
    expect(select).toHaveValue('M');
  });

  it('CMP-03: el Checkbox es accesible por rol y nombre, y muestra su error', async () => {
    render(<Checkbox id="terminos" label="Acepto los términos" error="Aceptá los términos." />);

    const casilla = screen.getByRole('checkbox', { name: 'Acepto los términos' });
    expect(casilla).not.toBeChecked();
    expect(casilla).toHaveAccessibleDescription('Aceptá los términos.');
    await userEvent.click(casilla);
    expect(casilla).toBeChecked();
  });
});

describe('Alert', () => {
  it('CMP-04: el Alert de error tiene role="alert"', () => {
    render(<Alert tipo="error">No quedan cupos.</Alert>);

    expect(screen.getByRole('alert')).toHaveTextContent('No quedan cupos.');
  });

  it('el Alert de éxito es un estado, no una alerta', () => {
    render(<Alert tipo="exito">¡Inscripción confirmada!</Alert>);

    expect(screen.getByRole('status')).toHaveTextContent('¡Inscripción confirmada!');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
