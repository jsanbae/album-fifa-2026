import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FilterBar } from '../src/catalog/infrastructure/ui/components/FilterBar.js';
import type { CountryDTO } from '../src/catalog/infrastructure/adapters/CatalogApiAdapter.js';

const countries: CountryDTO[] = [
  { id: 'MEX', name: 'México', isoCode: 'MX', groupId: 'A' },
];

describe('FilterBar', () => {
  it('renders inline Estado chips only on the dashboard', () => {
    render(
      <FilterBar
        ownershipFilter="all"
        scopeFilter={{ kind: 'none' }}
        countries={countries}
        onOwnershipChange={vi.fn()}
        onScopeChange={vi.fn()}
      />,
    );

    expect(screen.getByText('Estado')).toBeInTheDocument();
    expect(screen.queryByRole('tab', { name: 'Países' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Grupo A' })).not.toBeInTheDocument();

    const estado = screen.getByRole('group', { name: 'Estado' });
    const labels = within(estado)
      .getAllByRole('button')
      .map((button) => button.getAttribute('aria-label'));

    expect(labels).toEqual(['Todos', 'Faltantes', 'Conseguidas', 'Repetidas']);
  });

  it('opens the filter sheet from the Filtros control', () => {
    render(
      <FilterBar
        ownershipFilter="all"
        scopeFilter={{ kind: 'none' }}
        countries={countries}
        onOwnershipChange={vi.fn()}
        onScopeChange={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Filtros' }));

    expect(screen.getByRole('dialog', { name: 'Filtrar cromos' })).toBeInTheDocument();
  });

  it('shows a badge when scope is active', () => {
    render(
      <FilterBar
        ownershipFilter="all"
        scopeFilter={{ kind: 'country', id: 'MEX' }}
        countries={countries}
        onOwnershipChange={vi.fn()}
        onScopeChange={vi.fn()}
      />,
    );

    expect(screen.getByLabelText('Filtro de alcance activo')).toHaveTextContent('1');
  });
});
