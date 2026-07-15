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

export interface ListStickersInput {
  group?: string;
  country?: string;
  search?: string;
}
