import path from 'node:path';

import fs from 'fs-extra';

import { Config } from '../config/Config.ts';
import type { _BitConfig, _GroupsConfig } from '../model/config/_Config.ts';
import type { BitConfig } from '../model/config/BitConfig.ts';
import { typeFromConfigKey } from '../model/config/enum/ConfigKey.ts';
import type { PropertyTagConfig } from '../model/config/PropertyTagConfig.ts';
import { BitTagConfigKeyType } from '../model/enum/BitTagConfigKeyType.ts';
import { BitType } from '../model/enum/BitType.ts';
import { TagFormat } from '../model/enum/TagFormat.ts';

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
    // const bitConfigs: (_BitConfig & { bitType: BitTypeType })[] = [];
    // const groupConfigs: (_GroupsConfig & { key: string })[] = [];
    // for (const bt of BitType.values()) {
    //   const bitType = Config.getBitType(bt);
    //   const _bitConfig: _BitConfig & { bitType: BitTypeType } = BITS[bitType] as _BitConfig & {
    //     bitType: BitTypeType;
    //   };
    //   if (_bitConfig) {
    //     _bitConfig.bitType = bitType;
    //     bitConfigs.push(_bitConfig);
    //   }
    //   // const config: BitConfig = Config.getBitConfig(bitType);
    //   // bitConfigs.push(config);
    // }
    // for (const [k, g] of Object.entries(GROUPS)) {
    //   const g2 = g as unknown as _GroupsConfig & { key: string };
    //   let k2 = k as string;
    //   if (k.startsWith('group_')) k2 = k2.substring(6);
    //   k2 = '_' + k2;
    //   g2.key = k2;
    //   groupConfigs.push(g2);
    // }
    // const outputFolder = opts.outputDir ?? 'assets/config';
    // const outputFolderBits = path.join(outputFolder, 'bits');
    // const outputFolderGroups = path.join(outputFolder, 'groups');
    // fs.ensureDirSync(outputFolderBits);
    // fs.ensureDirSync(outputFolderGroups);
    // const fileWrites: Promise<void>[] = [];
    // // BitConfigs
    // for (const b of bitConfigs) {
    //   const inherits = [];
    //   const tags = [];
    //   const tagEntriesTypeOrder = [
    //     BitTagConfigKeyType.tag,
    //     BitTagConfigKeyType.property,
    //     BitTagConfigKeyType.resource,
    //     BitTagConfigKeyType.group,
    //     BitTagConfigKeyType.unknown,
    //   ];
    //   const tagEntries = Object.entries(b.tags ?? []).sort((a, b) => {
    //     const tagA = a[1];
    //     const tagB = b[1];
    //     const typeA = typeFromConfigKey(tagA.key);
    //     const typeB = typeFromConfigKey(tagB.key);
    //     const typeOrder = tagEntriesTypeOrder.indexOf(typeA) - tagEntriesTypeOrder.indexOf(typeB);
    //     return typeOrder;
    //   });
    //   if (b.baseBitType) inherits.push(b.baseBitType);
    //   for (const [tagKey, tag] of tagEntries) {
    //     const tagName = tagKey;
    //     let tagKeyPrefix = '';
    //     let format = '';
    //     let description = '';
    //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //     let chain: any = undefined;
    //     const tagType = typeFromConfigKey(tag.key);
    //     if (tagType === BitTagConfigKeyType.tag) {
    //       if (tagName === '%') {
    //         description = 'Item';
    //         chain = {
    //           key: '%',
    //           format,
    //           min: tag.minCount,
    //           max: tag.maxCount,
    //           description: 'Lead',
    //           chain: {
    //             key: '%',
    //             format,
    //             min: tag.minCount,
    //             max: tag.maxCount,
    //             description: 'Page number',
    //             chain: {
    //               key: '%',
    //               format,
    //               min: tag.minCount,
    //               max: tag.maxCount,
    //               description: 'Margin number',
    //             },
    //           },
    //         };
    //       } else if (tagName === '!') {
    //         description = 'Instruction';
    //       } else if (tagName === '?') {
    //         description = 'Hint';
    //       } else if (tagName === '#') {
    //         description = 'Title';
    //       } else if (tagName === '##') {
    //         description = 'Sub-title';
    //       } else if (tagName === '▼') {
    //         description = 'Anchor';
    //       } else if (tagName === '►') {
    //         description = 'Reference';
    //       } else if (tagName === '$') {
    //         description = 'Sample solution';
    //       } else if (tagName === '&') {
    //         description = 'Resource';
    //       } else if (tagName === '+') {
    //         description = 'True statement';
    //       } else if (tagName === '-') {
    //         description = 'False statement';
    //       } else if (tagName === '_') {
    //         description = 'Gap';
    //       } else if (tagName === '=') {
    //         description = 'Mark';
    //       }
    //       format = 'bitmark--';
    //     } else if (tagType === BitTagConfigKeyType.property) {
    //       tagKeyPrefix = '@';
    //       const resolvedProperty = Config.getTagConfigForTag(tagKey);
    //       const property = resolvedProperty as PropertyTagConfig;
    //       // format
    //       if (property.format === TagFormat.plainText) {
    //         format = 'string';
    //       } else if (property.format === TagFormat.boolean) {
    //         format = 'bool';
    //       } else if (property.format === TagFormat.bitmarkText) {
    //         format = 'bitmark';
    //       } else if (property.format === TagFormat.number) {
    //         format = 'number';
    //       }
    //     } else if (tag.type === BitTagConfigKeyType.resource) {
    //       tagKeyPrefix = '&';
    //     } else if (tag.type === BitTagConfigKeyType.group) {
    //       tagKeyPrefix = '@';
    //       let k = tag.key as string;
    //       if (k.startsWith('group_')) k = k.substring(6);
    //       k = '_' + k;
    //       inherits.push(k);
    //       continue;
    //     }
    //     const t = {
    //       key: tagKeyPrefix + tagName,
    //       format,
    //       default: null,
    //       alwaysInclude: false,
    //       min: tag.minCount == null ? 0 : tag.minCount,
    //       max: tag.maxCount == null ? 1 : tag.maxCount,
    //       description,
    //       chain,
    //       // raw: {
    //       //   ...tag,
    //       // },
    //     };
    //     tags.push(t);
    //   }
    //   const bitJson = {
    //     name: b.bitType,
    //     description: '',
    //     since: b.since,
    //     deprecated: b.deprecated,
    //     history: [
    //       {
    //         version: b.since,
    //         changes: ['Initial version'],
    //       },
    //     ],
    //     format: b.textFormatDefault ?? 'bitmark--',
    //     bodyAllowed: b.bodyAllowed ?? true,
    //     bodyRequired: b.bodyRequired ?? false,
    //     footerAllowed: b.footerAllowed ?? true,
    //     footerRequired: b.footerRequired ?? false,
    //     resourceAttachmentAllowed: b.resourceAttachmentAllowed ?? true,
    //     inherits,
    //     tags,
    //   };
    //   const output = path.join(outputFolderBits, `${b.bitType}.jsonc`);
    //   const str = JSON.stringify(bitJson, null, 2);
    //   fileWrites.push(fs.writeFile(output, str));
    //   // const bitType = b.bitType;
    //   // const bitType2 = Config.getBitType(bitType);
    //   // if (bitType !== bitType2) {
    //   //   console.log(`BitType: ${bitType} => ${bitType2}`);
    //   // }
    // }
    // // GroupConfigs
    // const writeGroupConfigs = (groupConfigs: (_GroupsConfig & { key: string })[]) => {
    //   for (const g of groupConfigs) {
    //     const inherits = [];
    //     const tags = [];
    //     // if (g.key == '_resourceImage') debugger;
    //     const tagEntriesTypeOrder = [
    //       BitTagConfigKeyType.tag,
    //       BitTagConfigKeyType.property,
    //       BitTagConfigKeyType.resource,
    //       BitTagConfigKeyType.group,
    //     ];
    //     const tagEntries = Object.entries(g.tags ?? []).sort((a, b) => {
    //       const tagA = a[1];
    //       const tagB = b[1];
    //       const typeOrder =
    //         tagEntriesTypeOrder.indexOf(tagA.type) - tagEntriesTypeOrder.indexOf(tagB.type);
    //       return typeOrder;
    //     });
    //     for (const [_tagKey, tag] of tagEntries) {
    //       let tagName = tag.configKey as string;
    //       let tagKeyPrefix = '';
    //       let format = '';
    //       let description = '';
    //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //       let chain: any = undefined;
    //       if (tag.type === BitTagConfigKeyType.tag) {
    //         const resolvedTag = TAGS[tag.configKey];
    //         tagName = resolvedTag.tag;
    //         if (tagName === '%') {
    //           description = 'Item';
    //           chain = {
    //             key: '%',
    //             format,
    //             min: tag.minCount,
    //             max: tag.maxCount,
    //             description: 'Lead',
    //             chain: {
    //               key: '%',
    //               format,
    //               min: tag.minCount,
    //               max: tag.maxCount,
    //               description: 'Page number',
    //               chain: {
    //                 key: '%',
    //                 format,
    //                 min: tag.minCount,
    //                 max: tag.maxCount,
    //                 description: 'Margin number',
    //               },
    //             },
    //           };
    //         } else if (tagName === '!') {
    //           description = 'Instruction';
    //         } else if (tagName === '?') {
    //           description = 'Hint';
    //         } else if (tagName === '#') {
    //           description = 'Title';
    //         } else if (tagName === '##') {
    //           description = 'Sub-title';
    //         } else if (tagName === '▼') {
    //           description = 'Anchor';
    //         } else if (tagName === '►') {
    //           description = 'Reference';
    //         } else if (tagName === '$') {
    //           description = 'Sample solution';
    //         } else if (tagName === '&') {
    //           description = 'Resource';
    //         } else if (tagName === '+') {
    //           description = 'True statement';
    //         } else if (tagName === '-') {
    //           description = 'False statement';
    //         } else if (tagName === '_') {
    //           description = 'Gap';
    //         } else if (tagName === '=') {
    //           description = 'Mark';
    //         }
    //         format = 'bitmark--';
    //       } else if (tag.type === BitTagConfigKeyType.property) {
    //         const resolvedProperty = PROPERTIES[tag.configKey];
    //         tagName = resolvedProperty.tag;
    //         tagKeyPrefix = '@';
    //         const property = resolvedProperty as PropertyTagConfig;
    //         // format
    //         if (property.format === TagFormat.plainText) {
    //           format = 'string';
    //         } else if (property.format === TagFormat.boolean) {
    //           format = 'bool';
    //         } else if (property.format === TagFormat.bitmarkText) {
    //           format = 'bitmark';
    //         } else if (property.format === TagFormat.number) {
    //           format = 'number';
    //         }
    //       } else if (tag.type === BitTagConfigKeyType.resource) {
    //         tagKeyPrefix = '&';
    //         format = 'string';
    //       } else if (tag.type === BitTagConfigKeyType.group) {
    //         tagKeyPrefix = '@';
    //         let k = tag.configKey as string;
    //         if (k.startsWith('group_')) k = k.substring(6);
    //         k = '_' + k;
    //         inherits.push(k);
    //         continue;
    //       }
    //       const t = {
    //         key: tagKeyPrefix + tagName,
    //         format,
    //         default: null,
    //         alwaysInclude: false,
    //         min: tag.minCount == null ? 0 : tag.minCount,
    //         max: tag.maxCount == null ? 1 : tag.maxCount,
    //         description,
    //         chain,
    //         // raw: {
    //         //   ...tag,
    //         // },
    //       };
    //       tags.push(t);
    //     }
    //     const bitJson = {
    //       name: g.key,
    //       description: '',
    //       since: 'UNKNOWN',
    //       deprecated: g.deprecated,
    //       history: [
    //         {
    //           version: 'UNKNOWN',
    //           changes: ['Initial version'],
    //         },
    //       ],
    //       inherits,
    //       tags,
    //       // cards: [
    //       //   {
    //       //     card: null,
    //       //     side: 1,
    //       //     variant: null,
    //       //     description: '',
    //       //     tags: [],
    //       //   },
    //       //   {
    //       //     card: null,
    //       //     side: 2,
    //       //     variant: 1,
    //       //     description: '',
    //       //     tags: [],
    //       //   },
    //       //   {
    //       //     card: null,
    //       //     side: 2,
    //       //     variant: null,
    //       //     description: '',
    //       //     tags: [],
    //       //   },
    //       // ],
    //     };
    //     const output = path.join(outputFolderGroups, `${g.key}.jsonc`);
    //     const str = JSON.stringify(bitJson, null, 2);
    //     fileWrites.push(fs.writeFile(output, str));
    //     // const bitType = b.bitType;
    //     // const bitType2 = Config.getBitType(bitType);
    //     // if (bitType !== bitType2) {
    //     //   console.log(`BitType: ${bitType} => ${bitType2}`);
    //     // }
    //   }
    // };
    // writeGroupConfigs(groupConfigs);
    // await Promise.all(fileWrites);
  }

  public buildFlat(options?: GenerateConfigOptions): void {
    const opts: GenerateConfigOptions = Object.assign({}, options);
    const bitConfigs: BitConfig[] = [];

    for (const bt of BitType.values()) {
      const bitType = Config.getBitType(bt);
      const bitConfig = Config.getBitConfig(bitType);
      if (bitConfig) bitConfigs.push(bitConfig);
    }

    const outputFolder = opts.outputDir ?? 'assets/config';
    const outputFolderBits = path.join(outputFolder, 'bits_flat');
    fs.ensureDirSync(outputFolderBits);

    // BitConfigs
    for (const b of bitConfigs) {
      const inherits = [];
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

      for (const [tagKey, tag] of tagEntries) {
        let tagName = tagKey;
        let tagKeyPrefix = '';
        let format = '';
        let description = '';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let chain: any = undefined;
        if (tag.type === BitTagConfigKeyType.tag) {
          tagName = tag.tag;
          if (tagName === '%') {
            description = 'Item';
            chain = {
              key: '%',
              format,
              min: tag.minCount,
              max: tag.maxCount,
              description: 'Lead',
              chain: {
                key: '%',
                format,
                min: tag.minCount,
                max: tag.maxCount,
                description: 'Page number',
                chain: {
                  key: '%',
                  format,
                  min: tag.minCount,
                  max: tag.maxCount,
                  description: 'Margin number',
                },
              },
            };
          } else if (tagName === '!') {
            description = 'Instruction';
          } else if (tagName === '?') {
            description = 'Hint';
          } else if (tagName === '#') {
            description = 'Title';
          } else if (tagName === '##') {
            description = 'Sub-title';
          } else if (tagName === '▼') {
            description = 'Anchor';
          } else if (tagName === '►') {
            description = 'Reference';
          } else if (tagName === '$') {
            description = 'Sample solution';
          } else if (tagName === '&') {
            description = 'Resource';
          } else if (tagName === '+') {
            description = 'True statement';
          } else if (tagName === '-') {
            description = 'False statement';
          } else if (tagName === '_') {
            description = 'Gap';
          } else if (tagName === '=') {
            description = 'Mark';
          }
          format = 'bitmark--';
        } else if (tag.type === BitTagConfigKeyType.property) {
          tagName = tag.tag;
          tagKeyPrefix = '@';
          const property = tag as PropertyTagConfig;
          // format
          if (property.format === TagFormat.plainText) {
            format = 'string';
          } else if (property.format === TagFormat.boolean) {
            format = 'bool';
          } else if (property.format === TagFormat.bitmarkText) {
            format = 'bitmark';
          } else if (property.format === TagFormat.number) {
            format = 'number';
          }
        } else if (tag.type === BitTagConfigKeyType.resource) {
          tagKeyPrefix = '&';
        } else if (tag.type === BitTagConfigKeyType.group) {
          tagKeyPrefix = '@';
          let k = tag.configKey as string;
          if (k.startsWith('group_')) k = k.substring(6);
          k = '_' + k;
          inherits.push(k);
          continue;
        }
        const t = {
          key: tagKeyPrefix + tagName,
          format,
          default: null,
          alwaysInclude: false,
          min: tag.minCount == null ? 0 : tag.minCount,
          max: tag.maxCount == null ? 1 : tag.maxCount,
          description,
          chain,
          // raw: {
          //   ...tag,
          // },
        };
        tags.push(t);
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
