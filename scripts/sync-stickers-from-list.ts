import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { GROUP_DISPLAY_ORDER } from '../common/src/infrastructure/api-routes.ts';

const ROOT = resolve(import.meta.dirname, '..');
const LIST_PATH = resolve(ROOT, 'docs/# Stickers List.md');
const STICKERS_PATH = resolve(ROOT, 'data/stickers.json');
const EXPECTED_TOTAL = 994;

interface StickerRow {
  id: string;
  name: string;
  countryId: string | null;
  group: string;
}

interface ParsedSticker {
  id: string;
  name: string;
  prefix: string;
}

function normalizeName(raw: string): string {
  let name = raw.replace(/\s+/g, ' ').trim();
  name = name.replace(/\s*\(([^)]*)\)\s*$/, (match, inner: string) => {
    // Keep historical FWC qualifiers that include a year or "Host Country"
    if (/\d{4}|Host Country/i.test(inner)) {
      return match;
    }
    return '';
  });
  return name.replace(/\s+/g, ' ').trim();
}

function parseStickersList(markdown: string): ParsedSticker[] {
  const stickers: ParsedSticker[] = [];

  for (const line of markdown.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || /^\d+ stickers?$/i.test(trimmed)) {
      continue;
    }
    if (/^PARALLEL:/i.test(trimmed)) {
      continue;
    }

    const match00 = trimmed.match(/^(00)\.\s+(.+)$/);
    if (match00) {
      stickers.push({ id: '00', prefix: '00', name: normalizeName(match00[2]) });
      continue;
    }

    const matchHyphen = trimmed.match(/^([A-Z]{2,3})-(\d+)\.\s+(.+)$/);
    if (matchHyphen) {
      stickers.push({
        id: `${matchHyphen[1]}${matchHyphen[2]}`,
        prefix: matchHyphen[1],
        name: normalizeName(matchHyphen[3]),
      });
      continue;
    }

    const matchCc = trimmed.match(/^(CC)(\d+)\.\s+(.+)$/);
    if (matchCc) {
      stickers.push({
        id: `${matchCc[1]}${matchCc[2]}`,
        prefix: matchCc[1],
        name: normalizeName(matchCc[3]),
      });
    }
  }

  return stickers;
}

function countryIdForPrefix(prefix: string): string | null {
  if (prefix === '00' || prefix === 'FWC' || prefix === 'CC') {
    return null;
  }
  return prefix;
}

function groupForSticker(
  prefix: string,
  countryId: string | null,
  countryToGroup: Map<string, string>,
): string {
  if (prefix === '00' || prefix === 'FWC') {
    return 'FIFA World Cup';
  }
  if (prefix === 'CC') {
    return 'Coca-Cola';
  }
  if (!countryId) {
    throw new Error(`Missing countryId for prefix ${prefix}`);
  }
  const group = countryToGroup.get(countryId);
  if (!group) {
    throw new Error(`No tournament group found for country ${countryId}`);
  }
  return group;
}

function buildCountryToGroup(existing: StickerRow[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const sticker of existing) {
    if (!sticker.countryId) {
      continue;
    }
    const previous = map.get(sticker.countryId);
    if (previous && previous !== sticker.group) {
      throw new Error(
        `Country ${sticker.countryId} maps to multiple groups: ${previous} and ${sticker.group}`,
      );
    }
    map.set(sticker.countryId, sticker.group);
  }
  return map;
}

function countryOrder(existing: StickerRow[]): string[] {
  const seen = new Set<string>();
  const order: string[] = [];
  for (const sticker of existing) {
    if (!sticker.countryId || seen.has(sticker.countryId)) {
      continue;
    }
    seen.add(sticker.countryId);
    order.push(sticker.countryId);
  }
  return order;
}

function sortKey(
  sticker: StickerRow,
  countryOrderIndex: Map<string, number>,
): [number, number, number] {
  const groupIndex = GROUP_DISPLAY_ORDER.indexOf(
    sticker.group as (typeof GROUP_DISPLAY_ORDER)[number],
  );
  if (groupIndex < 0) {
    throw new Error(`Unknown group ${sticker.group}`);
  }

  if (sticker.group === 'FIFA World Cup') {
    if (sticker.id === '00') {
      return [groupIndex, 0, 0];
    }
    const num = Number(sticker.id.replace('FWC', ''));
    return [groupIndex, 1, num];
  }

  if (sticker.group === 'Coca-Cola') {
    const num = Number(sticker.id.replace('CC', ''));
    return [groupIndex, 0, num];
  }

  const countryIndex = countryOrderIndex.get(sticker.countryId ?? '') ?? 999;
  const num = Number(sticker.id.replace(/^[A-Z]+/, ''));
  return [groupIndex, countryIndex, num];
}

function main(): void {
  const markdown = readFileSync(LIST_PATH, 'utf8');
  const existing = (
    JSON.parse(readFileSync(STICKERS_PATH, 'utf8')) as { stickers: StickerRow[] }
  ).stickers;

  const parsed = parseStickersList(markdown);
  const uniqueIds = new Set(parsed.map((s) => s.id));
  if (uniqueIds.size !== parsed.length) {
    const duplicates = parsed
      .map((s) => s.id)
      .filter((id, index, all) => all.indexOf(id) !== index);
    throw new Error(`Duplicate sticker ids in list: ${[...new Set(duplicates)].join(', ')}`);
  }

  const countryToGroup = buildCountryToGroup(existing);
  const countries = countryOrder(existing);
  const countryOrderIndex = new Map(countries.map((id, index) => [id, index]));

  const stickers: StickerRow[] = parsed.map((item) => {
    const countryId = countryIdForPrefix(item.prefix);
    return {
      id: item.id,
      name: item.name,
      countryId,
      group: groupForSticker(item.prefix, countryId, countryToGroup),
    };
  });

  stickers.sort((a, b) => {
    const ka = sortKey(a, countryOrderIndex);
    const kb = sortKey(b, countryOrderIndex);
    for (let i = 0; i < 3; i++) {
      if (ka[i] !== kb[i]) {
        return ka[i] - kb[i];
      }
    }
    return a.id.localeCompare(b.id);
  });

  if (stickers.length !== EXPECTED_TOTAL) {
    throw new Error(`Expected ${EXPECTED_TOTAL} stickers, got ${stickers.length}`);
  }

  writeFileSync(STICKERS_PATH, `${JSON.stringify({ stickers }, null, 4)}\n`, 'utf8');
  console.log(`Wrote ${stickers.length} stickers to data/stickers.json`);
}

main();
