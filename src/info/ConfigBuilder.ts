import path from 'node:path';

import { Enum } from '@ncoderz/superenum';
import fs from 'fs-extra';

import { Config } from '../config/Config.ts';
import { BITS } from '../config/raw/bits.ts';
import { CARDS } from '../config/raw/cardSets.ts';
import { GROUPS } from '../config/raw/groups.ts';
import type {
  _AbstractTagConfig,
  _BitConfig,
  _GroupsConfig,
  ExportJsonKey,
  HtmlKey,
} from '../model/config/_Config.ts';
import { typeFromConfigKey } from '../model/config/enum/ConfigKey.ts';
import { BitTagConfigKeyType } from '../model/enum/BitTagConfigKeyType.ts';
import { BitType, type BitTypeType } from '../model/enum/BitType.ts';
import { TagFormat } from '../model/enum/TagFormat.ts';
import { TextFormat } from '../model/enum/TextFormat.ts';
import { StringUtils } from '../utils/StringUtils.ts';

/**
 * Config generation options for the parser
 */
export interface GenerateConfigOptions {
  outputDir?: string;
}

const normalizeCardKey = (cardSetKey: string): string => StringUtils.camelToKebab(cardSetKey);

class ConfigBuilder {
  public build(options?: GenerateConfigOptions): void {
    const opts: GenerateConfigOptions = Object.assign({}, options);

    const bitConfigs: (_BitConfig & { bitType: BitTypeType })[] = [];
    const groupConfigs: (_GroupsConfig & { key: string })[] = [];

    const bitGroupConfigKeys: Set<BitTypeType> = new Set();
    const bitGroupConfigs: (_BitConfig & { bitType: BitTypeType })[] = [];

    // First pass: collect all bits that are inherited from (walk full chains)
    for (const bt of Enum(BitType).values()) {
      const bitType = Config.getBitType(bt);
      const _bitConfig = BITS[bitType] as _BitConfig;
      if (_bitConfig?.baseBitType) {
        // Walk up the inheritance chain and add all ancestors
        let currentBitType: BitTypeType | undefined = _bitConfig.baseBitType;
        while (currentBitType) {
          bitGroupConfigKeys.add(currentBitType);
          const parentConfig = BITS[currentBitType] as _BitConfig;
          currentBitType = parentConfig?.baseBitType;
        }
      }
    }

    for (const bt of Enum(BitType).values()) {
      const bitType = Config.getBitType(bt);
      const _bitConfig: _BitConfig & { bitType: BitTypeType } = BITS[bitType] as _BitConfig & {
        bitType: BitTypeType;
      };
      if (_bitConfig) {
        _bitConfig.bitType = bitType;
        bitConfigs.push(_bitConfig);
      }
      // const config: BitConfig = Config.getBitConfig(bitType);
      // bitConfigs.push(config);
    }
    for (const [k, g] of Object.entries(GROUPS)) {
      const g2 = g as unknown as _GroupsConfig & { key: string };
      let k2 = k as string;
      if (k.startsWith('group_')) k2 = k2.substring(6);
      k2 = /*'_' +*/ StringUtils.camelToKebab(k2);
      g2.key = k2;
      groupConfigs.push(g2);
    }
    const outputFolder = opts.outputDir ?? 'assets/config';
    const outputFolderBits = path.join(outputFolder, 'bits');
    const outputFolderGroups = path.join(outputFolder, 'partials');
    const outputFolderCards = path.join(outputFolder, 'cards');
    fs.ensureDirSync(outputFolderBits);
    fs.ensureDirSync(outputFolderGroups);
    fs.ensureDirSync(outputFolderCards);

    // Clean up existing config files
    const bitsFiles = fs.readdirSync(outputFolderBits).filter((f) => f.endsWith('.jsonc'));
    for (const file of bitsFiles) {
      fs.removeSync(path.join(outputFolderBits, file));
    }
    const partialsFiles = fs.readdirSync(outputFolderGroups).filter((f) => f.endsWith('.jsonc'));
    for (const file of partialsFiles) {
      fs.removeSync(path.join(outputFolderGroups, file));
    }
    const cardsFiles = fs.readdirSync(outputFolderCards).filter((f) => f.endsWith('.jsonc'));
    for (const file of cardsFiles) {
      fs.removeSync(path.join(outputFolderCards, file));
    }
    const fileWrites: Promise<void>[] = [];
    const tagEntriesTypeOrder = [
      BitTagConfigKeyType.tag,
      BitTagConfigKeyType.property,
      BitTagConfigKeyType.resource,
      BitTagConfigKeyType.group,
      BitTagConfigKeyType.unknown,
    ];

    // Validator errors collected during tag processing — listed back to the user
    // in heading-style paths matching JSONKEYMIGRATION.md.
    const exportJsonKeyErrors: string[] = [];

    // Helper to resolve group references through squash map (handles chained squashing)
    type GroupRef = {
      key: string;
      jsonKey?: string;
      exportJsonKey?: ExportJsonKey;
      hasExportJsonKey?: boolean;
      htmlKey?: HtmlKey;
      hasHtmlKey?: boolean;
      min?: number | string;
      max?: number | string;
      description?: string;
    };
    const resolveGroupReferences = (groupKey: string): GroupRef[] => {
      if (squashedGroups.has(groupKey)) {
        const replacements = squashedGroups.get(groupKey)!;
        // Recursively resolve in case of chained squashing.
        // If a replacement itself is squashed, its own min/max/description are
        // discarded (it's being replaced); otherwise keep them on the leaf ref.
        return replacements.flatMap((r) =>
          squashedGroups.has(r.key) ? resolveGroupReferences(r.key) : [r],
        );
      }
      return [{ key: groupKey }];
    };

    // Default-form bare key for property/resource entries: '@bookReferences' → 'bookReferences'.
    // Symbol-mapped tags (#, +, -, _, =, %, ?, !, ▼, ►, $, ##) and dotted/transformed
    // legacy jsonKeys are NOT default and require an explicit exportJsonKey.
    const bareKeyForProperty = (key: string): string | undefined => {
      if (key.startsWith('@') || key.startsWith('&')) return key.substring(1);
      return undefined;
    };
    const legacyIsTrivialDefault = (tag: _AbstractTagConfig): boolean => {
      const bare = bareKeyForProperty(tag.key as string);
      if (bare == null) return false; // symbol-mapped, group, etc. — never trivial default
      // No explicit jsonKey, or explicit jsonKey is exactly the bare name.
      return tag.jsonKey == null || tag.jsonKey === bare;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const processTagEntries = (tag: any, pathStack: string[]): any[] => {
      const tags: unknown[] = [];
      let tagName = tag.key as string;
      const tagType = typeFromConfigKey(tag.key);
      let format = '';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let chain: any = undefined;

      if (tagType === BitTagConfigKeyType.tag) {
        tagName = tag.key;
        if (tag.format === TagFormat.plainText) {
          format = 'string';
        } else if (tag.format === TagFormat.boolean) {
          format = 'bool';
        } else if (tag.format === TagFormat.bitmarkText) {
          format = 'bitmark';
        } else if (tag.format === TagFormat.number) {
          format = 'number';
        } else {
          format = 'bitmark--';
        }
      } else if (tagType === BitTagConfigKeyType.property) {
        tagName = tag.key;
        if (tag.format === TagFormat.plainText) {
          format = 'string';
        } else if (tag.format === TagFormat.boolean) {
          format = 'bool';
        } else if (tag.format === TagFormat.bitmarkText) {
          format = 'bitmark';
        } else if (tag.format === TagFormat.number) {
          format = 'number';
        }
      } else if (tagType === BitTagConfigKeyType.resource) {
        format = 'string';
      } else if (tagType === BitTagConfigKeyType.group) {
        let k = tag.key as string;
        if (k.startsWith('group_')) k = k.substring(6);
        k = StringUtils.camelToKebab(k);
        const resolvedGroups = resolveGroupReferences(k);
        const hasOuterExport = Object.prototype.hasOwnProperty.call(tag, 'exportJsonKey');
        const hasOuterHtml = Object.prototype.hasOwnProperty.call(tag, 'htmlKey');
        // Validator: a group reference may carry a per-site jsonKey override
        // (legacy mini-language string). If it does, it must have an
        // exportJsonKey companion — otherwise the override would be silently
        // dropped on emission.
        if (!hasOuterExport && tag.jsonKey != null) {
          const headingPath = [...pathStack, `tags.${tag.key}`].join(' / ');
          exportJsonKeyErrors.push(
            `Missing exportJsonKey for non-default jsonKey at ${headingPath} (legacy: \`${tag.jsonKey}\`)`,
          );
        }
        for (const ref of resolvedGroups) {
          // Outer tag's exportJsonKey/jsonKey/min/max/description override the squashed leaf's.
          const exportJsonKeyChosen = hasOuterExport ? tag.exportJsonKey : ref.exportJsonKey;
          const hasExportChosen = hasOuterExport || !!ref.hasExportJsonKey;
          const htmlKeyChosen = hasOuterHtml ? tag.htmlKey : ref.htmlKey;
          const hasHtmlChosen = hasOuterHtml || !!ref.hasHtmlKey;
          const min = tag.minCount != null ? tag.minCount : ref.min;
          const max = tag.maxCount != null ? tag.maxCount : ref.max;
          const description = tag.description ? tag.description : ref.description;
          tags.push({
            type: 'group',
            key: ref.key,
            ...(hasExportChosen ? { jsonKey: exportJsonKeyChosen } : {}),
            ...(hasHtmlChosen ? { htmlKey: htmlKeyChosen } : {}),
            ...(min != null ? { min } : {}),
            ...(max != null ? { max } : {}),
            ...(description ? { description } : {}),
          });
        }
        return tags;
      }

      // Process chain
      if (Array.isArray(tag.chain) && tag.chain.length > 0) {
        const chainTags: unknown[] = [];
        const childPathStack = [...pathStack, `tags.${tag.key}`];
        for (const [, chainTag] of tag.chain.entries()) {
          chainTags.push(...processTagEntries(chainTag, childPathStack));
        }
        chain = chainTags;
      }

      // Determine the exportJsonKey field to emit (or omit) for this tag.
      const hasExport = Object.prototype.hasOwnProperty.call(tag, 'exportJsonKey');
      let exportJsonKeyField: { jsonKey: ExportJsonKey } | object;
      if (hasExport) {
        exportJsonKeyField = { jsonKey: tag.exportJsonKey as ExportJsonKey };
      } else if (legacyIsTrivialDefault(tag)) {
        exportJsonKeyField = {};
      } else {
        // Validator failure: legacy non-default jsonKey with no exportJsonKey.
        const headingPath = [...pathStack, `tags.${tag.key}`].join(' / ');
        exportJsonKeyErrors.push(
          `Missing exportJsonKey for non-default jsonKey at ${headingPath}` +
            (tag.jsonKey ? ` (legacy: \`${tag.jsonKey}\`)` : ` (symbol-mapped tag \`${tag.key}\`)`),
        );
        exportJsonKeyField = {};
      }

      // htmlKey has no legacy companion and no validator: emit verbatim under
      // `htmlKey` when explicitly set, otherwise omit (data-* fallback applies
      // downstream — see HTML.md §5).
      const hasHtml = Object.prototype.hasOwnProperty.call(tag, 'htmlKey');
      const htmlKeyField: { htmlKey: HtmlKey } | object = hasHtml
        ? { htmlKey: tag.htmlKey as HtmlKey }
        : {};

      const t = {
        type: 'tag',
        key: tagName,
        ...exportJsonKeyField,
        ...htmlKeyField,
        format,
        default: tag.defaultValue ?? null,
        ...(tag.nullable ? { nullable: true } : {}),
        min: tag.minCount == null ? 0 : tag.minCount,
        max: tag.maxCount == null ? 1 : tag.maxCount,
        description: tag.description ?? '',
        tags: chain,
      };
      tags.push(t);
      return tags;
    };

    // For card-set / side / variant / section: emit `jsonKey: <exportJsonKey>` if
    // explicit; otherwise omit. Validator-fail when a non-null legacy jsonKey
    // exists without an exportJsonKey companion.
    const cardJsonKeyField = (
      container: { jsonKey?: string | null; exportJsonKey?: ExportJsonKey },
      legacyKey: 'jsonKey' | 'sideJsonKey',
      exportKey: 'exportJsonKey' | 'sideExportJsonKey',
      pathHeading: string,
    ): { jsonKey: ExportJsonKey } | object => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const c = container as any;
      const hasExport = Object.prototype.hasOwnProperty.call(c, exportKey);
      if (hasExport) return { jsonKey: c[exportKey] as ExportJsonKey };
      const legacy = c[legacyKey];
      if (legacy == null) return {}; // null or undefined → omit
      // Non-null legacy with no exportJsonKey → validator failure
      exportJsonKeyErrors.push(
        `Missing exportJsonKey for non-default jsonKey at ${pathHeading} (legacy: \`${legacy}\`)`,
      );
      return {};
    };

    // For card-set / side / variant / section: emit `htmlKey: <htmlKey>` if
    // explicit; otherwise omit. No legacy companion and no validator (HTML.md §5).
    const cardHtmlKeyField = (
      container: { htmlKey?: HtmlKey; sideHtmlKey?: HtmlKey },
      htmlExportKey: 'htmlKey' | 'sideHtmlKey',
    ): { htmlKey: HtmlKey } | object => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const c = container as any;
      if (Object.prototype.hasOwnProperty.call(c, htmlExportKey)) {
        return { htmlKey: c[htmlExportKey] as HtmlKey };
      }
      return {};
    };

