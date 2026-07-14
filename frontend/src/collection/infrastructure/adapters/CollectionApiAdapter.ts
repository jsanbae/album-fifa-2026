import { API_ROUTES } from '@album/common';
import type { HttpClient } from '../../../shared/infrastructure/HttpClient.js';

export interface CollectionEntryDTO {
  stickerId: string;
  count: number;
}

export interface CollectionProgressDTO {
  owned: number;
  total: number;
  percentage: number;
}

export interface RegisterStickersByCodeResultDTO {
  updated: CollectionEntryDTO[];
  unknownCodes: string[];
}

export class CollectionApiAdapter {
  constructor(private readonly httpClient: HttpClient) {}

  fetchCollection(): Promise<CollectionEntryDTO[]> {
    return this.httpClient.get<CollectionEntryDTO[]>(API_ROUTES.collection.root);
  }

  fetchProgress(): Promise<CollectionProgressDTO> {
    return this.httpClient.get<CollectionProgressDTO>(API_ROUTES.collection.progress);
  }

  increment(stickerId: string): Promise<CollectionEntryDTO> {
    return this.httpClient.post<CollectionEntryDTO>(API_ROUTES.collection.increment(stickerId));
  }

  decrement(stickerId: string): Promise<CollectionEntryDTO> {
    return this.httpClient.post<CollectionEntryDTO>(API_ROUTES.collection.decrement(stickerId));
  }

  setCount(stickerId: string, count: number): Promise<CollectionEntryDTO> {
    return this.httpClient.put<CollectionEntryDTO>(API_ROUTES.collection.sticker(stickerId), { count });
  }

  registerByCode(codes: string): Promise<RegisterStickersByCodeResultDTO> {
    return this.httpClient.post<RegisterStickersByCodeResultDTO>(API_ROUTES.collection.register, {
      codes,
    });
  }
}
