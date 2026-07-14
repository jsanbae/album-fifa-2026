## ADDED Requirements

### Requirement: Single album

The catalog SHALL represent exactly one album with id `fifa-2026` (FIFA World Cup 2026 Panini).

#### Scenario: Album metadata available

- **WHEN** the catalog is loaded
- **THEN** the album `fifa-2026` exists with a display name

### Requirement: Sticker reference data from JSON

The catalog SHALL load sticker reference data from `data/stickers.json` containing 990 stickers.

#### Scenario: All stickers loaded

- **WHEN** the catalog is seeded from `data/stickers.json`
- **THEN** exactly 990 stickers are available with unique string ids

#### Scenario: Sticker fields preserved

- **WHEN** a sticker is retrieved by id
- **THEN** it returns `id`, `name`, `countryId` (nullable), and `group` matching the source JSON

### Requirement: Group sections

The catalog SHALL expose 14 groups/sections: `FIFA World Cup`, `Grupo A` through `Grupo L`, and `Coca-Cola`.

#### Scenario: Group sticker counts

- **WHEN** stickers are counted per group
- **THEN** FIFA World Cup has 17, Coca-Cola has 14, Grupo K has 79, and all other tournament groups have 80

### Requirement: Country reference data

The catalog SHALL load 48 countries from `data/countries.json` with FIFA `id`, Spanish `name`, and `isoCode` for flag rendering.

#### Scenario: Country linked to stickers

- **WHEN** a sticker has a non-null `countryId`
- **THEN** the catalog returns the matching country with `name` and `isoCode`

#### Scenario: Special stickers have no country

- **WHEN** a sticker has `countryId` null (FWC, CC, or `00`)
- **THEN** no country is associated with that sticker

### Requirement: Country belongs to one tournament group

Each country SHALL belong to exactly one tournament group (`Grupo A`–`Grupo L`), derived from sticker data.

#### Scenario: Consistent country-group mapping

- **WHEN** any two stickers share the same `countryId`
- **THEN** they belong to the same tournament group

### Requirement: List stickers use case

The catalog SHALL provide a use case to list all stickers, optionally filtered by group and searchable by sticker id prefix.

#### Scenario: Filter by group

- **WHEN** listing stickers with group filter `Grupo A`
- **THEN** only stickers with `group` equal to `Grupo A` are returned

#### Scenario: Search by id prefix

- **WHEN** listing stickers with search `MEX`
- **THEN** stickers whose id starts with `MEX` are returned

### Requirement: List countries use case

The catalog SHALL provide a use case to list all countries with id, name, isoCode, and groupId.

#### Scenario: All countries listed

- **WHEN** countries are listed
- **THEN** exactly 48 countries are returned

### Requirement: Catalog HTTP API

The backend SHALL expose public read endpoints for catalog data.

#### Scenario: GET stickers

- **WHEN** `GET /api/catalog/stickers` is called
- **THEN** the response includes all stickers with country name and isoCode when applicable

#### Scenario: GET countries

- **WHEN** `GET /api/catalog/countries` is called
- **THEN** the response includes all 48 countries

### Requirement: Catalog seed validation

The catalog seeder SHALL validate JSON invariants before persisting: unique ids, country-group consistency, and null countryId only for non-tournament groups.

#### Scenario: Invalid JSON rejected

- **WHEN** `data/stickers.json` is not valid JSON
- **THEN** the seeder fails with a descriptive error

### Requirement: InMemory repository for tests

The catalog domain SHALL define a `CatalogRepository` port with an InMemory implementation for unit tests without a database.

#### Scenario: InMemory catalog in tests

- **WHEN** unit tests run catalog use cases
- **THEN** they use InMemoryCatalogRepository without external dependencies
