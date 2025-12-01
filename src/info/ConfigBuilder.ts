import path from 'node:path';

import { Enum } from '@ncoderz/superenum';
import fs from 'fs-extra';

import { Config } from '../config/Config.ts';
import { BITS } from '../config/raw/bits.ts';
import { GROUPS } from '../config/raw/groups.ts';
import type { _BitConfig, _GroupsConfig } from '../model/config/_Config.ts';
import type { BitConfig } from '../model/config/BitConfig.ts';
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

class ConfigBuilder {
  public build(options?: GenerateConfigOptions): void {
    const opts: GenerateConfigOptions = Object.assign({}, options);

    this.buildFlat(opts);

    const bitConfigs: (_BitConfig & { bitType: BitTypeType })[] = [];
    const groupConfigs: (_GroupsConfig & { key: string })[] = [];

    const bitGroupConfigKeys: BitTypeType[] = [];
    const bitGroupConfigs: (_BitConfig & { bitType: BitTypeType })[] = [];

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
    fs.ensureDirSync(outputFolderBits);
    fs.ensureDirSync(outputFolderGroups);
    const fileWrites: Promise<void>[] = [];

    const keyToJsonKey = (key: string, tagNameChain: string[]): string => {
      let jsonKey = key;

      if (key === '%') {
        jsonKey = 'item_todo';
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
        jsonKey = 'true_todo';
      } else if (key === '-') {
        jsonKey = 'false_todo';
      } else if (key === '_') {
        jsonKey = 'gap_todo';
      } else if (key === '=') {
        jsonKey = 'mark_todo';
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
      const jsonKey = keyToJsonKey(tagName, tagNameChain);
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
        format = 'bitmark--';
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
        tags.push({
          type: 'group',
          key: k,
        });
        return tags;
      }

      // Process chain
      if (Array.isArray(tag.chain) && tag.chain.length > 0) {
        const chainTags: unknown[] = [];
        for (const [_tagKey, chainTag] of tag.chain.entries()) {
          chainTags.push(...processTagEntries(chainTag, [...tagNameChain, jsonKey]));
        }
        chain = chainTags;
      }

      const t = {
        type: 'tag',
        key: tagName,
        jsonKey,
        format,
        default: null,
        alwaysInclude: false,
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

    // BitConfigs
    for (const b of bitConfigs) {
      const tags: unknown[] = [];
      const tagEntriesTypeOrder = [
        BitTagConfigKeyType.tag,
        BitTagConfigKeyType.property,
        BitTagConfigKeyType.resource,
        BitTagConfigKeyType.group,
        BitTagConfigKeyType.unknown,
      ];
      const tagEntries = Object.entries(b.tags ?? []).sort((a, b) => {
        const tagA = a[1];
        const tagB = b[1];
        const typeA = typeFromConfigKey(tagA.key);
        const typeB = typeFromConfigKey(tagB.key);
        const typeOrder = tagEntriesTypeOrder.indexOf(typeA) - tagEntriesTypeOrder.indexOf(typeB);
        return typeOrder;
      });
      if (b.baseBitType) {
        tags.push({
          type: 'group',
          key: `group-${b.baseBitType}`,
        });
        bitGroupConfigKeys.push(b.baseBitType);
      }
      for (const [_tagKey, tag] of tagEntries) {
        tags.push(...processTagEntries(tag, []));
      }

      const bitJson = {
        name: b.bitType,
        description: b.description ?? '',
        since: b.since,
        deprecated: b.deprecated,
        history: [
          {
            version: b.since,
            changes: ['Initial version'],
          },
        ],
        format: b.textFormatDefault ?? 'bitmark--',
        bodyAllowed: b.bodyAllowed ?? true,
        bodyRequired: b.bodyRequired ?? false,
        footerAllowed: b.footerAllowed ?? true,
        footerRequired: b.footerRequired ?? false,
        resourceAttachmentAllowed: b.resourceAttachmentAllowed ?? true,
        tags,
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

    // Convert bits that are depended on to groups
    for (const bt of bitGroupConfigKeys) {
      const bitType = Config.getBitType(bt);
      const _bitConfig: _BitConfig & { bitType: BitTypeType } = BITS[bitType] as _BitConfig & {
        bitType: BitTypeType;
      };
      if (_bitConfig) {
        _bitConfig.bitType = bitType;
        bitGroupConfigs.push(_bitConfig);
      }
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

    // Bits as GroupConfigs
    const writeBitsAsGroupConfigs = (
      bitsAsGroupConfigs: (_BitConfig & { bitType: BitTypeType })[],
    ) => {
      for (const b of bitsAsGroupConfigs) {
        const groupKey = `group-${b.bitType}`;
        const tags: unknown[] = [];
        const tagEntriesTypeOrder = [
          BitTagConfigKeyType.tag,
          BitTagConfigKeyType.property,
          BitTagConfigKeyType.resource,
          BitTagConfigKeyType.group,
          BitTagConfigKeyType.unknown,
        ];
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
  }

  // Build flat bit configs
  public buildFlat(options?: GenerateConfigOptions): void {
    const opts: GenerateConfigOptions = Object.assign({}, options);
    const bitConfigs: BitConfig[] = [];

    for (const bt of Enum(BitType).values()) {
      const bitType = Config.getBitType(bt);
      const bitConfig = Config.getBitConfig(bitType);
      if (bitConfig) bitConfigs.push(bitConfig);
    }

    const outputFolder = opts.outputDir ?? 'assets/config';
    const outputFolderBits = path.join(outputFolder, 'bits_flat');
    fs.ensureDirSync(outputFolderBits);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const processTagEntries = (tag: any): any[] => {
      const tags: unknown[] = [];
      let tagName = tag.key as string;
      // if (tagName == '&image') debugger;
      const tagType = typeFromConfigKey(tag.key);
      let format = '';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let chain: any = undefined;
      if (tagType === BitTagConfigKeyType.tag) {
        // const resolvedTag = TAGS[tag.configKey];
        // tagName = resolvedTag.tag;
        tagName = tag.name;
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
        format = 'bitmark--';
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
        tags.push({
          type: 'group',
          key: k,
        });
        return tags;
      }

      // Process chain
      if (Array.isArray(tag.chain) && tag.chain.length > 0) {
        const chainTags: unknown[] = [];
        for (const [_tagKey, chainTag] of tag.chain.entries()) {
          chainTags.push(...processTagEntries(chainTag));
        }
        chain = chainTags;
      }

      const t = {
        key: tagName,
        format,
        default: null,
        alwaysInclude: false,
        min: tag.minCount == null ? 0 : tag.minCount,
        max: tag.maxCount == null ? 1 : tag.maxCount,
        description: tag.description ?? '',
        chain,
        // raw: {
        //   ...tag,
        // },
      };
      tags.push(t);
      return tags;
    };

    // BitConfigs
    for (const b of bitConfigs) {
      const tags = [];
      const tagEntriesTypeOrder = [
        BitTagConfigKeyType.tag,
        BitTagConfigKeyType.property,
        BitTagConfigKeyType.resource,
        BitTagConfigKeyType.group,
        BitTagConfigKeyType.unknown,
      ];

      const tagEntries = Object.entries(b.tags ?? []).sort((a, b) => {
        const tagA = a[1];
        const tagB = b[1];
        const typeA = typeFromConfigKey(tagA.configKey);
        const typeB = typeFromConfigKey(tagB.configKey);
        const typeOrder = tagEntriesTypeOrder.indexOf(typeA) - tagEntriesTypeOrder.indexOf(typeB);
        return typeOrder;
      });

      for (const [_tagKey, tag] of tagEntries) {
        // let tagName = tagKey;
        // let tagKeyPrefix = '';
        // let format = '';
        // let description = '';
        // // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // let chain: any = undefined;
        // if (tag.type === BitTagConfigKeyType.tag) {
        //   tagName = tag.tag;
        //   if (tagName === '%') {
        //     description = 'Item';
        //     chain = {
        //       key: '%',
        //       format,
        //       min: tag.minCount,
        //       max: tag.maxCount,
        //       description: 'Lead',
        //       chain: {
        //         key: '%',
        //         format,
        //         min: tag.minCount,
        //         max: tag.maxCount,
        //         description: 'Page number',
        //         chain: {
        //           key: '%',
        //           format,
        //           min: tag.minCount,
        //           max: tag.maxCount,
        //           description: 'Margin number',
        //         },
        //       },
        //     };
        //   } else if (tagName === '!') {
        //     description = 'Instruction';
        //   } else if (tagName === '?') {
        //     description = 'Hint';
        //   } else if (tagName === '#') {
        //     description = 'Title';
        //   } else if (tagName === '##') {
        //     description = 'Sub-title';
        //   } else if (tagName === '▼') {
        //     description = 'Anchor';
        //   } else if (tagName === '►') {
        //     description = 'Reference';
        //   } else if (tagName === '$') {
        //     description = 'Sample solution';
        //   } else if (tagName === '&') {
        //     description = 'Resource';
        //   } else if (tagName === '+') {
        //     description = 'True statement';
        //   } else if (tagName === '-') {
        //     description = 'False statement';
        //   } else if (tagName === '_') {
        //     description = 'Gap';
        //   } else if (tagName === '=') {
        //     description = 'Mark';
        //   }
        //   format = 'bitmark--';
        // } else if (tag.type === BitTagConfigKeyType.property) {
        //   tagName = tag.tag;
        //   tagKeyPrefix = '@';
        //   const property = tag as PropertyTagConfig;
        //   // format
        //   if (property.format === TagFormat.plainText) {
        //     format = 'string';
        //   } else if (property.format === TagFormat.boolean) {
        //     format = 'bool';
        //   } else if (property.format === TagFormat.bitmarkText) {
        //     format = 'bitmark';
        //   } else if (property.format === TagFormat.number) {
        //     format = 'number';
        //   }
        // } else if (tag.type === BitTagConfigKeyType.resource) {
        //   tagKeyPrefix = '&';
        // } else if (tag.type === BitTagConfigKeyType.group) {
        //   tagKeyPrefix = '@';
        //   let k = tag.configKey as string;
        //   if (k.startsWith('group_')) k = k.substring(6);
        //   k = '_' + k;
        //   inherits.push({
        //     type: 'group',
        //     name: k,
        //   });
        //   continue;
        // }
        // const t = {
        //   key: tagKeyPrefix + tagName,
        //   format,
        //   default: null,
        //   alwaysInclude: false,
        //   min: tag.minCount == null ? 0 : tag.minCount,
        //   max: tag.maxCount == null ? 1 : tag.maxCount,
        //   description,
        //   chain,
        //   // raw: {
        //   //   ...tag,
        //   // },
        // };
        // tags.push(t);
        tags.push(...processTagEntries(tag));
      }
      const bitJson = {
        name: b.bitType,
        description: '',
        since: b.since,
        deprecated: b.deprecated,
        history: [
          {
            version: b.since,
            changes: ['Initial version'],
          },
        ],
        format: b.textFormatDefault ?? 'bitmark--',
        bodyAllowed: b.bodyAllowed ?? true,
        bodyRequired: b.bodyRequired ?? false,
        footerAllowed: b.footerAllowed ?? true,
        footerRequired: b.footerRequired ?? false,
        resourceAttachmentAllowed: b.resourceAttachmentAllowed ?? true,
        tags,
      };
      const output = path.join(outputFolderBits, `${b.bitType}.jsonc`);
      const str = JSON.stringify(bitJson, null, 2);
      fs.writeFileSync(output, str);
      // const bitType = b.bitType;
      // const bitType2 = Config.getBitType(bitType);
      // if (bitType !== bitType2) {
      //   console.log(`BitType: ${bitType} => ${bitType2}`);
      // }
    }
  }
}

export { ConfigBuilder };
