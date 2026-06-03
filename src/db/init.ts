import Database from 'better-sqlite3'

/**
 * Initialize SQLite database connection and schema.
 * 
 * Database is stored at the root of the project as `paint-swatcher.db`
 * when running in Node.js (build/seed scripts).
 * 
 * At runtime in FigJam, data is consumed as static JSON (see build process).
 */

export interface Brand {
  id: number
  name: string
  slug: string
  shortname?: string
  website?: string
  createdAt: string
}

export interface Swatch {
  id: number
  brandId: number
  collectionId: number | null
  name: string
  hex: string // normalized to lowercase (e.g., "#ffffff")
  link: string
  official: boolean
  dateIntroduced?: string
  dateAdded: string
  deprecated: boolean
  productCode?: string
  notes?: string
}

/**
 * Normalize hex color code to lowercase with # prefix.
 */
function normalizeHex(hex: string): string {
  const cleaned = hex.replace(/^#?/, '').toLowerCase()
  return `#${cleaned}`
}

function ensureColumnExists(db: Database.Database, table: string, column: string, definition: string) {
  const columns = db.prepare(`PRAGMA table_info(${table})`).all() as Array<{ name: string }>
  if (!columns.some((row) => row.name === column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`)
  }
}

/**
 * Get or create database connection.
 * Creates schema if database is new.
 */
export function initializeDatabase(dbPath: string = 'paint-swatcher.db'): Database.Database {
  const db = new Database(dbPath)

  // Create brands table
  db.exec(`
    CREATE TABLE IF NOT EXISTS brands (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      shortname TEXT,
      website TEXT,
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)

  ensureColumnExists(db, 'brands', 'shortname', 'TEXT')

  // Create collections table
  db.exec(`
    CREATE TABLE IF NOT EXISTS collections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brandId INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (brandId) REFERENCES brands(id) ON DELETE CASCADE,
      UNIQUE(brandId, name)
    )
  `)

  // Create swatches table
  db.exec(`
    CREATE TABLE IF NOT EXISTS swatches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brandId INTEGER NOT NULL,
      collectionId INTEGER,
      name TEXT NOT NULL,
      hex TEXT NOT NULL,
      link TEXT NOT NULL,
      official INTEGER NOT NULL DEFAULT 1,
      dateIntroduced TEXT,
      dateAdded TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      deprecated INTEGER NOT NULL DEFAULT 0,
      productCode TEXT,
      notes TEXT,
      FOREIGN KEY (brandId) REFERENCES brands(id) ON DELETE CASCADE,
      FOREIGN KEY (collectionId) REFERENCES collections(id) ON DELETE SET NULL,
      UNIQUE(brandId, collectionId, name)
    )
  `)

  return db
}

/**
 * Export all swatches with brand slug, formatted for FigJam plugin.
 * This is called at build time to generate static JSON.
 */
export interface SwatchExport {
  name: string
  hex: string
  link: string
  brandSlug: string
  brandName: string
  brandShortname?: string | null
}

export function exportAllSwatches(db: Database.Database): SwatchExport[] {
  const query = db.prepare(`
    SELECT
      s.name,
      s.hex,
      s.link,
      b.slug as brandSlug,
      b.name as brandName,
      b.shortname as brandShortname
    FROM swatches s
    JOIN brands b ON s.brandId = b.id
    WHERE s.deprecated = 0
    ORDER BY b.name, s.name
  `)

  return query.all() as SwatchExport[]
}
