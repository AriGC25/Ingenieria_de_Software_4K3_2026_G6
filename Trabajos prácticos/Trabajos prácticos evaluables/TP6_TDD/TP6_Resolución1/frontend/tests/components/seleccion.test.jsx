import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ActividadCard } from '../../src/components/ActividadCard.jsx';
import { SelectorFecha } from '../../src/components/SelectorFecha.jsx';
import { Stepper } from '../../src/components/Stepper.jsx';
import { TurnoChip } from '../../src/components/TurnoChip.jsx';

const tirolesa = {
  id: 'tirolesa',
  nombre: 'Tirolesa',
  edadMinima: 8,
  requiereTalle: true,
  disponible: true,
};

describe('ActividadCard', () => {
  it('muestra el nombre, la edad mínima y el talle, y se puede elegir', async () => {
    const onSeleccionar = vi.fn();
    render(<ActividadCard actividad={tirolesa} onSeleccionar={onSeleccionar} />);

    const tarjeta = screen.getByRole('button', { name: /Tirolesa/ });
    expect(tarjeta).toHaveTextContent('Desde 8 años');
    expect(tarjeta).toHaveTextContent('Requiere talle');
    await userEvent.click(tarjeta);
    expect(onSeleccionar).toHaveBeenCalledWith(tirolesa);
  });

  it('sin edad mínima indica que es para todas las edades', () => {
    render(
      <ActividadCard
        actividad={{ ...tirolesa, nombre: 'Safari', edadMinima: null, requiereTalle: false }}
        onSeleccionar={() => {}}
      />,
    );

    expect(screen.getByRole('button', { name: /Safari/ })).toHaveTextContent('Todas las edades');
  });

  it('CMP-05: sin cupos está deshabilitada con la leyenda "Sin cupos"', () => {
    render(
      <ActividadCard actividad={{ ...tirolesa, disponible: false }} onSeleccionar={() => {}} />,
    );

    const tarjeta = screen.getByRole('button', { name: /Tirolesa/ });
    expect(tarjeta).toBeDisabled();
    expect(tarjeta).toHaveTextContent('Sin cupos');
  });

  it('marca la seleccionada', () => {
    render(<ActividadCard actividad={tirolesa} seleccionada onSeleccionar={() => {}} />);

    expect(screen.getByRole('button', { name: /Tirolesa/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });
});

describe('TurnoChip', () => {
  it('CMP-06: un turno disponible muestra la hora y los cupos restantes, sin aviso de pocos cupos', async () => {
    const onSeleccionar = vi.fn();
    const turno = { id: 't1', hora: '10:00', cuposDisponibles: 1, estado: 'disponible' };
    render(<TurnoChip turno={turno} onSeleccionar={onSeleccionar} />);

    const chip = screen.getByRole('button', { name: /10:00/ });
    expect(chip).toHaveTextContent('1 cupo');
    expect(chip).not.toHaveTextContent(/pocos|últimos/i);
    await userEvent.click(chip);
    expect(onSeleccionar).toHaveBeenCalledWith(turno);
  });

  it('CMP-06: un turno agotado está deshabilitado y dice "Sin cupos"', () => {
    render(
      <TurnoChip
        turno={{ id: 't1', hora: '11:00', cuposDisponibles: 0, estado: 'agotado' }}
        onSeleccionar={() => {}}
      />,
    );

    const chip = screen.getByRole('button', { name: /11:00/ });
    expect(chip).toBeDisabled();
    expect(chip).toHaveTextContent('Sin cupos');
  });

  it.each([
    ['todavia_no_abre', 'Todavía no abre. La inscripción se habilita 24 horas antes.'],
    ['inscripcion_cerrada', 'La inscripción cerró. Cierra 15 minutos antes del turno.'],
    ['ya_empezo', 'Ya empezó'],
  ])('CMP-06: un turno no disponible por %s está deshabilitado con su motivo', (motivo, texto) => {
    render(
      <TurnoChip
        turno={{ id: 't1', hora: '09:00', cuposDisponibles: 10, estado: 'no_disponible', motivo }}
        onSeleccionar={() => {}}
      />,
    );

    const chip = screen.getByRole('button', { name: /09:00/ });
    expect(chip).toBeDisabled();
    expect(chip).toHaveTextContent(texto);
  });
});

describe('SelectorFecha', () => {
  const fechas = [
    { fecha: '2026-10-25', abierta: true },
    { fecha: '2026-10-26', abierta: false, motivo: 'lunes' },
  ];

  it('CMP-09: ofrece las fechas en dd/mm/aaaa y deshabilita las cerradas con su motivo', async () => {
    const onSeleccionar = vi.fn();
    render(<SelectorFecha fechas={fechas} onSeleccionar={onSeleccionar} />);

    const domingo = screen.getByRole('button', { name: /25\/10\/2026/ });
    const lunes = screen.getByRole('button', { name: /26\/10\/2026/ });
    expect(domingo).toHaveTextContent('Hoy');
    expect(domingo).toHaveTextContent('domingo');
    expect(lunes).toBeDisabled();
    expect(lunes).toHaveTextContent('El parque está cerrado ese día');
    await userEvent.click(domingo);
    expect(onSeleccionar).toHaveBeenCalledWith('2026-10-25');
  });

  it('CMP-09: marca la fecha seleccionada', () => {
    render(<SelectorFecha fechas={fechas} seleccionada="2026-10-25" onSeleccionar={() => {}} />);

    expect(screen.getByRole('button', { name: /25\/10\/2026/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });
});

describe('Stepper', () => {
  it('CMP-07: marca el paso actual y los completados', () => {
    render(<Stepper pasoActual={3} />);

    const pasos = within(
      screen.getByRole('list', { name: 'Pasos de la inscripción' }),
    ).getAllByRole('listitem');
    expect(pasos.map((p) => p.textContent)).toEqual([
      '1Actividad (completado)',
      '2Horario (completado)',
      '3Participantes',
      '4Confirmación',
    ]);
    expect(pasos[2]).toHaveAttribute('aria-current', 'step');
    expect(pasos[3]).not.toHaveAttribute('aria-current');
  });
});
