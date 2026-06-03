# Reference Materials

**Historical scripts and patterns for Paint Swatcher development.**

Files in this directory are **reference only** and typically not executed. They document past work and can be useful for understanding project history or implementing similar features.

---

## Files

### migrate-to-json.ts

**Purpose**: One-time migration script from Phase 2.

**What it did**: Extracted swatch data from the legacy TS data files (`src/data/farrowAndBall.ts`, etc.) and converted them to JSON format for database seeding.

**Status**: ✅ Complete. Archive only.

**Why it's here**: 
- Documents how the original data structure was transformed
- Shows the mapping logic (especially for Farrow & Ball's `number` → `productCode`)
- Can be adapted if you need to migrate data from another format

**If you need similar migration**:
1. Review this file for the pattern
2. Create a new script following the same structure
3. Adapt imports/mapping as needed

---

## How to Use

Most reference files won't run out-of-the-box (they may have broken imports or outdated dependencies). Instead:

1. **Read the code** to understand the pattern
2. **Adapt for your use case** (e.g., a new data source or format)
3. **Create a new script** in `scripts/` following the same pattern
4. **Document your process** so future-you remembers

---

## Adding New Reference Materials

If you develop a useful pattern or one-time script:

1. Move it here after it's no longer needed for regular execution
2. Add a comment at the top explaining its purpose and date
3. Update this README with a new file entry
4. Commit to version control

Example:
```typescript
/**
 * One-time script to import X data format.
 * Used: June 2026
 * Status: Archive. Kept for reference.
 */
```

---

## Cleanup

Periodically review this directory. If a file is more than 1-2 years old and no longer relevant:
- Consider removing it
- Or, document why it should be kept
