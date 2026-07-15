import { Maybe } from '@album/common';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { StickerListPage } from '../src/catalog/infrastructure/ui/pages/StickerListPage.js';
import type { useCatalog } from '../src/catalog/infrastructure/ui/store/useCatalog.hook.js';
import type { useCollection } from '../src/collection/infrastructure/ui/store/useCollection.hook.js';

function createCatalogHook(
  overrides: Partial<ReturnType<typeof useCatalog>> = {},
): ReturnType<typeof useCatalog> {
  return {
    stickers: Maybe.none(),
    countries: Maybe.none(),
    groups: Maybe.none(),
    ownershipFilter: 'all',
    scopeFilter: { kind: 'none' },
    search: '',
    loading: false,
    error: Maybe.none(),
    loadCatalog: vi.fn(),
    loadStickers: vi.fn(),
    setOwnershipFilter: vi.fn(),
    setScopeFilter: vi.fn(),
    clearScopeFilter: vi.fn(),
    setSearch: vi.fn(),
    updateStickerCount: vi.fn(),
    ...overrides,
  };
}

function createCollectionHook(
  overrides: Partial<ReturnType<typeof useCollection>> = {},
): ReturnType<typeof useCollection> {
  return {
    counts: {},
    progress: Maybe.none(),
    loading: false,
    error: Maybe.none(),
    getCount: () => 0,
    increment: vi.fn(),
    decrement: vi.fn(),
    registerByCode: vi.fn(),
    reset: vi.fn(),
    loadCollection: vi.fn(),
    ...overrides,
  };
}

