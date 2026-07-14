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
    filter: 'all',
    search: '',
    loading: false,
    error: Maybe.none(),
    loadCatalog: vi.fn(),
    loadStickers: vi.fn(),
    setFilter: vi.fn(),
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
    expect(status).toHaveTextContent('Loading stickers…');
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

    expect(screen.getByLabelText('Search by number or name')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
  });

  it('collapses all visible section rows when Collapse all is activated', () => {
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

    fireEvent.click(screen.getByRole('button', { name: 'Collapse all' }));

    expect(screen.queryByText('FWC Sticker')).not.toBeInTheDocument();
    expect(screen.queryByText('México Player')).not.toBeInTheDocument();
  });

  it('expands all section rows after Collapse all when Expand all is activated', () => {
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

    fireEvent.click(screen.getByRole('button', { name: 'Collapse all' }));
    fireEvent.click(screen.getByRole('button', { name: 'Expand all' }));

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

    expect(screen.getByRole('button', { name: 'Register stickers by code' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Register stickers by code' })).toHaveTextContent(
      'Add codes',
    );
    expect(screen.queryByLabelText('Register by code')).not.toBeInTheDocument();
  });

  it('opens the registration modal from the dashboard action', () => {
    render(
      <StickerListPage
        catalogHook={createCatalogHook({ stickers: Maybe.some([]) })}
        collectionHook={createCollectionHook()}
        isAuthenticated
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Register stickers by code' }));

    expect(screen.getByRole('dialog', { name: 'Register stickers' })).toBeInTheDocument();
    expect(screen.getByLabelText('Register by code')).toBeInTheDocument();
  });

  it('hides register stickers action when unauthenticated', () => {
    render(
      <StickerListPage
        catalogHook={createCatalogHook({ stickers: Maybe.some([]) })}
        collectionHook={createCollectionHook()}
        isAuthenticated={false}
      />,
    );

    expect(screen.queryByRole('button', { name: 'Register stickers by code' })).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Register by code')).not.toBeInTheDocument();
  });

  it('shows only collected stickers when the collected filter is active', () => {
    render(
      <StickerListPage
        catalogHook={createCatalogHook({
          filter: 'collected',
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

  it('shows only duplicate stickers when the duplicates filter is active', () => {
    render(
      <StickerListPage
        catalogHook={createCatalogHook({
          filter: 'duplicates',
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
