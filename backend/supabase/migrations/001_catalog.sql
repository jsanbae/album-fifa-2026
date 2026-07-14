CREATE TABLE IF NOT EXISTS albums (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS groups (
  id TEXT PRIMARY KEY,
  album_id TEXT NOT NULL REFERENCES albums(id),
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS countries (
  id TEXT PRIMARY KEY,
  album_id TEXT NOT NULL REFERENCES albums(id),
  group_id TEXT NOT NULL REFERENCES groups(id),
  name TEXT NOT NULL,
  iso_code TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS stickers (
  id TEXT PRIMARY KEY,
  album_id TEXT NOT NULL REFERENCES albums(id),
  name TEXT NOT NULL,
  country_id TEXT REFERENCES countries(id),
  group_id TEXT NOT NULL REFERENCES groups(id)
);

CREATE INDEX IF NOT EXISTS idx_stickers_album_id ON stickers(album_id);
CREATE INDEX IF NOT EXISTS idx_stickers_group_id ON stickers(group_id);
CREATE INDEX IF NOT EXISTS idx_countries_album_id ON countries(album_id);
