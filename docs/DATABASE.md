# Paint Swatcher Database Architecture

**Quick reference for working with the paint swatcher database.**

---

## Overview

Paint Swatcher uses **SQLite** (via `better-sqlite3`) as its data store. The database is initialized and seeded during the build process, then exported as static JSON for consumption by the FigJam plugin.

### Key Constraint
The FigJam plugin runs in a **browser sandbox** (not Node.js), so it cannot directly query SQLite. Instead, the build process exports all swatch data as JSON, which is bundled into `code.js`.

---

## Database Schema

### `brands` table
Metadata for paint brands.

| Column | Type | Notes |
|--------|------|-------|
| `id` | INTEGER PK | Auto-increment |
| `name` | TEXT UNIQUE | Brand name (e.g., "Farrow & Ball") |
| `slug` | TEXT UNIQUE | URL-safe identifier (e.g., "farrow-and-ball") |
| `shortname` | TEXT | Short brand label used in plugin output (e.g., "F&B") |
| `website` | TEXT | Brand website URL (optional) |
| `createdAt` | TEXT | ISO timestamp |

### `collections` table
Sub-brands or collaborative collections (optional, currently unused).

| Column | Type | Notes |
|--------|------|-------|
| `id` | INTEGER PK | Auto-increment |
| `brandId` | INTEGER FK | References `brands.id` |
| `name` | TEXT | Collection name |
| `description` | TEXT | Collection description (optional) |
| `createdAt` | TEXT | ISO timestamp |
| **Constraint** | UNIQUE | `(brandId, name)` — prevents duplicate collections per brand |

### `swatches` table
Individual paint colors.

| Column | Type | Notes |
|--------|------|-------|
| `id` | INTEGER PK | Auto-increment |
| `brandId` | INTEGER FK | References `brands.id` |
| `collectionId` | INTEGER FK | References `collections.id` (nullable) |
| `name` | TEXT | Color name (e.g., "Hague Blue") |
| `hex` | TEXT | Normalized hex code (e.g., "#0a3161"), lowercase |
| `link` | TEXT | URL to swatch page on brand website |
| `official` | INTEGER | Boolean: 1 if from official brand source |
| `dateIntroduced` | TEXT | When color was introduced (optional) |
| `dateAdded` | TEXT | When swatch was added to database |
| `deprecated` | INTEGER | Boolean: 1 if color is discontinued |
| `productCode` | TEXT | Brand product/code reference (optional) |
| `notes` | TEXT | Internal notes (optional) |
| **Constraint** | UNIQUE | `(brandId, collectionId, name)` — prevents duplicate swatches |

---

## File Structure

```
Paint Swatcher/
├── src/
│   ├── db/
│   │   ├── init.ts          # Database schema & initialization
│   │   └── queries.ts       # Query functions for seeding & build
│   ├── code.ts              # FigJam plugin (imports from JSON, not DB)
│   └── data/                # ⚠️ To be removed in Phase 2
│
├── scripts/
│   ├── seed-db.ts           # CLI seeder script
│   ├── initial-data.json    # Seed data (from migrated TS files)
│   └── scrapers/            # ⚠️ Reference only (moved to docs/ in Phase 4)
│
├── docs/
│   ├── DATABASE.md          # This file
│   └── CONTRIBUTING.md      # (Phase 4) Contributing guide
│
└── paint-swatcher.db        # SQLite database (generated at build time)
```

---

## Workflow: Adding Swatches

### Current Process (Manual)
1. Visit brand website, gather color data
2. Prepare JSON in `scripts/initial-data.json` format
3. Run: `npm run seed`
4. Verify in database
5. Run: `npm run build` (exports to JSON, bundles plugin)
6. Test in FigJam

### Future Process (Documented, not yet implemented)
See `docs/CONTRIBUTING.md` for Puppeteer automation patterns and image extraction approaches.

---

## Query Examples

All query functions are exported from `src/db/queries.ts`.

### Get all swatches
```typescript
import Database from 'better-sqlite3'
import { getAllSwatches } from './src/db/queries'

const db = new Database('paint-swatcher.db')
const swatches = getAllSwatches(db)
```

### Search by brand
```typescript
import { getSwatchesByBrand } from './src/db/queries'

const fandBSwatches = getSwatchesByBrand(db, 'farrow-and-ball')
```

### Count swatches per brand
```typescript
import { getSwatchCountByBrand } from './src/db/queries'

const counts = getSwatchCountByBrand(db)
// { 'farrow-and-ball': 132, 'little-greene': 87, ... }
```

---

## Build Process (Phase 3)

When you run `npm run build`:

1. **Initialize database** (or open existing `paint-swatcher.db`)
2. **Export swatches** using `exportAllSwatches()` from `src/db/init.ts`
3. **Write generated data** to `src/data/swatches.ts`
4. **Bundle plugin** with `esbuild` so `code.js` contains static data

The build step is implemented in `scripts/build-data.ts`.

---

## Maintenance

### Reset database
```bash
rm paint-swatcher.db
npm run seed -- --file scripts/initial-data.json
```

### Verify database integrity
```bash
# Check total swatch count
npm run seed -- --verify
# (to be implemented)

# Or manually query:
sqlite3 paint-swatcher.db "SELECT COUNT(*) FROM swatches;"
```

### Backup
```bash
cp paint-swatcher.db paint-swatcher.db.backup
```

---

## Key Design Decisions

✅ **SQLite + better-sqlite3**: File-based, no server, minimal overhead  
✅ **Normalized schema**: Separate brands/collections eliminates duplication  
✅ **Static JSON export at build time**: Plugin stays self-contained in browser  
✅ **UNIQUE constraints**: Prevent accidental duplicates  
✅ **Hex normalization**: All colors stored as lowercase `#rrggbb`  
✅ **Soft delete (deprecated)**: Preserve historical data, don't hard-delete  

---

## Next Steps

- **Phase 2**: Migrate existing swatch data from `src/data/*.ts` to `scripts/initial-data.json`
- **Phase 3**: Update build process to export JSON from database
- **Phase 4**: Document scraping patterns in `docs/CONTRIBUTING.md`

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "better-sqlite3 not found" | Run `npm install` |
| Seeding fails with "UNIQUE constraint failed" | Duplicate swatch in seed data; check `scripts/initial-data.json` |
| Plugin doesn't show swatches | Check `code.js` contains embedded JSON; verify build completed |
| Hex colors not normalized | Ensure seed data uses lowercase hex or seeder normalizes |
