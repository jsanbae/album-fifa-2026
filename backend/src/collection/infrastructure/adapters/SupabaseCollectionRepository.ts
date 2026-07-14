import type { SupabaseClient } from '@supabase/supabase-js';
import { DomainError, Maybe } from '@album/common';
import { StickerNumber } from '../../../catalog/domain/entities/StickerNumber.js';
import { CollectionEntry } from '../../domain/entities/CollectionEntry.js';
import { UserId } from '../../domain/entities/UserId.js';
import type { CollectionRepository } from '../../domain/repositories/CollectionRepository.js';

interface CollectionRow {
  user_id: string;
  sticker_id: string;
  count: number;
}

export class SupabaseCollectionRepository implements CollectionRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async findByUserId(userId: UserId): Promise<CollectionEntry[]> {
    const { data, error } = await this.supabase
      .from('collection_entries')
      .select('user_id, sticker_id, count')
      .eq('user_id', userId.value);

    if (error) {
      throw DomainError.createOther(`Failed to fetch collection: ${error.message}`);
    }

    return (data as CollectionRow[]).map((row) =>
      CollectionEntry.create(
        UserId.create(row.user_id),
        StickerNumber.create(row.sticker_id),
        row.count,
      ),
    );
  }

  async findByUserIdAndStickerId(
    userId: UserId,
    stickerId: StickerNumber,
  ): Promise<Maybe<CollectionEntry>> {
    const { data, error } = await this.supabase
      .from('collection_entries')
      .select('user_id, sticker_id, count')
      .eq('user_id', userId.value)
      .eq('sticker_id', stickerId.value)
      .maybeSingle();

    if (error) {
      throw DomainError.createOther(`Failed to fetch collection entry: ${error.message}`);
    }

    if (!data) {
      return Maybe.none();
    }

    const row = data as CollectionRow;
    return Maybe.some(
      CollectionEntry.create(
        UserId.create(row.user_id),
        StickerNumber.create(row.sticker_id),
        row.count,
      ),
    );
  }

  async save(entry: CollectionEntry): Promise<void> {
    const { error } = await this.supabase.from('collection_entries').upsert({
      user_id: entry.userId.value,
      sticker_id: entry.stickerId.value,
      count: entry.getCount(),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      throw DomainError.createOther(`Failed to save collection entry: ${error.message}`);
    }
  }
}