    const serializeCardSet = (
      cardSetKey: string,
    ):
      | {
          name: string;
          htmlKey?: HtmlKey;
          cards: {
            name: string;
            isDefault?: boolean;
            jsonKey?: ExportJsonKey;
            htmlKey?: HtmlKey;
            sides: {
              name: string;
              repeat?: boolean;
              jsonKey?: ExportJsonKey;
              htmlKey?: HtmlKey;
              variants: unknown[];
            }[];
          }[];
        }
      | undefined => {
      const variantBodyFormat = (variant: { format?: string }): string =>
        variant.format ?? TextFormat.bitmarkText;
      const cardSetConfig = CARDS[cardSetKey];
      if (!cardSetConfig) return undefined;
      const normalizedKey = normalizeCardKey(cardSetKey);

      // Variants have no "inherited-group wrapper" the way bits do
      // (`writeBitConfigs` always emits a parent `group-{baseBitType}` ref
      // first, then sorted own tags). Without that wrapper, sorting variant
      // tags with groups LAST means inherited generic tags (from a group ref
      // inside the variant) get walked AFTER any direct tag/property
      // override and overwrite it under the downstream configurator's
      // last-wins-by-name dedup. Sort groups FIRST so direct overrides win.
      const variantTagEntriesTypeOrder = [
        BitTagConfigKeyType.group,
        BitTagConfigKeyType.tag,
        BitTagConfigKeyType.property,
        BitTagConfigKeyType.resource,
        BitTagConfigKeyType.unknown,
      ];
      const sides = cardSetConfig.sides.map((side, sideIdx) => {
        const sidePath = `cardSets.${normalizedKey} / sides.${side.name ?? `[${sideIdx}]`}`;
        const variants = side.variants.map((variant, variantIdx) => {
          const variantPath = `${sidePath} / variants.[${variantIdx}]`;
          const variantTags: unknown[] = [];
          const variantTagEntries = Object.entries(variant.tags ?? []).sort((a, b) => {
            const tagA = a[1];
            const tagB = b[1];
            const typeA = typeFromConfigKey(tagA.key);
            const typeB = typeFromConfigKey(tagB.key);
            const typeOrder =
              variantTagEntriesTypeOrder.indexOf(typeA) - variantTagEntriesTypeOrder.indexOf(typeB);
            return typeOrder;
          });

          for (const [, variantTag] of variantTagEntries) {
            variantTags.push(...processTagEntries(variantTag, [variantPath]));
          }

          return {
            ...cardJsonKeyField(variant, 'jsonKey', 'exportJsonKey', variantPath),
            ...cardHtmlKeyField(variant, 'htmlKey'),
            format: variantBodyFormat(variant),
            tags: variantTags,
            repeatCount: variant.repeatCount ?? 1,
            ...(variant.bodyRequired ? { bodyRequired: true } : {}),
            ...(variant.bodyAllowed === false ? { bodyForbidden: true } : {}),
          };
        });

        return {
          name: side.name,
          ...(side.repeat ? { repeat: side.repeat } : {}),
          ...cardJsonKeyField(side, 'jsonKey', 'exportJsonKey', sidePath),
          ...cardHtmlKeyField(side, 'htmlKey'),
          variants,
        };
      });

      // When sections exist, each section becomes its own card entry
      if (cardSetConfig.sections) {
        const cards = Object.entries(cardSetConfig.sections).map(([sectionName, section]) => {
          const sectionPath = `cardSets.${normalizedKey} / cards.${sectionName}`;
          // Per-section override of the side jsonKey (when section.sideExportJsonKey or
          // legacy section.sideJsonKey is set).
          const hasSideExport = Object.prototype.hasOwnProperty.call(section, 'sideExportJsonKey');
          const hasSideHtml = Object.prototype.hasOwnProperty.call(section, 'sideHtmlKey');
          let cardSides = sides;
          if (hasSideExport || section.sideJsonKey != null || hasSideHtml) {
            const sideOverride = cardJsonKeyField(
              section,
              'sideJsonKey',
              'sideExportJsonKey',
              `${sectionPath} / sides.*`,
            );
            const sideHtmlOverride = cardHtmlKeyField(section, 'sideHtmlKey');
            cardSides = sides.map((s) => ({ ...s, ...sideOverride, ...sideHtmlOverride }));
          }

          return {
            name: sectionName,
            ...(section.isDefault ? { isDefault: true } : {}),
            ...cardJsonKeyField(section, 'jsonKey', 'exportJsonKey', sectionPath),
            ...cardHtmlKeyField(section, 'htmlKey'),
            // PLAN-085: per-section cardinality. Emit only when non-default
            // (treat `0` / undefined as "unbounded — omit").
            ...(section.minCount != null && section.minCount !== 0
              ? { min: section.minCount }
              : {}),
            ...(section.maxCount != null && section.maxCount !== 0
              ? { max: section.maxCount }
              : {}),
            sides: cardSides,
          };
        });

        // The card-set container key (e.g. the `<table>` wrapper for tables —
        // HTML.md §8) has no slot in the sectioned shape the way single-card
        // sets do, so emit it here at the top level. Only htmlKey is emitted
        // (legacy jsonKey/exportJsonKey for sectioned roots is intentionally
        // omitted, preserving existing JSON output).
        return { name: normalizedKey, ...cardHtmlKeyField(cardSetConfig, 'htmlKey'), cards };
      }

      // Single card
      const cardSetPath = `cardSets.${normalizedKey} / cards.default`;
      return {
        name: normalizedKey,
        cards: [
          {
            name: 'default',
            isDefault: true,
            ...cardJsonKeyField(cardSetConfig, 'jsonKey', 'exportJsonKey', cardSetPath),
            ...cardHtmlKeyField(cardSetConfig, 'htmlKey'),
            sides,
          },
        ],
      };
    };

