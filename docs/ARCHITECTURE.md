# Project Architecture & Maintenance

**Context guide for returning to this project after time away.**

---

## What Is This Project?

Paint Swatcher is a **FigJam plugin** that lets designers insert paint color swatches directly into FigJam frames. It aggregates colors from major paint brands (Farrow & Ball, Little Greene, etc.).

**Plugin flow:**
- User types paint color name in FigJam parameter
- Plugin displays matching colors
- User selects a color → square with color, brand, name, and link inserted into frame

---

## Technology Stack

- **Language**: TypeScript
- **Build**: esbuild (bundles to single `code.js` file)
- **Data**: SQLite (development) → JSON export (plugin runtime)
- **Package manager**: npm

---

## Quick Start

```bash
# Install dependencies
npm install

# Seed database with paint swatches
npm run seed -- --file scripts/initial-data.json

# Build plugin (outputs code.js)
npm run build

# Watch for changes during development
npm run watch
```

---

## Codebase Map

### Main Plugin
- **`src/code.ts`**: FigJam plugin logic (parameter handling, UI, swatch insertion)
  - Imports: swatch data from JSON (not directly from DB)
  - Key function: `figma.parameters.on()` for color search/suggestions

### Database Layer
- **`src/db/init.ts`**: SQLite schema definition, database initialization
- **`src/db/queries.ts`**: Query functions (getAllSwatches, searchSwatches, etc.)
  - Used by build scripts to export data
  - Reference for future developers

### Data & Scripting
- **`scripts/seed-db.ts`**: CLI tool to populate database from JSON
- **`scripts/build-data.ts`**: Pre-build script that exports DB → JSON
- **`scripts/initial-data.json`**: Seed data (paint brands + colors)

### Documentation
- **`docs/DATABASE.md`**: Database schema, queries, examples
- **`docs/ARCHITECTURE.md`**: This file — project context and workflow
- **`docs/CONTRIBUTING.md`**: Comprehensive guide for adding swatches (manual & future automation patterns)
- **`docs/scrapers/`**: Historical scraper examples (reference for browser/Puppeteer patterns)
- **`docs/reference/`**: Historical scripts and one-time migration tools

---

## Key Concepts

### SQLite Database
- **Where**: `paint-swatcher.db` (root directory)
- **Why**: Normalize data, prevent duplication, easy to query
- **Runtime**: Only used during build/seeding; not in FigJam plugin
- **Data flow**: 
  1. Seed DB with JSON
  2. Build exports swatches to JSON
  3. Plugin uses static JSON (no Node.js needed)

### Swatch Format
```typescript
{
  name: "Hague Blue",
  hex: "#0a3161",           // normalized to lowercase
  link: "https://...",      // link to brand page
  brandSlug: "farrow-and-ball",
  brandName: "Farrow & Ball"
}
```

### Build Process
The build now includes a data export step before bundling the plugin.

```bash
npm run build
# → exports static swatch data to src/data/swatches.ts
# → bundles src/code.ts + generated data → code.js
# → ready to upload to FigJam
```

The pre-build step is implemented in `scripts/build-data.ts`. It reads `paint-swatcher.db`, exports all active swatches, and writes them as a generated TypeScript module at `src/data/swatches.ts`.

---

## Common Tasks

### Add new paint colors
1. Manually gather color data (visit brand website)
2. Add to `scripts/initial-data.json` under appropriate brand (or append to initial-data.json)
3. Run: `npm run seed -- --file scripts/initial-data.json`
4. Run: `npm run build` (exports updated swatches, bundles plugin)
5. Test in FigJam

### Debug database
```bash
# Query with sqlite3 CLI (if installed)
sqlite3 paint-swatcher.db

# Inside sqlite3:
SELECT * FROM swatches WHERE name LIKE '%hague%';
SELECT COUNT(*) FROM swatches WHERE brandId = 1;
```

### Reset database
```bash
rm paint-swatcher.db
npm run seed -- --file scripts/initial-data.json
```

### Test plugin locally
After running `npm run build`:
1. Open FigJam
2. **Plugins** → **Manage plugins** → **Development** → Select `manifest.json`
3. Run plugin from FigJam menu
4. Open inspector (⌘+Option+I) to see console logs

---

## Phases Overview

| Phase | Status | Goal |
|-------|--------|------|
| **Phase 1** | ✅ Complete | Database setup (schema, queries, seeding) |
| **Phase 2** | ✅ Complete | Migrate existing TS data files → seed JSON |
| **Phase 3** | ✅ Complete | Update build process to export DB → JSON at compile time |
| **Phase 4** | ✅ Complete | Documentation (CONTRIBUTING.md, scraper patterns, cleanup) |

---

## Environment Notes

- **Node version**: Check `package.json` (no explicit requirement set)
- **OS**: macOS (primary), but should work on Windows/Linux
- **FigJam environment**: Plugin runs in browser sandbox (no Node.js, no file system access)

---

## Dependencies

### Development
- `typescript`: Language
- `esbuild`: Bundler
- `better-sqlite3`: Database (Node.js only, not in plugin)
- `@figma/plugin-typings`: FigJam API types
- `@types/node`: Node.js type definitions
- `eslint`: Linting

---

## Files to Edit When Adding Data

1. **`scripts/initial-data.json`**: Add swatch data (or use a scraper)
2. **Run seeding**: `npm run seed -- --file scripts/initial-data.json`
3. **Run build**: `npm run build` (exports DB → JSON, bundles plugin)
4. **`src/code.ts`**: (Rarely) If plugin UI logic changes
5. **`docs/DATABASE.md`**: Update if schema changes

### Generated Files (Do Not Edit Manually)

- **`src/data/swatches.ts`**: Auto-generated from database by build:data script
- **`paint-swatcher.db`**: SQLite database (generated by seed script)
- **`code.js`**: Final bundled plugin (generated by build script)

---

## When Returning to This Project

1. **Refresh on current state**: Check `CHANGELOG.md` for recent changes
2. **Review structure**: Scan this file for context
3. **Check Phase status**: See table above — all phases ✅ complete
4. **Build & test**: 
   ```bash
   npm install
   npm run build
   # → Generates src/data/swatches.ts + bundles code.js (208.6kb)
   ```
5. **Read relevant docs**: 
   - **Want to add colors?** → See `docs/CONTRIBUTING.md` (manual workflow + future patterns)
   - **Want to understand data flow?** → See `docs/DATABASE.md` (schema + queries)
   - **Want scraper examples?** → See `docs/scrapers/README.md` + reference files
   - **Want to add features?** → See `src/code.ts` comments

---

## Contacts & Resources

- **FigJam Plugin API**: https://www.figma.com/plugin-docs/
- **SQLite docs**: https://www.sqlite.org/docs.html
- **Better-sqlite3 docs**: https://github.com/WiseLibs/better-sqlite3/wiki
