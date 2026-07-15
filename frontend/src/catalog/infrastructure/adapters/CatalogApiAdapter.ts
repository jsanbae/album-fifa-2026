import { API_ROUTES } from '@album/common';
import type { HttpClient } from '../../../shared/infrastructure/HttpClient.js';

export interface StickerDTO {
  id: string;
  name: string;
  countryId: string | null;
  group: string;
  countryName: string | null;
  isoCode: string | null;
  count?: number;
}

export interface CountryDTO {
  id: string;
  name: string;
  isoCode: string;
  groupId: string;
}

export interface GroupDTO {
  id: string;
  name: string;
}

export interface FetchStickersParams {
  group?: string;
  country?: string;
  search?: string;
}

export class CatalogApiAdapter {
  constructor(private readonly httpClient: HttpClient) {}

  fetchStickers(params?: FetchStickersParams): Promise<StickerDTO[]> {
    return this.httpClient.get<StickerDTO[]>(API_ROUTES.catalog.stickers, {
      group: params?.group,
      country: params?.country,
      search: params?.search,
    });
  }

  fetchCountries(): Promise<CountryDTO[]> {
    return this.httpClient.get<CountryDTO[]>(API_ROUTES.catalog.countries);
  }

  fetchGroups(): Promise<GroupDTO[]> {
    return this.httpClient.get<GroupDTO[]>(API_ROUTES.catalog.groups);
  }
}