describe('The StickerListPage', () => {
  it('exposes the collection dashboard as the main landmark', () => {
    render(
      <StickerListPage
        catalogHook={createCatalogHook({ stickers: Maybe.some([]) })}
        collectionHook={createCollectionHook()}
        isAuthenticated={false}
      />,
    );

    expect(screen.getByRole('main', { name: 'Album FIFA 2026' })).toBeInTheDocument();
  });

  it('shows the FIFA World Cup 2026 tournament logo in the header', () => {
    render(
      <StickerListPage
        catalogHook={createCatalogHook({ stickers: Maybe.some([]) })}
        collectionHook={createCollectionHook()}
        isAuthenticated={false}
      />,
    );

    expect(screen.getByRole('img', { name: 'FIFA World Cup 2026' })).toBeInTheDocument();
  });

  it('announces sticker loading to assistive technologies', () => {
    render(
      <StickerListPage
        catalogHook={createCatalogHook({ loading: true })}
        collectionHook={createCollectionHook()}
        isAuthenticated={false}
      />,
    );

    const status = screen.getByRole('status');

    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(status).toHaveTextContent('Cargando cromos…');
  });

  it('shows loading inside the search field while refetching stickers', () => {
    render(
      <StickerListPage
        catalogHook={createCatalogHook({
          loading: true,
          stickers: Maybe.some([
            {
              id: 'MEX1',
              name: 'Test',
              group: 'Grupo A',
              countryId: 'MEX',
              countryName: 'México',
              isoCode: 'mx',
            },
          ]),
        })}
        collectionHook={createCollectionHook()}
        isAuthenticated={false}
      />,
    );

    expect(screen.getByLabelText('Buscar por número o nombre')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('status', { name: 'Cargando' })).toBeInTheDocument();
  });

  it('collapses all visible section rows when Contraer todo is activated', () => {
    render(
      <StickerListPage
        catalogHook={createCatalogHook({
          stickers: Maybe.some([
            {
              id: 'FWC1',
              name: 'FWC Sticker',
              group: 'FIFA World Cup',
              countryId: null,
              countryName: null,
              isoCode: null,
            },
            {
              id: 'MEX1',
              name: 'México Player',
              group: 'Grupo A',
              countryId: 'MEX',
              countryName: 'México',
              isoCode: 'mx',
            },
          ]),
        })}
        collectionHook={createCollectionHook()}
        isAuthenticated={false}
      />,
    );

    expect(screen.getByText('FWC Sticker')).toBeInTheDocument();
    expect(screen.getByText('México Player')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Contraer todo' }));

    expect(screen.queryByText('FWC Sticker')).not.toBeInTheDocument();
    expect(screen.queryByText('México Player')).not.toBeInTheDocument();
  });

  it('expands all section rows after Contraer todo when Expandir todo is activated', () => {
    render(
      <StickerListPage
        catalogHook={createCatalogHook({
          stickers: Maybe.some([
            {
              id: 'FWC1',
              name: 'FWC Sticker',
              group: 'FIFA World Cup',
              countryId: null,
              countryName: null,
              isoCode: null,
            },
            {
              id: 'MEX1',
              name: 'México Player',
              group: 'Grupo A',
              countryId: 'MEX',
              countryName: 'México',
              isoCode: 'mx',
            },
          ]),
        })}
        collectionHook={createCollectionHook()}
        isAuthenticated={false}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Contraer todo' }));
    fireEvent.click(screen.getByRole('button', { name: 'Expandir todo' }));

    expect(screen.getByText('FWC Sticker')).toBeInTheDocument();
    expect(screen.getByText('México Player')).toBeInTheDocument();
  });

  it('shows register stickers action when authenticated', () => {
    render(
      <StickerListPage
        catalogHook={createCatalogHook({ stickers: Maybe.some([]) })}
        collectionHook={createCollectionHook()}
        isAuthenticated
      />,
    );

    expect(screen.getByRole('button', { name: 'Registrar cromos por código' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Registrar cromos por código' })).toHaveTextContent(
      'Agregar códigos',
    );
    expect(screen.queryByLabelText('Registrar por código')).not.toBeInTheDocument();
  });

  it('opens the registration modal from the dashboard action', () => {
    render(
      <StickerListPage
        catalogHook={createCatalogHook({ stickers: Maybe.some([]) })}
        collectionHook={createCollectionHook()}
        isAuthenticated
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Registrar cromos por código' }));

    expect(screen.getByRole('dialog', { name: 'Registrar cromos' })).toBeInTheDocument();
    expect(screen.getByLabelText('Registrar por código')).toBeInTheDocument();
  });

  it('hides register stickers action when unauthenticated', () => {
    render(
      <StickerListPage
        catalogHook={createCatalogHook({ stickers: Maybe.some([]) })}
        collectionHook={createCollectionHook()}
        isAuthenticated={false}
      />,
    );

    expect(screen.queryByRole('button', { name: 'Registrar cromos por código' })).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Registrar por código')).not.toBeInTheDocument();
  });

  it('shows only collected stickers when the collected filter is active', () => {
    render(
      <StickerListPage
        catalogHook={createCatalogHook({
          ownershipFilter: 'collected',
          stickers: Maybe.some([
            {
              id: 'MEX1',
              name: 'MEX Player 1',
              group: 'Grupo A',
              countryId: 'MEX',
              countryName: 'México',
              isoCode: 'mx',
            },
            {
              id: 'MEX2',
              name: 'MEX Player 2',
              group: 'Grupo A',
              countryId: 'MEX',
              countryName: 'México',
              isoCode: 'mx',
            },
            {
              id: 'FWC1',
              name: 'FWC Sticker',
              group: 'FIFA World Cup',
              countryId: null,
              countryName: null,
              isoCode: null,
            },
          ]),
        })}
        collectionHook={createCollectionHook({
          counts: { MEX1: 1, FWC1: 2 },
          getCount: (stickerId) => (stickerId === 'MEX1' ? 1 : stickerId === 'FWC1' ? 2 : 0),
        })}
        isAuthenticated
      />,
    );

    expect(screen.getByText('MEX Player 1')).toBeInTheDocument();
    expect(screen.getByText('FWC Sticker')).toBeInTheDocument();
    expect(screen.queryByText('MEX Player 2')).not.toBeInTheDocument();
  });

  it('applies ownership filter with country-scoped sticker list', () => {
    render(
      <StickerListPage
        catalogHook={createCatalogHook({
          ownershipFilter: 'missing',
          scopeFilter: { kind: 'country', id: 'MEX' },
          countries: Maybe.some([
            { id: 'MEX', name: 'México', isoCode: 'MX', groupId: 'A' },
          ]),
          stickers: Maybe.some([
            {
              id: 'MEX1',
              name: 'MEX Player 1',
              group: 'Grupo A',
              countryId: 'MEX',
              countryName: 'México',
              isoCode: 'mx',
            },
            {
              id: 'MEX2',
              name: 'MEX Player 2',
              group: 'Grupo A',
              countryId: 'MEX',
              countryName: 'México',
              isoCode: 'mx',
            },
          ]),
        })}
        collectionHook={createCollectionHook({
          counts: { MEX1: 1 },
          getCount: (stickerId) => (stickerId === 'MEX1' ? 1 : 0),
        })}
        isAuthenticated
      />,
    );

    expect(screen.getByText('MEX Player 2')).toBeInTheDocument();
    expect(screen.queryByText('MEX Player 1')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Quitar filtro México' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Quitar filtro Faltantes' })).toBeInTheDocument();
  });

  it('shows only duplicate stickers when the duplicates filter is active', () => {
    render(
      <StickerListPage
        catalogHook={createCatalogHook({
          ownershipFilter: 'duplicates',
          stickers: Maybe.some([
            {
              id: 'MEX1',
              name: 'MEX Player 1',
              group: 'Grupo A',
              countryId: 'MEX',
              countryName: 'México',
              isoCode: 'mx',
            },
            {
              id: 'MEX2',
              name: 'MEX Player 2',
              group: 'Grupo A',
              countryId: 'MEX',
              countryName: 'México',
              isoCode: 'mx',
            },
            {
              id: 'FWC1',
              name: 'FWC Sticker',
              group: 'FIFA World Cup',
              countryId: null,
              countryName: null,
              isoCode: null,
            },
          ]),
        })}
        collectionHook={createCollectionHook({
          counts: { MEX1: 1, FWC1: 2 },
          getCount: (stickerId) => (stickerId === 'MEX1' ? 1 : stickerId === 'FWC1' ? 2 : 0),
        })}
        isAuthenticated
      />,
    );

    expect(screen.getByText('FWC Sticker')).toBeInTheDocument();
    expect(screen.queryByText('MEX Player 1')).not.toBeInTheDocument();
    expect(screen.queryByText('MEX Player 2')).not.toBeInTheDocument();
  });
});
