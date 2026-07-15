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
  });

  it('shows the selected group name on the Grupos chip', () => {
    render(
      <FilterBar
        ownershipFilter="all"
        scopeFilter={{ kind: 'group', name: 'Grupo A' }}
        countries={countries}
        onOwnershipChange={vi.fn()}
        onScopeChange={vi.fn()}
      />,
    );

    const groupsChip = screen.getByRole('button', { name: 'Grupo A' });
    expect(groupsChip).toHaveAttribute('aria-pressed', 'true');
    expect(groupsChip).toHaveTextContent('Grupo A');
    expect(screen.getByRole('button', { name: 'Países' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('shows the selected country flag and name on the Países chip', async () => {
    render(
      <FilterBar
        ownershipFilter="all"
        scopeFilter={{ kind: 'country', id: 'MEX' }}
        countries={countries}
        onOwnershipChange={vi.fn()}
        onScopeChange={vi.fn()}
      />,
    );

    const countriesChip = screen.getByRole('button', { name: 'México' });
    expect(countriesChip).toHaveAttribute('aria-pressed', 'true');
    expect(countriesChip).toHaveTextContent('México');
    expect(await within(countriesChip).findByRole('img', { name: 'México' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Grupos' })).toHaveAttribute('aria-pressed', 'false');
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

  it('reopens the Grupos sheet from an active selection without clearing scope', () => {
    const onScopeChange = vi.fn();
    render(
      <FilterBar
        ownershipFilter="all"
        scopeFilter={{ kind: 'group', name: 'Grupo A' }}
        countries={countries}
        onOwnershipChange={vi.fn()}
        onScopeChange={onScopeChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Grupo A' }));

    expect(screen.getByRole('dialog', { name: 'Grupos' })).toBeInTheDocument();
    expect(onScopeChange).not.toHaveBeenCalled();
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

  it('reopens the Países sheet from an active country without clearing scope', () => {
    const onScopeChange = vi.fn();
    render(
      <FilterBar
        ownershipFilter="all"
        scopeFilter={{ kind: 'country', id: 'MEX' }}
        countries={countries}
        onOwnershipChange={vi.fn()}
        onScopeChange={onScopeChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'México' }));

    expect(screen.getByRole('dialog', { name: 'Países' })).toBeInTheDocument();
    expect(onScopeChange).not.toHaveBeenCalled();
  });
});
