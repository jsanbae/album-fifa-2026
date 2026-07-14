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
