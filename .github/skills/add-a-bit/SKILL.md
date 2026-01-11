---
name: add-a-bit
description: How to add a bit. Use this when asked to add a bit.
---

To add a bit, follow this process, considering possible deviations as required:

- Add the bit to the relevant files, starting with `BitType.ts`
  - Consider at least `BitType.ts` and `bits.ts`
- Add a new .bitmark / .json pair in the standard tests, with examples containing:
   - The bit will all relevant tags and properties
   - The bit with various edge cases of tags and properties
   - The bit with no tags or properties, only the header
- Ensure all tests pass
