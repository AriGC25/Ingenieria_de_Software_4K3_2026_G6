import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';
import { Encabezado } from '../../src/components/Encabezado.jsx';
import { Modal } from '../../src/components/Modal.jsx';
import { ParticipanteForm } from '../../src/components/ParticipanteForm.jsx';
import { ResumenInscripcion } from '../../src/components/ResumenInscripcion.jsx';

describe('Encabezado', () => {
  it('CMP-08: con sesión muestra el logo, el email y "Cerrar sesión"', async () => {
    const onCerrarSesion = vi.fn();
    render(<Encabezado email="ana@mail.com" onCerrarSesion={onCerrarSesion} />);

    expect(screen.getByRole('img', { name: 'EcoHarmony Park' })).toBeInTheDocument();
    expect(screen.getByText('ana@mail.com')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }));
    expect(onCerrarSesion).toHaveBeenCalledOnce();
  });

  it('CMP-08: sin sesión muestra solo el logo', () => {
    render(<Encabezado />);

    expect(screen.getByRole('img', { name: 'EcoHarmony Park' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Cerrar sesión' })).not.toBeInTheDocument();
  });
});

function ConModal() {
  const [abierto, setAbierto] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setAbierto(true)}>
        términos y condiciones
      </button>
      <Modal abierto={abierto} titulo="Términos de Tirolesa" onCerrar={() => setAbierto(false)}>
        <p>Texto completo.</p>
        <a href="#reglamento">Reglamento</a>
      </Modal>
    </>
  );
}

describe('Modal', () => {
  it('CMP-10: abre un diálogo con su título y lleva el foco adentro', async () => {
    render(<ConModal />);

    await userEvent.click(screen.getByRole('button', { name: 'términos y condiciones' }));

    const dialogo = screen.getByRole('dialog', { name: 'Términos de Tirolesa' });
    expect(dialogo).toHaveAttribute('aria-modal', 'true');
    expect(dialogo).toContainElement(document.activeElement);
  });

  it('CMP-10: atrapa el foco al recorrerlo con Tab', async () => {
    render(<ConModal />);
    await userEvent.click(screen.getByRole('button', { name: 'términos y condiciones' }));
    const dialogo = screen.getByRole('dialog');

    for (let i = 0; i < 5; i++) {
      await userEvent.tab();
      expect(dialogo).toContainElement(document.activeElement);
    }
    await userEvent.tab({ shift: true });
    expect(dialogo).toContainElement(document.activeElement);
  });

  it('CMP-10: se cierra con Esc y devuelve el foco al elemento que lo abrió', async () => {
    render(<ConModal />);
    const enlace = screen.getByRole('button', { name: 'términos y condiciones' });
    await userEvent.click(enlace);

    await userEvent.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(enlace).toHaveFocus();
  });

  it('CMP-10: se cierra con el botón "Cerrar"', async () => {
    render(<ConModal />);
    const enlace = screen.getByRole('button', { name: 'términos y condiciones' });
    await userEvent.click(enlace);

    await userEvent.click(screen.getByRole('button', { name: 'Cerrar' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(enlace).toHaveFocus();
  });
});

describe('ResumenInscripcion', () => {
  it('muestra la actividad, la fecha, la hora, los participantes y el email', () => {
    render(
      <ResumenInscripcion
        actividad="Tirolesa"
        fecha="2026-10-20"
        hora="10:00"
        email="ana@mail.com"
        requiereTalle
        participantes={[{ nombre: 'Ana Pérez', dni: '40123456', edad: 25, talle: 'M' }]}
      />,
    );

    const resumen = screen.getByRole('region', { name: 'Resumen de la inscripción' });
    expect(resumen).toHaveTextContent('Tirolesa');
    expect(resumen).toHaveTextContent('20/10/2026');
    expect(resumen).toHaveTextContent('10:00');
    expect(resumen).toHaveTextContent('ana@mail.com');
    expect(resumen).toHaveTextContent('Ana Pérez');
    expect(resumen).toHaveTextContent('DNI 40123456 · 25 años · Talle M');
  });

  it('sin talle no lo muestra', () => {
    render(
      <ResumenInscripcion
        actividad="Safari"
        fecha="2026-10-20"
        hora="10:00"
        email="ana@mail.com"
        participantes={[{ nombre: 'Ana Pérez', dni: '40123456', edad: 25 }]}
      />,
    );

    expect(screen.getByRole('region')).not.toHaveTextContent('Talle');
  });
});

function ConFormulario({ requiereTalle, errores }) {
  const metodos = useForm({ defaultValues: { participantes: [{}] } });
  const { setError } = metodos;
  useEffect(() => {
    Object.entries(errores ?? {}).forEach(([campo, mensaje]) =>
      setError(campo, { message: mensaje }),
    );
  }, [errores, setError]);
  return (
    <FormProvider {...metodos}>
      <ParticipanteForm indice={0} requiereTalle={requiereTalle} />
    </FormProvider>
  );
}

describe('ParticipanteForm', () => {
  it('CMP-11: muestra nombre, DNI, edad y talle si la actividad lo requiere', () => {
    render(<ConFormulario requiereTalle />);

    expect(screen.getByRole('group', { name: 'Persona 1' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /Nombre y apellido/ })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /DNI/ })).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: /Edad/ })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /Talle/ })).toBeInTheDocument();
  });

  it('CMP-11: no muestra el talle si la actividad no lo requiere', () => {
    render(<ConFormulario requiereTalle={false} />);

    expect(screen.queryByRole('combobox', { name: /Talle/ })).not.toBeInTheDocument();
  });

  it('muestra el error de cada campo junto al campo', () => {
    render(
      <ConFormulario
        requiereTalle
        errores={{ 'participantes.0.dni': 'Ingresá un DNI válido (7 u 8 números, sin puntos).' }}
      />,
    );

    expect(screen.getByRole('textbox', { name: /DNI/ })).toHaveAccessibleDescription(
      /Ingresá un DNI válido/,
    );
  });
});
