import { createClient } from '@supabase/supabase-js';
import { loadRootEnv } from '../src/shared/loadRootEnv.js';

loadRootEnv();
import { ALBUM_ID } from '@album/common';
import { JsonFileCatalogRepository } from '../src/catalog/infrastructure/adapters/JsonFileCatalogRepository.js';
import { readSupabaseEnv, resolveSupabaseApiKey } from '../src/shared/supabaseEnv.js';

async function main(): Promise<void> {
  const supabaseConfig = readSupabaseEnv();
  const supabaseUrl = supabaseConfig.url;
  const key = resolveSupabaseApiKey(supabaseConfig, true);

  if (!supabaseUrl || !key) {
    console.error('Missing SUPABASE_URL and API key. Set env vars before seeding.');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, key);
  const catalog = JsonFileCatalogRepository.create();
  const album = catalog.getAlbum();
  const groups = await catalog.findAllGroups();
  const countries = await catalog.findAllCountries();
  const stickers = await catalog.findAllStickers();

  const { error: albumError } = await supabase
    .from('albums')
    .upsert({ id: album.id, name: album.name });
  if (albumError) {
    throw albumError;
  }

  const { error: groupsError } = await supabase.from('groups').upsert(
    groups.map((group) => ({
      id: group.id,
      album_id: group.albumId,
      name: group.name,
    })),
  );
  if (groupsError) {
    throw groupsError;
  }

  const { error: countriesError } = await supabase.from('countries').upsert(
    countries.map((country) => ({
      id: country.id,
      album_id: country.albumId,
      group_id: country.groupId,
      name: country.name,
      iso_code: country.isoCode,
    })),
  );
  if (countriesError) {
    throw countriesError;
  }

  const batchSize = 100;
  for (let index = 0; index < stickers.length; index += batchSize) {
    const batch = stickers.slice(index, index + batchSize).map((sticker) => ({
      id: sticker.id.value,
      album_id: ALBUM_ID,
      name: sticker.name,
      country_id: sticker.countryId,
      group_id: sticker.groupId,
    }));

    const { error: stickersError } = await supabase.from('stickers').upsert(batch);
    if (stickersError) {
      throw stickersError;
    }
  }

  console.log(
    `Seeded catalog: 1 album, ${groups.length} groups, ${countries.length} countries, ${stickers.length} stickers`,
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Catalog seed failed: ${message}`);
  process.exit(1);
});
