import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FilterSheet } from '../src/catalog/infrastructure/ui/components/FilterSheet.js';
import type { CountryDTO } from '../src/catalog/infrastructure/adapters/CatalogApiAdapter.js';

const countries: CountryDTO[] = [
  { id: 'USA', name: 'Estados Unidos', isoCode: 'US', groupId: 'A' },
  { id: 'MEX', name: 'México', isoCode: 'MX', groupId: 'A' },
  { id: 'ARG', name: 'Argentina', isoCode: 'AR', groupId: 'A' },
];

describe('FilterSheet', () => {
  it('renders Grupos and Países tabs', () => {
    render(
      <FilterSheet
        open
        scopeFilter={{ kind: 'none' }}
        countries={countries}
        onClose={vi.fn()}
        onScopeChange={vi.fn()}
      />,
    );

    expect(screen.getByRole('tab', { name: 'Grupos' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Países' })).toBeInTheDocument();
  });

  it('applies group scope and closes the sheet', () => {
    const onScopeChange = vi.fn();
    const onClose = vi.fn();
    render(
      <FilterSheet
        open
        scopeFilter={{ kind: 'none' }}
        countries={countries}
        onClose={onClose}
        onScopeChange={onScopeChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Grupo A' }));

    expect(onScopeChange).toHaveBeenCalledWith({ kind: 'group', name: 'Grupo A' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('filters countries by search query', () => {
    render(
      <FilterSheet
        open
        scopeFilter={{ kind: 'none' }}
        countries={countries}
        onClose={vi.fn()}
        onScopeChange={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('tab', { name: 'Países' }));
    fireEvent.change(screen.getByLabelText('Buscar país'), { target: { value: 'mex' } });

    const paises = screen.getByRole('group', { name: 'Países' });
    const labels = within(paises)
      .getAllByRole('button')
      .map((button) => button.getAttribute('aria-label'));

    expect(labels).toEqual(['México']);
  });

  it('applies country scope and closes the sheet', () => {
    const onScopeChange = vi.fn();
    const onClose = vi.fn();
    render(
      <FilterSheet
        open
        scopeFilter={{ kind: 'none' }}
        countries={countries}
        onClose={onClose}
        onScopeChange={onScopeChange}
      />,
    );

    fireEvent.click(screen.getByRole('tab', { name: 'Países' }));
    fireEvent.click(screen.getByRole('button', { name: 'México' }));

    expect(onScopeChange).toHaveBeenCalledWith({ kind: 'country', id: 'MEX' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
