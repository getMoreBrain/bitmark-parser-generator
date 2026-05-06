# PLAN: `.vendor-stripe-pricing-table-print-on-request` Bit

## Context

A new vendor bit is needed: `.vendor-stripe-pricing-table-print-on-request`.

It is identical to `.vendor-stripe-pricing-table` plus two extra plain‑text
properties used to identify the customer/product for an on‑demand print flow:

```
[@printOnRequestCustomerId: 98788bjbjhbjh ]
[@printOnRequestProductId: 12334143dfrt ]
```

## Bit Definition

| Field           | Value                                                                |
| --------------- | -------------------------------------------------------------------- |
| `BitType` (key) | `vendorStripePricingTablePrintOnRequest`                             |
| Bit name        | `vendor-stripe-pricing-table-print-on-request`                       |
| `baseBitType`   | `BitType.vendorStripePricingTable`                                   |
| `since`         | next release (TBD by maintainer at PR time)                          |
| Description     | "Stripe pricing table bit with print-on-request customer/product IDs" |
| Extra tags      | `printOnRequestCustomerId` (plainText, `minCount: 1`)                |
|                 | `printOnRequestProductId` (plainText, `minCount: 1`)                 |

Inherits everything else from `vendorStripePricingTable` (i.e. `stripePricingTableId`,
`stripePublishableKey` and all article‑level tags).

## Functional Requirements

1. Bitmark `[.vendor-stripe-pricing-table-print-on-request]` parses with the four
   required properties: `stripePricingTableId`, `stripePublishableKey`,
   `printOnRequestCustomerId`, `printOnRequestProductId`.
2. Round‑trip is lossless: bitmark → JSON → bitmark and JSON → AST → JSON.
3. JSON output for the new bit always includes the four properties (default
   `""` if absent), consistent with how `vendor-stripe-pricing-table` already
   defaults `stripePricingTableId` / `stripePublishableKey`.
4. `Config.isOfBitType(bit, BitType.vendorStripePricingTable)` returns `true`
   for the new bit (inheritance), so existing special‑case logic continues to
   apply.

## Non-Functional Requirements

- No grammar changes (generic `[@<propertyKey>: …]` already parses).
- No JSON schema breakage: only adds optional fields on existing bit types.
- Existing test fixtures must remain byte-for-byte unchanged. Only the new
  fixture pair is added.

## Files to Touch

| File                                                          | Change                                                                                  |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `src/model/enum/BitType.ts`                                   | Add `vendorStripePricingTablePrintOnRequest: 'vendor-stripe-pricing-table-print-on-request'` after `vendorStripePricingTableExternal` (line 636) |
| `src/model/enum/PropertyKey.ts`                               | Add `property_printOnRequestCustomerId: '@printOnRequestCustomerId'` and `property_printOnRequestProductId: '@printOnRequestProductId'` adjacent to `property_printParentChapterLevel` (line 159) |
| `src/config/raw/bits.ts`                                      | Add `[BitType.vendorStripePricingTablePrintOnRequest]` config entry after `vendorStripePricingTableExternal` (line 5858); `baseBitType: BitType.vendorStripePricingTable`; tags = the two new property keys, both `format: TagFormat.plainText`, `minCount: 1` |
| `src/ast/Builder.ts`                                          | Type: add `printOnRequestCustomerId?: string;` and `printOnRequestProductId?: string;` immediately after `printParentChapterLevel?: number;` (line 338). Mapping: add two `this.toAstProperty(...)` calls immediately after the `printParentChapterLevel:` block (line 1340–1345) using `ConfigKey.property_printOnRequestCustomerId` / `ConfigKey.property_printOnRequestProductId` |
| `src/generator/json/JsonGenerator.ts`                         | Inside the existing `vendor-stripe-pricing-table` defaults block (line 1927–1931), add a nested `if (Config.isOfBitType(bitType, BitType.vendorStripePricingTablePrintOnRequest))` that defaults `printOnRequestCustomerId` and `printOnRequestProductId` to `''` |
| `test/standard/input/bitmark/vendor-stripe-pricing-table-print-on-request.bitmark` | NEW — varied examples (see below) |
| `test/standard/input/bitmark/json/vendor-stripe-pricing-table-print-on-request.json` | NEW — expected JSON output, hand-written |

## Test Fixture Content (`.bitmark`)

Three bits in one file exercising variation:

1. All four properties set (typical case).
2. All four properties set with different values (sanity / second instance).
3. Only the two new properties set, `stripePricingTableId` / `stripePublishableKey`
   omitted — verifies they default to `""` in JSON via inherited
   `vendor-stripe-pricing-table` defaults.

```bitmark
[.vendor-stripe-pricing-table-print-on-request]
[@id:342346]
[@stripePricingTableId: prctb1_1NNeGVGt8{VgVjROuB0TVMu ]
[@stripePublishableKey: pk_live_ABC ]
[@printOnRequestCustomerId: 98788bjbjhbjh ]
[@printOnRequestProductId: 12334143dfrt ]

[.vendor-stripe-pricing-table-print-on-request]
[@id:342347]
[@stripePricingTableId: prctb1_OTHER ]
[@stripePublishableKey: pk_live_XYZ ]
[@printOnRequestCustomerId: cus_QQQ ]
[@printOnRequestProductId: prod_RRR ]

[.vendor-stripe-pricing-table-print-on-request]
[@id:342348]
[@printOnRequestCustomerId: cus_only ]
[@printOnRequestProductId: prod_only ]
```

## Test Fixture Content (`.json`)

Hand-written, mirroring the shape of the existing
`vendor-stripe-pricing-table.json` (each entry: `bit`, `parser`, `bitmark`).
Per bit, include all four `*Id`/`*Key` properties (defaulting to `""` where
absent in bitmark), plus the standard empty arrays (`item`, `lead`,
`pageNumber`, `marginNumber`, `hint`, `instruction`, `body`).

> ⚠️ **Do NOT run `npm run regenerate-bitmark-test-json`** — that script
> rewrites every JSON in `test/standard/input/bitmark/json/`. Only the new
> file should be created/modified.
> If the regen script is used to bootstrap, immediately revert all files
> except the new pair before committing.

## Implementation Steps

1. `src/model/enum/BitType.ts` — add bit‑type entry.
2. `src/model/enum/PropertyKey.ts` — add two property keys.
3. `src/config/raw/bits.ts` — add bit config.
4. `src/ast/Builder.ts` — extend `BitContentDeep` data type and the property
   mapping block (both insertions immediately after the `printParentChapterLevel`
   line, per spec).
5. `src/generator/json/JsonGenerator.ts` — add the nested default block
   inside the existing stripe-pricing-table case.
6. Create the bitmark test fixture and hand‑write the matching JSON.
7. `npm run check` — typecheck + lint must pass.
8. `npm test` — full suite must pass with no fixture diffs other than the
   newly added pair.
9. (Optional) `npm run start-generate-config` — regenerate
   `assets/config/**/*.jsonc` so the new bit appears in the published config;
   confirm only the relevant config file changes.

## Out of Scope

- Print‑on‑request runtime/server‑side behaviour (this plan only adds the
  parser/generator surface for the new bit type).
- Regenerating all existing test JSON fixtures.
- Documentation updates beyond what `npm run build-supported-info`
  generates automatically from config.
