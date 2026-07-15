import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FilterBar } from '../src/catalog/infrastructure/ui/components/FilterBar.js';
import type { CountryDTO } from '../src/catalog/infrastructure/adapters/CatalogApiAdapter.js';

const countries: CountryDTO[] = [
  { id: 'MEX', name: 'México', isoCode: 'MX', groupId: 'A' },
];

describe('FilterBar', () => {
  it('renders Filtros title with ownership, Grupos, and Países chips inline', () => {
    render(
      <FilterBar
        ownershipFilter="all"
        scopeFilter={{ kind: 'none' }}
        countries={countries}
        onOwnershipChange={vi.fn()}
        onScopeChange={vi.fn()}
      />,
    );

    expect(screen.getByText('Filtros')).toBeInTheDocument();
    expect(screen.queryByText('Estado')).not.toBeInTheDocument();

    const filters = screen.getByRole('group', { name: 'Filtros' });
    const labels = within(filters)
      .getAllByRole('button')
      .map((button) => button.getAttribute('aria-label'));

    expect(labels).toEqual([
      'Todos',
      'Faltantes',
      'Conseguidas',
      'Repetidas',
      'Grupos',
      'Países',
    ]);
    expect(screen.queryByRole('button', { name: 'Grupo A' })).not.toBeInTheDocument();
  });

  it('opens the Grupos sheet from the Grupos chip', () => {
    render(
      <FilterBar
        ownershipFilter="all"
        scopeFilter={{ kind: 'none' }}
        countries={countries}
        onOwnershipChange={vi.fn()}
        onScopeChange={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Grupos' }));

    expect(screen.getByRole('dialog', { name: 'Grupos' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Grupo A' })).toBeInTheDocument();
  });

  it('opens the Países sheet from the Países chip', () => {
    render(
      <FilterBar
        ownershipFilter="all"
        scopeFilter={{ kind: 'none' }}
        countries={countries}
        onOwnershipChange={vi.fn()}
        onScopeChange={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Países' }));

    expect(screen.getByRole('dialog', { name: 'Países' })).toBeInTheDocument();
    expect(screen.getByLabelText('Buscar país')).toBeInTheDocument();
  });

  it('marks Grupos chip active when a group scope is selected', () => {
    render(
      <FilterBar
        ownershipFilter="all"
        scopeFilter={{ kind: 'group', name: 'Grupo A' }}
        countries={countries}
        onOwnershipChange={vi.fn()}
        onScopeChange={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'Grupos' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Países' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('marks Países chip active when a country scope is selected', () => {
    render(
      <FilterBar
        ownershipFilter="all"
        scopeFilter={{ kind: 'country', id: 'MEX' }}
        countries={countries}
        onOwnershipChange={vi.fn()}
        onScopeChange={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'Países' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Grupos' })).toHaveAttribute('aria-pressed', 'false');
  });
});