    // Convert bits that are depended on to groups (must happen before writing bit configs)
    for (const bt of bitGroupConfigKeys) {
      const bitType = Config.getBitType(bt);
      const _bitConfig: _BitConfig & { bitType: BitTypeType } = BITS[bitType] as _BitConfig & {
        bitType: BitTypeType;
      };
      if (_bitConfig) {
        _bitConfig.bitType = bitType;
        // Avoid duplicates
        if (!bitGroupConfigs.some((c) => c.bitType === bitType)) {
          bitGroupConfigs.push(_bitConfig);
        }
      }
    }

    // Calculate which bit-groups should be squashed (only contain group references, no actual tags)
    // Maps: groupKey -> array of replacement group refs (with min/max/description preserved)
    const squashedGroups: Map<string, GroupRef[]> = new Map();

    for (const b of bitGroupConfigs) {
      const groupKey = `group-${b.bitType}`;
      const processedTags: unknown[] = [];

      // Process this bit's own tags (not parent)
      for (const [, tag] of Object.entries(b.tags ?? [])) {
        processedTags.push(...processTagEntries(tag, []));
      }

      // Check if all processed tags are group references
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const allAreGroups = processedTags.every((t: any) => t.type === 'group');

      if (allAreGroups && processedTags.length > 0) {
        // This group should be squashed - collect all its group references,
        // preserving min/max/description from each occurrence so they survive
        // the squash and reach the final emitted bit config.
        const replacements: GroupRef[] = [];
        if (b.baseBitType) {
          // Note: We'll resolve this later through resolveGroupReferences recursion
          replacements.push({ key: `group-${b.baseBitType}` });
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (const t of processedTags as any[]) {
          // The processed group tag carries `jsonKey` (already an exportJsonKey
          // value at this point). Preserve presence semantics: if the field is
          // present on the processed tag, mark hasExportJsonKey so a downstream
          // resolveGroupReferences emits the same value.
          const ref: GroupRef = {
            key: t.key,
            ...(t.min != null ? { min: t.min } : {}),
            ...(t.max != null ? { max: t.max } : {}),
            ...(t.description ? { description: t.description } : {}),
          };
          if (Object.prototype.hasOwnProperty.call(t, 'jsonKey')) {
            ref.exportJsonKey = t.jsonKey as ExportJsonKey;
            ref.hasExportJsonKey = true;
          }
          if (Object.prototype.hasOwnProperty.call(t, 'htmlKey')) {
            ref.htmlKey = t.htmlKey as HtmlKey;
            ref.hasHtmlKey = true;
          }
          replacements.push(ref);
        }
        squashedGroups.set(groupKey, replacements);
      }
    }

    // BitConfigs
    for (const b of bitConfigs) {
      // Get the resolved bit config with inherited properties
      const resolvedBitConfig = Config.getBitConfig(b.bitType);

      const tags: unknown[] = [];
      const tagEntries = Object.entries(b.tags ?? []).sort((a, b) => {
        const tagA = a[1];
        const tagB = b[1];
        const typeA = typeFromConfigKey(tagA.key);
        const typeB = typeFromConfigKey(tagB.key);
        const typeOrder = tagEntriesTypeOrder.indexOf(typeA) - tagEntriesTypeOrder.indexOf(typeB);
        return typeOrder;
      });
      const isInheritedFrom = bitGroupConfigKeys.has(b.bitType);

      // Per-key dedup with in-place replacement, mirroring
      // ConfigHydrator.hydrateTagsConfig's last-wins-per-configKey semantic
      // (PLAN-066). Walk order = parent inheritance chain (root → leaf) →
      // each level's tagGroupRefs[] → direct tags[] last; when the same
      // `key` reappears later in the walk, it REPLACES the earlier entry
      // in place (preserving position). Without this, the downstream
      // configurator-api importer hits a UNIQUE(bit_id, group_id)
      // violation on the second attach and silently keeps the first
      // (inherited) entry, losing the child's override.
      const indexByKey = new Map<string, number>();
      const pushOrReplace = (entry: { key: string; [k: string]: unknown }) => {
        const existing = indexByKey.get(entry.key);
        if (existing !== undefined) {
          tags[existing] = entry;
        } else {
          indexByKey.set(entry.key, tags.length);
          tags.push(entry);
        }
      };

      if (isInheritedFrom) {
        // This bit is inherited from, so its tags are in group-<bitType>
        // The bit config only references its own group (resolved through squash map)
        const resolvedGroups = resolveGroupReferences(`group-${b.bitType}`);
        for (const ref of resolvedGroups) {
          pushOrReplace({
            type: 'group',
            key: ref.key,
            ...(ref.hasExportJsonKey ? { jsonKey: ref.exportJsonKey } : {}),
            ...(ref.hasHtmlKey ? { htmlKey: ref.htmlKey } : {}),
            ...(ref.min != null ? { min: ref.min } : {}),
            ...(ref.max != null ? { max: ref.max } : {}),
            ...(ref.description ? { description: ref.description } : {}),
          });
        }
      } else {
        // This is a leaf bit - include parent group reference + own tags
        if (b.baseBitType) {
          const resolvedGroups = resolveGroupReferences(`group-${b.baseBitType}`);
          for (const ref of resolvedGroups) {
            pushOrReplace({
              type: 'group',
              key: ref.key,
              ...(ref.hasExportJsonKey ? { jsonKey: ref.exportJsonKey } : {}),
              ...(ref.hasHtmlKey ? { htmlKey: ref.htmlKey } : {}),
              ...(ref.min != null ? { min: ref.min } : {}),
              ...(ref.max != null ? { max: ref.max } : {}),
              ...(ref.description ? { description: ref.description } : {}),
            });
          }
        }
        for (const [_tagKey, tag] of tagEntries) {
          for (const entry of processTagEntries(tag, [])) {
            pushOrReplace(entry as { key: string; [k: string]: unknown });
          }
        }
      }

      // Walk up the baseBitType chain to find the inherited cardSet
      let cardRef: string | undefined;
      let current: _BitConfig | undefined = b;
      while (current) {
        if (current.cardSet && CARDS[current.cardSet]) {
          cardRef = normalizeCardKey(current.cardSet as string);
          break;
        }
        current = current.baseBitType ? (BITS[current.baseBitType] as _BitConfig) : undefined;
      }

      // Use resolved values from BitConfig (with inheritance applied)
      const bitJson = {
        name: b.bitType,
        description: b.description ?? '',
        since: resolvedBitConfig.since,
        deprecated: resolvedBitConfig.deprecated,
        history: [
          {
            version: resolvedBitConfig.since,
            changes: ['Initial version'],
          },
        ],
        format: resolvedBitConfig.textFormatDefault ?? 'bitmark--',
        bodyRequired: resolvedBitConfig.bodyRequired ?? false,
        bodyForbidden: !(resolvedBitConfig.bodyAllowed ?? true),
        footerRequired: resolvedBitConfig.footerRequired ?? false,
        footerForbidden: !(resolvedBitConfig.footerAllowed ?? true),
        resourceAttachmentAllowed: resolvedBitConfig.resourceAttachmentAllowed ?? true,
        tags,
        ...(cardRef ? { card: cardRef } : {}),
      };
      const output = path.join(outputFolderBits, `${b.bitType}.jsonc`);
      const str = JSON.stringify(bitJson, null, 2);
      fileWrites.push(fs.writeFile(output, str));
      // const bitType = b.bitType;
      // const bitType2 = Config.getBitType(bitType);
      // if (bitType !== bitType2) {
      //   console.log(`BitType: ${bitType} => ${bitType2}`);
      // }
    }

    // GroupConfigs
    const writeGroupConfigs = (groupConfigs: (_GroupsConfig & { key: string })[]) => {
      for (const g of groupConfigs) {
        const tags: unknown[] = [];
        const groupKey = StringUtils.camelToKebab(g.key);
        // if (groupKey == '_resourceImage') debugger;
        const tagEntriesTypeOrder = [
          BitTagConfigKeyType.tag,
          BitTagConfigKeyType.property,
          BitTagConfigKeyType.resource,
          BitTagConfigKeyType.group,
        ];
        const tagEntries = Object.entries(g.tags ?? []).sort((a, b) => {
          const tagA = a[1];
          const tagB = b[1];
          const typeOrder =
            tagEntriesTypeOrder.indexOf(tagA.type) - tagEntriesTypeOrder.indexOf(tagB.type);
          return typeOrder;
        });
        for (const [_tagKey, tag] of tagEntries) {
          tags.push(...processTagEntries(tag, []));
        }
        const bitJson = {
          name: groupKey,
          description: g.description ?? '',
          since: 'UNKNOWN',
          deprecated: g.deprecated,
          history: [
            {
              version: 'UNKNOWN',
              changes: ['Initial version'],
            },
          ],
          tags,
          // cards: [
          //   {
          //     card: null,
          //     side: 1,
          //     variant: null,
          //     description: '',
          //     tags: [],
          //   },
          //   {
          //     card: null,
          //     side: 2,
          //     variant: 1,
          //     description: '',
          //     tags: [],
          //   },
          //   {
          //     card: null,
          //     side: 2,
          //     variant: null,
          //     description: '',
          //     tags: [],
          //   },
          // ],
        };
        const output = path.join(outputFolderGroups, `${groupKey}.jsonc`);
        const str = JSON.stringify(bitJson, null, 2);
        fs.writeFileSync(output, str);
        // const bitType = b.bitType;
        // const bitType2 = Config.getBitType(bitType);
        // if (bitType !== bitType2) {
        //   console.log(`BitType: ${bitType} => ${bitType2}`);
        // }
      }
    };
    writeGroupConfigs(groupConfigs);

    const writeCardConfigs = () => {
      for (const cardSetKey of Object.keys(CARDS)) {
        const cardJson = serializeCardSet(cardSetKey);
        if (!cardJson) continue;
        const output = path.join(outputFolderCards, `${cardJson.name}.jsonc`);
        const str = JSON.stringify(cardJson, null, 2);
        fileWrites.push(fs.writeFile(output, str));
      }
    };

    // Bits as GroupConfigs
    const writeBitsAsGroupConfigs = (
      bitsAsGroupConfigs: (_BitConfig & { bitType: BitTypeType })[],
    ) => {
      for (const b of bitsAsGroupConfigs) {
        const groupKey = `group-${b.bitType}`;

        // Skip squashed groups - they won't be written as files
        if (squashedGroups.has(groupKey)) {
          continue;
        }

        const tags: unknown[] = [];

        // Add reference to parent group if this bit has a baseBitType (resolved through squash map)
        if (b.baseBitType) {
          const resolvedGroups = resolveGroupReferences(`group-${b.baseBitType}`);
          for (const ref of resolvedGroups) {
            tags.push({
              type: 'group',
              key: ref.key,
              ...(ref.hasExportJsonKey ? { jsonKey: ref.exportJsonKey } : {}),
              ...(ref.hasHtmlKey ? { htmlKey: ref.htmlKey } : {}),
              ...(ref.min != null ? { min: ref.min } : {}),
              ...(ref.max != null ? { max: ref.max } : {}),
              ...(ref.description ? { description: ref.description } : {}),
            });
          }
        }

        const tagEntries = Object.entries(b.tags ?? []).sort((a, b) => {
          const tagA = a[1];
          const tagB = b[1];
          const typeA = typeFromConfigKey(tagA.key);
          const typeB = typeFromConfigKey(tagB.key);
          const typeOrder = tagEntriesTypeOrder.indexOf(typeA) - tagEntriesTypeOrder.indexOf(typeB);
          return typeOrder;
        });
        for (const [_tagKey, tag] of tagEntries) {
          tags.push(...processTagEntries(tag, []));
        }
        const bitJson = {
          name: groupKey,
          description: b.description ?? '',
          since: 'UNKNOWN',
          deprecated: b.deprecated,
          history: [
            {
              version: 'UNKNOWN',
              changes: ['Initial version'],
            },
          ],
          tags,
        };
        const output = path.join(outputFolderGroups, `${groupKey}.jsonc`);
        const str = JSON.stringify(bitJson, null, 2);
        fs.writeFileSync(output, str);
        // const bitType = b.bitType;
        // const bitType2 = Config.getBitType(bitType);
        // if (bitType !== bitType2) {
        //   console.log(`BitType: ${bitType} => ${bitType2}`);
        // }
      }
    };
    writeBitsAsGroupConfigs(bitGroupConfigs);

    writeCardConfigs();

    // Fail fast on missing exportJsonKey before any file write — this is a
    // source-config error and the on-disk output would be wrong.
    if (exportJsonKeyErrors.length > 0) {
      console.error('\n⚠️  exportJsonKey validation errors:');
      for (const e of exportJsonKeyErrors) console.error(`  - ${e}`);
      throw new Error(
        `exportJsonKey validation failed: ${exportJsonKeyErrors.length} entr${
          exportJsonKeyErrors.length === 1 ? 'y' : 'ies'
        } with non-default jsonKey but no exportJsonKey companion.`,
      );
    }

    // Wait for all async file writes to complete, then validate
    Promise.all(fileWrites)
      .then(() => {
        // Validate the config tree after all files are written
        const validationErrors = this.validateConfigTree(outputFolder);
        if (validationErrors.length > 0) {
          console.error('\n⚠️  Config tree validation errors:');
          for (const error of validationErrors) {
            console.error(`  - ${error}`);
          }
          throw new Error(`Config tree validation failed with ${validationErrors.length} error(s)`);
        } else {
          console.log('✅ Config tree validation passed');
        }
      })
      .catch((err) => {
        console.error('Error during config build or validation:', err);
        throw err;
      });
  }

