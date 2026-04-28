import path from 'node:path';

import { Enum } from '@ncoderz/superenum';
import fs from 'fs-extra';

import { Config } from '../config/Config.ts';
import { BITS } from '../config/raw/bits.ts';
import { CARDS } from '../config/raw/cardSets.ts';
import { GROUPS } from '../config/raw/groups.ts';
import type { _BitConfig, _GroupsConfig } from '../model/config/_Config.ts';
import { typeFromConfigKey } from '../model/config/enum/ConfigKey.ts';
import { BitTagConfigKeyType } from '../model/enum/BitTagConfigKeyType.ts';
import { BitType, type BitTypeType } from '../model/enum/BitType.ts';
import { TagFormat } from '../model/enum/TagFormat.ts';
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

    // Helper to resolve group references through squash map (handles chained squashing)
    const resolveGroupReferences = (groupKey: string): string[] => {
      if (squashedGroups.has(groupKey)) {
        const replacements = squashedGroups.get(groupKey)!;
        // Recursively resolve in case of chained squashing
        return replacements.flatMap((r) => resolveGroupReferences(r));
      }
      return [groupKey];
    };

    const keyToJsonKey = (key: string, tagNameChain: string[]): string => {
      let jsonKey = key;

      if (key === '%') {
        jsonKey = 'item';
      } else if (key === '!') {
        jsonKey = 'instruction';
      } else if (key === '?') {
        jsonKey = 'hint';
      } else if (key === '#') {
        jsonKey = 'title';
      } else if (key === '##') {
        jsonKey = 'subTitle';
      } else if (key === '▼') {
        jsonKey = 'anchor';
      } else if (key === '►') {
        jsonKey = 'reference';
      } else if (key === '$') {
        jsonKey = 'sampleSolution';
        // } else if (key === '&') {
        //   jsonKey = 'Resource';
      } else if (key === '+') {
        jsonKey = 'choices[]|set(isCorrect=true)';
      } else if (key === '-') {
        jsonKey = 'choices[]|set(isCorrect=false)';
      } else if (key === '_') {
        jsonKey = 'solutions[]';
      } else if (key === '=') {
        jsonKey = 'solution';
      } else if (key.startsWith('@')) {
        jsonKey = key.substring(1);
      } else if (key.startsWith('&')) {
        jsonKey = key.substring(1);
      }

      // if (jsonKey.startsWith('group_')) {
      //   jsonKey = jsonKey.substring(6);
      // }
      // jsonKey = StringUtils.camelToKebab(jsonKey);

      const thisChain = [...tagNameChain, jsonKey];
      jsonKey = thisChain.join('.');

      return jsonKey;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const processTagEntries = (tag: any, tagNameChain: string[]): any[] => {
      const tags: unknown[] = [];
      let tagName = tag.key as string;
      // Use explicit jsonKey from config if set, otherwise compute from tag name
      const jsonKey = tag.jsonKey ?? keyToJsonKey(tagName, tagNameChain);
      // if (tagName == '&image') debugger;
      const tagType = typeFromConfigKey(tag.key);
      let format = '';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let chain: any = undefined;
      if (tagType === BitTagConfigKeyType.tag) {
        // const resolvedTag = TAGS[tag.configKey];
        // tagName = resolvedTag.tag;
        tagName = tag.key;
        // if (tagName === '%') {
        //   chain = {
        //     key: '%',
        //     format,
        //     min: tag.minCount,
        //     max: tag.maxCount,
        //     description: 'Lead',
        //     chain: {
        //       key: '%',
        //       format,
        //       min: tag.minCount,
        //       max: tag.maxCount,
        //       description: 'Page number',
        //       chain: {
        //         key: '%',
        //         format,
        //         min: tag.minCount,
        //         max: tag.maxCount,
        //         description: 'Margin number',
        //       },
        //     },
        //   };
        // }
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
        // const resolvedProperty = PROPERTIES[tag.configKey];
        // tagName = resolvedProperty.tag;
        tagName = tag.key;
        // const property = resolvedProperty as PropertyTagConfig;
        // format
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
        k = /*'_' +*/ StringUtils.camelToKebab(k);
        // Resolve group references through squash map
        const resolvedGroups = resolveGroupReferences(k);
        for (const groupKey of resolvedGroups) {
          tags.push({
            type: 'group',
            key: groupKey,
            ...(tag.jsonKey ? { jsonKey: tag.jsonKey } : {}),
          });
        }
        return tags;
      }

      // Process chain
      if (Array.isArray(tag.chain) && tag.chain.length > 0) {
        const chainTags: unknown[] = [];
        for (const [_tagKey, chainTag] of tag.chain.entries()) {
          // Chained children are nested inside the parent in the config tree,
          // so their jsonKey should be relative to the parent object (no chain prefix)
          chainTags.push(...processTagEntries(chainTag, []));
        }
        chain = chainTags;
      }

      const t = {
        type: 'tag',
        key: tagName,
        jsonKey,
        format,
        default: tag.defaultValue ?? null,
        min: tag.minCount == null ? 0 : tag.minCount,
        max: tag.maxCount == null ? 1 : tag.maxCount,
        description: tag.description ?? '',
        tags: chain,
        // raw: {
        //   ...tag,
        // },
      };
      tags.push(t);
      return tags;
    };

    const serializeCardSet = (
      cardSetKey: string,
    ):
      | {
          name: string;
          cards: {
            name: string;
            isDefault?: boolean;
            jsonKey?: string | null;
            sides: {
              name: string;
              repeat?: boolean;
              jsonKey?: string | null;
              variants: unknown[];
            }[];
          }[];
        }
      | undefined => {
      const cardSetConfig = CARDS[cardSetKey];
      if (!cardSetConfig) return undefined;
      const normalizedKey = normalizeCardKey(cardSetKey);

      const sides = cardSetConfig.sides.map((side) => {
        const variants = side.variants.map((variant) => {
          const variantTags: unknown[] = [];
          const variantTagEntries = Object.entries(variant.tags ?? []).sort((a, b) => {
            const tagA = a[1];
            const tagB = b[1];
            const typeA = typeFromConfigKey(tagA.key);
            const typeB = typeFromConfigKey(tagB.key);
            const typeOrder =
              tagEntriesTypeOrder.indexOf(typeA) - tagEntriesTypeOrder.indexOf(typeB);
            return typeOrder;
          });

          for (const [, variantTag] of variantTagEntries) {
            variantTags.push(...processTagEntries(variantTag, []));
          }

          return {
            ...(variant.jsonKey !== undefined ? { jsonKey: variant.jsonKey } : {}),
            tags: variantTags,
            repeatCount: variant.repeatCount ?? 1,
            ...(variant.bodyRequired ? { bodyRequired: true } : {}),
            ...(variant.bodyAllowed === false ? { bodyForbidden: true } : {}),
          };
        });

        return {
          name: side.name,
          ...(side.repeat ? { repeat: side.repeat } : {}),
          ...(side.jsonKey != null ? { jsonKey: side.jsonKey } : {}),
          variants,
        };
      });

      // When sections exist, each section becomes its own card entry
      if (cardSetConfig.sections) {
        const cards = Object.entries(cardSetConfig.sections).map(([sectionName, section]) => {
          let cardSides = section.sideJsonKey
            ? sides.map((s) => ({ ...s, jsonKey: section.sideJsonKey }))
            : sides;

          // HACK: table-extended — in non-header sections, rewrite the '#' title tag jsonKey
          // so it targets header rows via root escape instead of being transparent.
          if (normalizedKey === 'table-extended' && sectionName !== 'table-header') {
            cardSides = JSON.parse(JSON.stringify(cardSides));
            for (const side of cardSides) {
              for (const variant of side.variants) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                for (const tag of variant.tags as any[]) {
                  if (tag.type === 'tag' && tag.key === '#' && tag.jsonKey === '.') {
                    tag.jsonKey = '^table.header.rows.cells[{s}].content';
                  }
                }
              }
            }
          }

          return {
            name: sectionName,
            ...(section.isDefault ? { isDefault: true } : {}),
            jsonKey: section.jsonKey,
            sides: cardSides,
          };
        });

        return { name: normalizedKey, cards };
      }

      // Single card
      return {
        name: normalizedKey,
        cards: [
          {
            name: 'default',
            isDefault: true,
            jsonKey: cardSetConfig.jsonKey,
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
    // Maps: groupKey -> array of replacement group keys
    const squashedGroups: Map<string, string[]> = new Map();

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
        // This group should be squashed - collect all its group references
        const replacements: string[] = [];
        if (b.baseBitType) {
          // Note: We'll resolve this later through resolveGroupReferences recursion
          replacements.push(`group-${b.baseBitType}`);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (const t of processedTags as any[]) {
          replacements.push(t.key);
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

      if (isInheritedFrom) {
        // This bit is inherited from, so its tags are in group-<bitType>
        // The bit config only references its own group (resolved through squash map)
        const resolvedGroups = resolveGroupReferences(`group-${b.bitType}`);
        for (const groupKey of resolvedGroups) {
          tags.push({
            type: 'group',
            key: groupKey,
          });
        }
      } else {
        // This is a leaf bit - include parent group reference + own tags
        if (b.baseBitType) {
          const resolvedGroups = resolveGroupReferences(`group-${b.baseBitType}`);
          for (const groupKey of resolvedGroups) {
            tags.push({
              type: 'group',
              key: groupKey,
            });
          }
        }
        for (const [_tagKey, tag] of tagEntries) {
          tags.push(...processTagEntries(tag, []));
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
          for (const gk of resolvedGroups) {
            tags.push({
              type: 'group',
              key: gk,
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
