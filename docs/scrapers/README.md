# Scraper Reference Examples

**Historical scraper scripts for each paint brand. Reference only.**

These JavaScript files document how color data was originally extracted from each brand website using browser console or Puppeteer-like patterns. They are provided as reference for future developers who want to automate swatch collection.

---

## Usage

These are **not executed automatically**. Instead, they serve as:

1. **Reference**: See how each brand structures its color pages
2. **Inspiration**: Adapt the patterns for your own scraping needs
3. **Documentation**: Remember what worked in the past

### Manual Extraction

If you need to pull fresh data for a brand:

1. **Open the brand's paint color page** in your browser
2. **Open browser DevTools** (F12 or ⌘+Option+I)
3. **Go to Console** tab
4. **Copy the relevant pattern** from the `.js` file in this directory
5. **Paste and run** in the console
6. **Copy the output** JSON
7. **Add to** `scripts/initial-data.json`
8. **Seed and build** (see `docs/CONTRIBUTING.md`)

### Automating with Puppeteer

To automate extraction, convert these console patterns to a Puppeteer script:

```typescript
import puppeteer from 'puppeteer'

async function scrapeExampleBrand(url: string) {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(url)

  const swatches = await page.evaluate(() => {
    // Paste the logic from the .js file here
    return []
  })

  await browser.close()
  return swatches
}
```

---

## Files

- **coat.js** — Coat paints
- **edwardBulmer.js** — Edward Bulmer
- **farrowAndBall.js** — Farrow & Ball
- **lick.js** — Lick paints
- **littleGreene.js** — Little Greene
- **paintAndPaperLibrary.js** — Paint & Paper Library

---

## Next Steps

See `docs/CONTRIBUTING.md` for:
- How to add swatches manually (current workflow)
- Patterns for Puppeteer automation (future)
- Database maintenance

---

## Note

The brand websites may have changed structure since these scripts were written. If you need fresh data:

1. Update the CSS selectors in the `.js` file to match the current page structure
2. Test in browser console
3. Export as JSON
4. Import to database (see `docs/CONTRIBUTING.md`)
