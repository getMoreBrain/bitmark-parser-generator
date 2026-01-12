---
name: add-a-property
description: How to add a property to a bit or bits. Use this when asked to add a property to a bit or bits.
---

To add a property to a bit, follow this process, considering possible deviations as required:

- Add the property to the relevant files, starting with `Builder.ts`
  - Consider at least `Builder.ts`, `bits.ts`, `groups.ts`, `cardSets.ts`, `NodeType.ts`, `PropertyKey.ts`, `BitJson.ts`
- Consider if special case defaults are required in JsonGenerator.ts:cleanBitJson()
- Update relevant .bitmark / .json pairs in the standard tests, with the new property, considering:
   - Bits with the property
   - Bits with various edge cases of the property
   - Bits without the property (how default is handled in JSON)
   - Do NOT update the `parser.version` in all standard tests
- Ensure all tests pass
