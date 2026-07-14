CREATE TABLE IF NOT EXISTS collection_entries (
  user_id TEXT NOT NULL,
  sticker_id TEXT NOT NULL REFERENCES stickers(id),
  count INTEGER NOT NULL DEFAULT 0 CHECK (count >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, sticker_id)
);

CREATE INDEX IF NOT EXISTS idx_collection_entries_user_id ON collection_entries(user_id);
