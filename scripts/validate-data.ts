import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const EXPECTED_STICKERS = 994;
const EXPECTED_COUNTRIES = 48;
const EXPECTED_GROUP_COUNTS: Record<string, number> = {
  'FIFA World Cup': 20,
  'Grupo A': 80,
  'Grupo B': 80,
  'Grupo C': 80,
  'Grupo D': 80,
  'Grupo E': 80,
  'Grupo F': 80,
  'Grupo G': 80,
  'Grupo H': 80,
  'Grupo I': 80,
  'Grupo J': 80,
  'Grupo K': 80,
  'Grupo L': 80,
  'Coca-Cola': 14,
};

interface StickerRow {
  id: string;
  name: string;
  countryId: string | null;
  group: string;
}

interface CountryRow {
  id: string;
  name: string;
  isoCode: string;
}

function loadJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, 'utf8')) as T;
}

function main(): void {
  const stickersPath = resolve(ROOT, 'data/stickers.json');
  const countriesPath = resolve(ROOT, 'data/countries.json');

  const { stickers } = loadJson<{ stickers: StickerRow[] }>(stickersPath);
  const { countries } = loadJson<{ countries: CountryRow[] }>(countriesPath);

  const errors: string[] = [];

  if (stickers.length !== EXPECTED_STICKERS) {
    errors.push(`Expected ${EXPECTED_STICKERS} stickers, got ${stickers.length}`);
  }

  const ids = stickers.map((s) => s.id);
  const uniqueIds = new Set(ids);
  if (uniqueIds.size !== ids.length) {
    errors.push('Duplicate sticker ids found');
  }

  const countryToGroup = new Map<string, string>();
  for (const sticker of stickers) {
    if (sticker.countryId) {
      const existing = countryToGroup.get(sticker.countryId);
      if (existing && existing !== sticker.group) {
        errors.push(
          `Country ${sticker.countryId} maps to multiple groups: ${existing} and ${sticker.group}`,
        );
      }
      countryToGroup.set(sticker.countryId, sticker.group);
    } else if (!['FIFA World Cup', 'Coca-Cola'].includes(sticker.group)) {
      errors.push(`Sticker ${sticker.id} has no countryId but group is ${sticker.group}`);
    }
  }

  const groupCounts = new Map<string, number>();
  for (const sticker of stickers) {
    groupCounts.set(sticker.group, (groupCounts.get(sticker.group) ?? 0) + 1);
  }
  for (const [group, expected] of Object.entries(EXPECTED_GROUP_COUNTS)) {
    const actual = groupCounts.get(group) ?? 0;
    if (actual !== expected) {
      errors.push(`Expected ${expected} stickers in ${group}, got ${actual}`);
    }
  }
  for (const group of groupCounts.keys()) {
    if (!(group in EXPECTED_GROUP_COUNTS)) {
      errors.push(`Unexpected group in stickers.json: ${group}`);
    }
  }

  if (countries.length !== EXPECTED_COUNTRIES) {
    errors.push(`Expected ${EXPECTED_COUNTRIES} countries, got ${countries.length}`);
  }

  const countryIds = new Set(countries.map((c) => c.id));
  for (const code of countryToGroup.keys()) {
    if (!countryIds.has(code)) {
      errors.push(`Sticker countryId ${code} missing from countries.json`);
    }
  }

  for (const country of countries) {
    if (!countryToGroup.has(country.id)) {
      errors.push(`Country ${country.id} in countries.json not used by any sticker`);
    }
    if (!country.name || !country.isoCode) {
      errors.push(`Country ${country.id} missing name or isoCode`);
    }
  }

  if (errors.length > 0) {
    console.error('Data validation failed:');
    for (const error of errors) {
      console.error(`  - ${error}`);
    }
    process.exit(1);
  }

  console.log(`Data validation passed: ${stickers.length} stickers, ${countries.length} countries`);
}

main();
