#!/usr/bin/env node

/**
 * Seed paint-swatcher.db from JSON import file.
 * 
 * Usage:
 *   npm run seed -- --file scripts/initial-data.json
 * 
 * The JSON file should contain an array of brand objects with swatches.
 * See scripts/initial-data.json for format.
 */

import fs from 'fs'
import path from 'path'
import { initializeDatabase } from '../src/db/init'
import { getOrInsertBrand, insertSwatch } from '../src/db/queries'

interface SeedSwatch {
  name: string
  hex: string
  link: string
  productCode?: string
  notes?: string
}

interface SeedBrand {
  name: string
  slug: string
  shortname?: string
  website?: string
  swatches: SeedSwatch[]
}

interface SeedData {
  brands: SeedBrand[]
}

const args = process.argv.slice(2)
const fileIndex = args.indexOf('--file')
const filePath = fileIndex >= 0 ? args[fileIndex + 1] : 'scripts/initial-data.json'

if (!filePath) {
  console.error('Usage: ts-node scripts/seed-db.ts --file <path-to-json>')
  process.exit(1)
}

const fullPath = path.resolve(filePath)

if (!fs.existsSync(fullPath)) {
  console.error(`File not found: ${fullPath}`)
  process.exit(1)
}

try {
  const db = initializeDatabase()
  const data = JSON.parse(fs.readFileSync(fullPath, 'utf-8')) as SeedData

  // Clear existing data
  db.exec('DELETE FROM swatches')
  db.exec('DELETE FROM collections')
  db.exec('DELETE FROM brands')

  let totalSwatches = 0

  for (const brand of data.brands) {
    const brandId = getOrInsertBrand(db, {
      name: brand.name,
      slug: brand.slug,
      shortname: brand.shortname,
      website: brand.website,
    })

    for (const swatch of brand.swatches) {
      insertSwatch(db, {
        brandId,
        name: swatch.name,
        hex: swatch.hex,
        link: swatch.link,
        productCode: swatch.productCode,
        notes: swatch.notes,
      })
      totalSwatches++
    }
  }

  console.log(`✅ Seeding complete!`)
  console.log(`   Brands: ${data.brands.length}`)
  console.log(`   Swatches: ${totalSwatches}`)

  db.close()
} catch (error) {
  console.error('❌ Seeding failed:', error instanceof Error ? error.message : String(error))
  process.exit(1)
}
