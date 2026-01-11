---
name: add-a-bit
description: How to add a bit. Use this when asked to add a bit.
---

To add a bit, follow this process, considering possible deviations as required:

- Add the bit to the relevant files, starting with `BitType.ts`
  - Consider at least `BitType.ts` and `bits.ts`
  - Derive the bit from existing bits where appropriate
  - Set 'since' to the current version number in package.json
- Add a new .bitmark / .json pair in the standard tests, with examples containing:
   - The bit will all relevant tags and properties
   - The bit with various edge cases of tags and properties
   - The bit with no tags or properties, only the header
   - Do NOT update the `parser.version` in all standard tests
- Ensure all tests pass
