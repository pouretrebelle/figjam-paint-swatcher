import Database from 'better-sqlite3'
import { Brand, Swatch } from './init'

/**
 * Query interface for paint swatcher database.
 * These functions are used by build scripts to export data
 * and by documentation/examples.
 */

/**
 * Get all brands ordered by name.
 */
export function getAllBrands(db: Database.Database): Brand[] {
  const query = db.prepare('SELECT * FROM brands ORDER BY name')
  return query.all() as Brand[]
}

/**
 * Get all swatches for a specific brand.
 */
export function getSwatchesByBrand(db: Database.Database, brandSlug: string): Swatch[] {
  const query = db.prepare(`
    SELECT s.* FROM swatches s
    JOIN brands b ON s.brandId = b.id
    WHERE b.slug = ? AND s.deprecated = 0
    ORDER BY s.name
  `)
  return query.all(brandSlug) as Swatch[]
}

/**
 * Get all swatches (non-deprecated).
 */
export function getAllSwatches(db: Database.Database): Swatch[] {
  const query = db.prepare('SELECT * FROM swatches WHERE deprecated = 0 ORDER BY name')
  return query.all() as Swatch[]
}

/**
 * Search swatches by name (case-insensitive).
 */
export function searchSwatches(db: Database.Database, query: string): Swatch[] {
  const searchQuery = db.prepare(`
    SELECT * FROM swatches
    WHERE (name LIKE ? OR hex LIKE ?)
    AND deprecated = 0
    ORDER BY name
  `)
  const term = `%${query}%`
  return searchQuery.all(term, term) as Swatch[]
}

/**
 * Get swatch by exact hex value.
 */
export function getSwatchByHex(db: Database.Database, hex: string): Swatch | undefined {
  const query = db.prepare('SELECT * FROM swatches WHERE hex = ? AND deprecated = 0 LIMIT 1')
  return query.get(hex) as Swatch | undefined
}

/**
 * Count total swatches in database.
 */
export function getSwatchCount(db: Database.Database): number {
  const query = db.prepare('SELECT COUNT(*) as count FROM swatches WHERE deprecated = 0')
  const result = query.get() as { count: number }
  return result.count
}

/**
 * Count swatches by brand.
 */
export function getSwatchCountByBrand(db: Database.Database): Record<string, number> {
  const query = db.prepare(`
    SELECT b.slug, COUNT(s.id) as count
    FROM swatches s
    JOIN brands b ON s.brandId = b.id
    WHERE s.deprecated = 0
    GROUP BY b.id
    ORDER BY b.name
  `)
  const results = query.all() as Array<{ slug: string; count: number }>
  return Object.fromEntries(results.map(r => [r.slug, r.count]))
}

/**
 * Insert a brand (used by seeder).
 */
export function insertBrand(db: Database.Database, data: { name: string; slug: string; shortname?: string; website?: string }): number {
  const query = db.prepare(`
    INSERT INTO brands (name, slug, shortname, website)
    VALUES (?, ?, ?, ?)
  `)
  const result = query.run(data.name, data.slug, data.shortname || null, data.website || null)
  return result.lastInsertRowid as number
}

/**
 * Insert a swatch (used by seeder).
 */
export function insertSwatch(db: Database.Database, data: {
  brandId: number
  collectionId?: number | null
  name: string
  hex: string
  link: string
  official?: boolean
  dateIntroduced?: string
  productCode?: string
  notes?: string
}): number {
  const query = db.prepare(`
    INSERT INTO swatches (brandId, collectionId, name, hex, link, official, dateIntroduced, productCode, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  const result = query.run(
    data.brandId,
    data.collectionId || null,
    data.name,
    data.hex.toLowerCase().startsWith('#') ? data.hex.toLowerCase() : `#${data.hex.toLowerCase()}`,
    data.link,
    data.official !== false ? 1 : 0,
    data.dateIntroduced || null,
    data.productCode || null,
    data.notes || null
  )
  return result.lastInsertRowid as number
}

/**
 * Get or insert a brand by slug (convenience for seeding).
 */
export function getOrInsertBrand(db: Database.Database, data: { name: string; slug: string; shortname?: string; website?: string }): number {
  const existing = db.prepare('SELECT id, shortname FROM brands WHERE slug = ?').get(data.slug) as { id: number; shortname?: string } | undefined
  if (existing) {
    if (data.shortname && !existing.shortname) {
      db.prepare('UPDATE brands SET shortname = ? WHERE id = ?').run(data.shortname, existing.id)
    }
    return existing.id
  }
  return insertBrand(db, data)
}
