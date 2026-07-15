import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FilterChips } from '../src/catalog/infrastructure/ui/components/FilterChips.js';
import type { CountryDTO } from '../src/catalog/infrastructure/adapters/CatalogApiAdapter.js';

const countries: CountryDTO[] = [
  { id: 'USA', name: 'Estados Unidos', isoCode: 'US', groupId: 'A' },
  { id: 'MEX', name: 'México', isoCode: 'MX', groupId: 'A' },
  { id: 'ARG', name: 'Argentina', isoCode: 'AR', groupId: 'A' },
];

describe('FilterChips', () => {
  it('renders Estado, Grupos, and Países sections', () => {
    render(
      <FilterChips
        ownershipFilter="all"
        scopeFilter={{ kind: 'none' }}
        countries={countries}
        onOwnershipChange={vi.fn()}
        onScopeChange={vi.fn()}
      />,
    );

    expect(screen.getByText('Estado')).toBeInTheDocument();
    expect(screen.getByText('Grupos')).toBeInTheDocument();
    expect(screen.getByText('Países')).toBeInTheDocument();
  });

  it('renders ownership chips under Estado before group chips', () => {
    render(
      <FilterChips
        ownershipFilter="all"
        scopeFilter={{ kind: 'none' }}
        countries={countries}
        onOwnershipChange={vi.fn()}
        onScopeChange={vi.fn()}
      />,
    );

    const estado = screen.getByRole('group', { name: 'Estado' });
    const labels = within(estado)
      .getAllByRole('button')
      .map((button) => button.getAttribute('aria-label'));

    expect(labels).toEqual(['Todos', 'Faltantes', 'Conseguidas', 'Repetidas']);
  });

  it('renders FIFA and Coca-Cola icons on branded group chips', () => {
    render(
      <FilterChips
        ownershipFilter="all"
        scopeFilter={{ kind: 'none' }}
        countries={countries}
        onOwnershipChange={vi.fn()}
        onScopeChange={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: /FIFA World Cup/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Coca-Cola/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'FIFA World Cup' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Coca-Cola' })).toBeInTheDocument();
  });

  it('renders country chips sorted by Spanish name with flags', async () => {
    render(
      <FilterChips
        ownershipFilter="all"
        scopeFilter={{ kind: 'none' }}
        countries={countries}
        onOwnershipChange={vi.fn()}
        onScopeChange={vi.fn()}
      />,
    );

    const paises = screen.getByRole('group', { name: 'Países' });
    const labels = within(paises)
      .getAllByRole('button')
      .map((button) => button.getAttribute('aria-label'));

    expect(labels).toEqual(['Argentina', 'Estados Unidos', 'México']);
    expect(await within(paises).findByRole('img', { name: 'México' })).toBeInTheDocument();
  });

  it('notifies ownership change independently of scope', () => {
    const onOwnershipChange = vi.fn();
    const onScopeChange = vi.fn();
    render(
      <FilterChips
        ownershipFilter="all"
        scopeFilter={{ kind: 'group', name: 'Grupo A' }}
        countries={countries}
        onOwnershipChange={onOwnershipChange}
        onScopeChange={onScopeChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Faltantes' }));

    expect(onOwnershipChange).toHaveBeenCalledWith('missing');
    expect(onScopeChange).not.toHaveBeenCalled();
  });

  it('notifies country scope change', () => {
    const onScopeChange = vi.fn();
    render(
      <FilterChips
        ownershipFilter="missing"
        scopeFilter={{ kind: 'none' }}
        countries={countries}
        onOwnershipChange={vi.fn()}
        onScopeChange={onScopeChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'México' }));

    expect(onScopeChange).toHaveBeenCalledWith({ kind: 'country', id: 'MEX' });
  });

  it('notifies group scope change', () => {
    const onScopeChange = vi.fn();
    render(
      <FilterChips
        ownershipFilter="all"
        scopeFilter={{ kind: 'country', id: 'MEX' }}
        countries={countries}
        onOwnershipChange={vi.fn()}
        onScopeChange={onScopeChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Grupo A' }));

    expect(onScopeChange).toHaveBeenCalledWith({ kind: 'group', name: 'Grupo A' });
  });

  it('toggles off an active group scope by selecting it again', () => {
    const onScopeChange = vi.fn();
    render(
      <FilterChips
        ownershipFilter="all"
        scopeFilter={{ kind: 'group', name: 'Grupo A' }}
        countries={countries}
        onOwnershipChange={vi.fn()}
        onScopeChange={onScopeChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Grupo A' }));

    expect(onScopeChange).toHaveBeenCalledWith({ kind: 'group', name: 'Grupo A' });
  });
});