  /**
   * Validate the config tree for missing group references
   * @param outputFolder - The folder containing the config files
   * @returns Array of validation errors, empty if valid
   */
  private validateConfigTree(outputFolder: string): string[] {
    const errors: string[] = [];
    const outputFolderBits = path.join(outputFolder, 'bits');
    const outputFolderGroups = path.join(outputFolder, 'partials');
    const outputFolderCards = path.join(outputFolder, 'cards');

    // Read all group files to build a set of available groups
    const availableGroups = new Set<string>();
    if (fs.existsSync(outputFolderGroups)) {
      const groupFiles = fs.readdirSync(outputFolderGroups).filter((f) => f.endsWith('.jsonc'));
      for (const file of groupFiles) {
        const groupName = file.replace('.jsonc', '');
        availableGroups.add(groupName);
      }
    }

    const availableCards = new Set<string>();
    const cardFiles = fs.existsSync(outputFolderCards)
      ? fs.readdirSync(outputFolderCards).filter((f) => f.endsWith('.jsonc'))
      : [];
    for (const file of cardFiles) {
      const cardName = file.replace('.jsonc', '');
      availableCards.add(cardName);
    }

    // Helper to recursively check tags for group references
    const checkTags = (tags: unknown[], filePath: string, lineOffset: number): void => {
      for (let i = 0; i < tags.length; i++) {
        const tag = tags[i] as { type?: string; key?: string; tags?: unknown[] };
        if (tag?.type === 'group' && tag.key) {
          if (!availableGroups.has(tag.key)) {
            const line = lineOffset + i + 1; // Approximate line number
            errors.push(`Missing group reference '${tag.key}' in ${filePath}:${line}`);
          }
        }
        // Recursively check nested tags
        if (Array.isArray(tag?.tags)) {
          checkTags(tag.tags, filePath, lineOffset + i + 1);
        }
      }
    };

    // Check all bit config files
    if (fs.existsSync(outputFolderBits)) {
      const bitFiles = fs.readdirSync(outputFolderBits).filter((f) => f.endsWith('.jsonc'));
      for (const file of bitFiles) {
        const filePath = path.join(outputFolderBits, file);
        try {
          const content = fs.readFileSync(filePath, 'utf-8');
          const config = JSON.parse(content);
          if (config.tags && Array.isArray(config.tags)) {
            checkTags(config.tags, `bits/${file}`, 15); // Approximate line offset for tags array
          }
          if (typeof config.card === 'string') {
            if (!availableCards.has(config.card)) {
              errors.push(`Missing card file '${config.card}' referenced in bits/${file}`);
            }
          } else if (config.card?.sides && Array.isArray(config.card.sides)) {
            config.card.sides.forEach((side: unknown, sideIdx: number) => {
              const variants = (side as { variants?: unknown[] }).variants;
              if (Array.isArray(variants)) {
                variants.forEach((variant: unknown, variantIdx: number) => {
                  const variantTags = (variant as { tags?: unknown[] }).tags;
                  if (Array.isArray(variantTags)) {
                    checkTags(
                      variantTags,
                      `bits/${file} (card side ${sideIdx}, variant ${variantIdx})`,
                      15,
                    );
                  }
                });
              }
            });
          }
        } catch (err) {
          errors.push(`Failed to parse ${file}: ${err}`);
        }
      }
    }

    // Check all group config files
    if (fs.existsSync(outputFolderGroups)) {
      const groupFiles = fs.readdirSync(outputFolderGroups).filter((f) => f.endsWith('.jsonc'));
      for (const file of groupFiles) {
        const filePath = path.join(outputFolderGroups, file);
        try {
          const content = fs.readFileSync(filePath, 'utf-8');
          const config = JSON.parse(content);
          if (config.tags && Array.isArray(config.tags)) {
            checkTags(config.tags, `partials/${file}`, 15); // Approximate line offset for tags array
          }
        } catch (err) {
          errors.push(`Failed to parse ${file}: ${err}`);
        }
      }
    }

    if (cardFiles.length > 0) {
      for (const file of cardFiles) {
        const filePath = path.join(outputFolderCards, file);
        try {
          const content = fs.readFileSync(filePath, 'utf-8');
          const config = JSON.parse(content);
          const expectedKey = file.replace('.jsonc', '');
          if (config.key && config.key !== expectedKey) {
            errors.push(`Card key mismatch in cards/${file}: expected '${expectedKey}'`);
          }
          if (Array.isArray(config.cards)) {
            for (const cardNode of config.cards) {
              if (cardNode && Array.isArray(cardNode.sides)) {
                cardNode.sides.forEach((side: unknown, sideIdx: number) => {
                  const variants = (side as { variants?: unknown[] }).variants;
                  if (Array.isArray(variants)) {
                    variants.forEach((variant: unknown, variantIdx: number) => {
                      const variantTags = (variant as { tags?: unknown[] }).tags;
                      if (Array.isArray(variantTags)) {
                        checkTags(
                          variantTags,
                          `cards/${file} (side ${sideIdx}, variant ${variantIdx})`,
                          10,
                        );
                      }
                    });
                  }
                });
              }
            }
          }
        } catch (err) {
          errors.push(`Failed to parse cards/${file}: ${err}`);
        }
      }
    }

    return errors;
  }
}

export { ConfigBuilder };
