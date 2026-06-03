# figjam-paint-swatcher

## Unreleased

### Infrastructure
- Refactored to SQLite database backend with normalized schema (brands, collections, swatches)
- Added brand `shortname` field for concise plugin display (e.g., "F&B" instead of "Farrow & Ball")
- Automated build process: database exported to static JSON at compile time, bundled into plugin
- Migrated all 909 existing swatches from 6 TS data files to seed JSON
- Updated seeding pipeline to support future scraping workflows
- See [docs/DATABASE.md](docs/DATABASE.md) and [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for details

## 1.2.0 / 2025-02-11

- Add Edward Bulmer

## 1.1.0 / 2024-08-15

- Remove custom sizing from shape
- Add companies:
  - Little Greene
  - Paint & Paper Library

## 1.0.0 / 2024-08-14

Initial release
