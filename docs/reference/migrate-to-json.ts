#!/usr/bin/env node

/**
 * Phase 2: Migrate existing TS data files to seed JSON.
 * This one-time script imports swatch data from src/data/*.ts files
 * and writes them to scripts/initial-data.json in the seed format.
 */

import fs from 'fs'
import path from 'path'
import fBSwatches from '../src/data/farrowAndBall'
import lGSwatches from '../src/data/littleGreene'
import pPLSwatches from '../src/data/paintAndPaperLibrary'
import eBSwatches from '../src/data/edwardBulmer'
import lickSwatches from '../src/data/lick'
import coatSwatches from '../src/data/coat'

interface SeedSwatch {
  name: string
  hex: string
  link: string
  productCode?: string
  notes?: string
}

interface Brand {
  name: string
  slug: string
  shortname: string
  website: string
  swatches: SeedSwatch[]
}

/**
 * Map raw swatch data to seed format.
 * Handles both productCode and number fields (for F&B compatibility).
 */
function mapSwatches(rawSwatches: unknown): SeedSwatch[] {
  return (rawSwatches as unknown as readonly any[]).map((s) => ({
    name: s.name,
    hex: s.hex,
    link: s.link,
    productCode: s.productCode || s.number,
    notes: s.notes,
  }))
}

// Map imported data to brand metadata
const brands: Brand[] = [
  {
    name: 'Farrow & Ball',
    slug: 'farrow-and-ball',
    shortname: 'F&B',
    website: 'https://www.farrow-ball.com',
    swatches: mapSwatches(fBSwatches),
  },
  {
    name: 'Little Greene',
    slug: 'little-greene',
    shortname: 'LG',
    website: 'https://www.littlegreene.com',
    swatches: mapSwatches(lGSwatches),
  },
  {
    name: 'Paint & Paper Library',
    slug: 'paint-and-paper-library',
    shortname: 'P&PL',
    website: 'https://www.paintandpaperlibrary.com',
    swatches: mapSwatches(pPLSwatches),
  },
  {
    name: 'Edward Bulmer',
    slug: 'edward-bulmer',
    shortname: 'EB',
    website: 'https://www.edwardbulmer.com',
    swatches: mapSwatches(eBSwatches),
  },
  {
    name: 'Lick',
    slug: 'lick',
    shortname: 'Lick',
    website: 'https://www.lick.com',
    swatches: mapSwatches(lickSwatches),
  },
  {
    name: 'Coat',
    slug: 'coat',
    shortname: 'Coat',
    website: 'https://www.coat.com',
    swatches: mapSwatches(coatSwatches),
  },
]

const seedData = { brands }

const outPath = path.resolve('scripts/initial-data.json')
fs.writeFileSync(outPath, JSON.stringify(seedData, null, 2), 'utf8')

const totalSwatches = brands.reduce((sum, b) => sum + b.swatches.length, 0)
console.log(`✅ Migration complete!`)
console.log(`   Brands: ${brands.length}`)
console.log(`   Total swatches: ${totalSwatches}`)
console.log(`   Output: ${path.relative(process.cwd(), outPath)}`)
console.log(`\nNext steps:`)
console.log(`  1. npm run seed -- --file scripts/initial-data.json`)
console.log(`  2. npm run build`)
