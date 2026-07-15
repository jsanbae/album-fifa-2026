import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ActiveFilterPills } from '../src/catalog/infrastructure/ui/components/ActiveFilterPills.js';
import type { CountryDTO } from '../src/catalog/infrastructure/adapters/CatalogApiAdapter.js';

const countries: CountryDTO[] = [
  { id: 'MEX', name: 'México', isoCode: 'MX', groupId: 'A' },
];

describe('ActiveFilterPills', () => {
  it('hides when filters are default', () => {
    const { container } = render(
      <ActiveFilterPills
        ownershipFilter="all"
        scopeFilter={{ kind: 'none' }}
        countries={countries}
        onClearOwnership={vi.fn()}
        onClearScope={vi.fn()}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('shows ownership and scope pills when active', () => {
    render(
      <ActiveFilterPills
        ownershipFilter="missing"
        scopeFilter={{ kind: 'country', id: 'MEX' }}
        countries={countries}
        onClearOwnership={vi.fn()}
        onClearScope={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'Quitar filtro Faltantes' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Quitar filtro México' })).toBeInTheDocument();
  });

  it('clears ownership when ownership pill is dismissed', () => {
    const onClearOwnership = vi.fn();
    render(
      <ActiveFilterPills
        ownershipFilter="missing"
        scopeFilter={{ kind: 'none' }}
        countries={countries}
        onClearOwnership={onClearOwnership}
        onClearScope={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Quitar filtro Faltantes' }));

    expect(onClearOwnership).toHaveBeenCalledTimes(1);
  });

  it('clears scope when scope pill is dismissed', () => {
    const onClearScope = vi.fn();
    render(
      <ActiveFilterPills
        ownershipFilter="all"
        scopeFilter={{ kind: 'country', id: 'MEX' }}
        countries={countries}
        onClearOwnership={vi.fn()}
        onClearScope={onClearScope}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Quitar filtro México' }));

    expect(onClearScope).toHaveBeenCalledTimes(1);
  });

  it('clears scope from the clear scope action', () => {
    const onClearScope = vi.fn();
    render(
      <ActiveFilterPills
        ownershipFilter="all"
        scopeFilter={{ kind: 'group', name: 'Grupo A' }}
        countries={countries}
        onClearOwnership={vi.fn()}
        onClearScope={onClearScope}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Limpiar alcance' }));

    expect(onClearScope).toHaveBeenCalledTimes(1);
  });
});
