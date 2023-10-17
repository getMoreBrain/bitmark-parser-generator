/**
 * BitmarkPegParserValidator.ts
 * RA Sewell
 *
 * (c) 2023 Get More Brain AG
 * All rights reserved.
 *
 */

import { Config } from '../../../config/Config';
import { BreakscapedString } from '../../../model/ast/BreakscapedString';
import { Body } from '../../../model/ast/Nodes';
import { CardSetConfig } from '../../../model/config/CardSetConfig';
import { CardVariantConfig } from '../../../model/config/CardVariantConfig';
import { TagsConfig } from '../../../model/config/TagsConfig';
import { BitTagType, BitTagTypeType } from '../../../model/enum/BitTagType';
import { BitType } from '../../../model/enum/BitType';
import { Count, CountType } from '../../../model/enum/Count';
import { ResourceTagType } from '../../../model/enum/ResourceTag';
import { TagType } from '../../../model/enum/Tag';
import { TagValidationData } from '../../../model/parser/TagValidationData';

import {
  BitContent,
  BitContentLevel,
  BitContentLevelType,
  BitmarkPegParserContext,
  ParsedCardSet,
  TypeKey,
  TypeKeyType,
  TypeKeyValue,
} from './BitmarkPegParserTypes';

const COMMON_MISTAKE_STRINGS = [
  // Card divider errors
  '====',
  '----',
  '\n==\n',
  '\n---\n',
  '\n--\n',
  // Remark errors
  ':::',
  '::::',
  // Comment errors
  '|||',
  '||||',
];

const COMMON_STARTS_WITH_MISTAKE_STRINGS = [
  // Card divider errors
  '==\n',
  '---\n',
  '--\n',
];

const COMMON_ENDS_WITH_MISTAKE_STRINGS = [
  // Card divider errors
  '\n==',
  '\n---',
  '\n--',
];

interface WarningInfo {
  invalid?: boolean; // Tag / data is not valid for this bit
  tooMany?: number; // The tag / data has been included too many times (should be at most this many times)
  tooFew?: number; // The tag / data has not been included enough times (should be at least this many times)
  extraProperty?: boolean; // The property is not recognised, but will be included as an extra property
  excessResource?: boolean; // The resource is not allowed, but will be included as an excess resource
  unexpectedCardSet?: boolean; // The card set was not expected for this bit
  unexpectedCardSideVariant?: boolean; // The card side variant is not recognised for the card set
}

interface ValidateReturn {
  content?: BitContent | undefined;
  warning?: WarningInfo;
}

class BitmarkPegParserValidator {
  /**
   * Validate the bit tags and tag chains.
   *
   * Any unknown tag chains will be 'unchained' and processed as individual tags.
   *
   * @param context
   * @param bitType
   * @param resourceType the resource type specified in the bit header
   * @param data the unvalidated bit content from the parser
   *
   * @returns the validated and potentially unchained bit content
   */
  validateBitTags(
    context: BitmarkPegParserContext,
    bitType: BitType,
    resourceType: ResourceTagType | undefined,
    data: BitContent[],
  ): BitContent[] {
    // if (context.DEBUG_BIT_TAG_VALIDATION) context.debugPrint('bit tag validation', data);
    if (!data) return [];

    // Get the bit config to check how to parse the bit
    const bitConfig = Config.getBitConfig(bitType);
    const { tags: bitTags, cardSet: cardSetConfig } = bitConfig;

    // Insert the resource tags from the resources config (which can depends on the resource type attachment in the bit header).
    const resourcesConfig = Config.getBitResourcesConfig(bitType, resourceType);
    const tags = { ...bitTags, ...resourcesConfig.tags };

    // Validate and convert the tag chains
    const res: BitContent[] = this.validateTagChainsRecursive(
      context,
      bitType,
      BitContentLevel.Bit,
      data,
      tags,
      cardSetConfig,
    );

    // TODO: Check the minimum counts
    // const minCount = tagData.minCount == null ? 0 : tagData.minCount;

    return res;
  }

  /**
   * Check the body of the bit.
   *
   * @param context
   * @param bitType
   * @param _bitLevel
   * @param body
   * @returns
   */
  checkBody(
    context: BitmarkPegParserContext,
    bitType: BitType,
    _bitLevel: BitContentLevelType,
    body: Body | undefined,
  ): Body | undefined {
    if (!body) return body;

    // Get the bit config to check how to parse the bit
    const bitConfig = Config.getBitConfig(bitType);
    const { bodyAllowed } = bitConfig;

    const hasBody = body.bodyParts.length > 0;

    if (hasBody && !bodyAllowed) {
      context.addWarning(`Bit '${bitType.alias}' should not have a body.`);
    }

    return body;
  }

  /**
   * Check the body part of the bit.
   *
   * @param context
   * @param _bitLevel
   * @param bitType
   * @param body
   * @returns
   */
  checkBodyPart(
    context: BitmarkPegParserContext,
    bitType: BitType,
    bitLevel: BitContentLevelType,
    bodyPart: BreakscapedString,
  ): BreakscapedString {
    if (!bodyPart) return bodyPart;

    this.checkBodyForCommonPotentialMistakes(context, bitLevel, bitType, bodyPart);

    return bodyPart;
  }

  /**
   * Check the footer of the bit.
   *
   * @param context
   * @param _bitLevel
   * @param bitType
   * @param body
   * @returns
   */
  checkFooter(
    context: BitmarkPegParserContext,
    bitType: BitType,
    bitLevel: BitContentLevelType,
    footer: BreakscapedString,
  ): BreakscapedString {
    if (!footer) return footer;

    // Get the bit config to check how to parse the bit
    const bitConfig = Config.getBitConfig(bitType);
    const { footerAllowed } = bitConfig;

    this.checkBodyForCommonPotentialMistakes(context, bitLevel, bitType, footer);

    if (!footerAllowed) {
      context.addWarning(`Bit '${bitType.alias}' should not have a footer.`);
    }

    return footer;
  }

  /**
   * Check the footer of the bit.
   *
   * @param context
   * @param _bitLevel
   * @param bitType
   * @param cardBody
   * @returns
   */
  checkCardBody(
    context: BitmarkPegParserContext,
    bitType: BitType,
    bitLevel: BitContentLevelType,
    cardBody: BreakscapedString | undefined,
    cardNo: number,
    sideNo: number,
    variantNo: number,
  ): BreakscapedString | undefined {
    if (!cardBody) return cardBody;

    // Get the bit config to check how to parse the bit
    const bitConfig = Config.getBitConfig(bitType);
    if (!bitConfig.cardSet) return cardBody; // Won't happen. Just to make TS happy

    const variantConfig = this.getVariantConfig(bitConfig.cardSet.variants, sideNo, variantNo);
    if (!variantConfig) return cardBody; // Won't happen. Just to make TS happy

    const { bodyAllowed } = variantConfig;

    this.checkBodyForCommonPotentialMistakes(context, bitLevel, bitType, cardBody);

    if (!bodyAllowed) {
      context.addWarning(
        `Bit '${bitType.alias}' should not have a card body at card:${cardNo + 1}, side:${sideNo + 1}, variant:${
          variantNo + 1
        }.`,
      );
    }

    return cardBody;
  }

  //
  // Private
  //

  /**
   * Validate tag chains as they are encountered, expanding any tag chains that are not valid,
   * so they can be processed as individual tags.
   *
   * @param context
   * @param bitLevel
   * @param bitType
   * @param data
   * @param tags
   * @param cardSetConfig
   */
  private validateTagChainsRecursive(
    context: BitmarkPegParserContext,
    bitType: BitType,
    bitLevel: BitContentLevelType,
    data: BitContent[],
    tags: TagsConfig,
    cardSetConfig?: CardSetConfig,
  ): BitContent[] {
    if (!data) return [];

    const dataOrNull: (BitContent | null)[] = [...data];

    // Get valid type keys from the tags
    const validTypeKeys = this.convertTagsToTypeKeyMap(context, bitLevel, bitType, tags);

    // Helper function for add extra valid type keys
    const addExtraValidTypeKeys = (typeKey: TypeKeyType, maxCount: CountType, minCount: number) => {
      validTypeKeys.set(typeKey, {
        maxCount,
        minCount,
        _type: typeKey as BitTagTypeType,
        _tag: typeKey as TagType,
        _seenCount: 0,
      });
    };

    // Comment tags are allowed anywhere
    addExtraValidTypeKeys(TypeKey.Comment, Count.infinity, 0);

    if (bitLevel === BitContentLevel.Bit) {
      // Add the extra valid tags dependent on bit configuration
      if (cardSetConfig) addExtraValidTypeKeys(TypeKey.CardSet, 1, 0);

      // These tags are always allowed here, and validated later
      addExtraValidTypeKeys(TypeKey.TextFormat, 1, 0);
      addExtraValidTypeKeys(TypeKey.BodyText, Count.infinity, 0);
    } else if (bitLevel === BitContentLevel.Card) {
      // These tags are always allowed here, and validated later
      addExtraValidTypeKeys(TypeKey.CardText, Count.infinity, 0);
    }

    // const end = data.length;
    for (let i = 0; i < dataOrNull.length; i++) {
      const content = dataOrNull[i];
      if (!content) continue;

      const { type, key } = content as TypeKeyValue;
      const typeKey = TypeKey.fromValue(type);
      if (!typeKey) continue; // Should not happen

      // Build the final type key with the property / resource key added
      let typeKeyPlusKey: TypeKeyType | string | undefined = typeKey;
      if (typeKey === TypeKey.Property || typeKey === TypeKey.Resource) {
        typeKeyPlusKey = `${typeKey}:${key}`;
      }

      const tagData = validTypeKeys.get(typeKeyPlusKey);

      // Validate the single tag
      const validatedTagContent = this.validateSingleTag(
        context,
        bitType,
        bitLevel,
        content,
        typeKey,
        tagData,
        cardSetConfig,
      );

      if (!validatedTagContent) {
        // Remove the tag from the data
        dataOrNull.splice(i, 1, null);
      }

      if (validatedTagContent && Array.isArray(validatedTagContent.chain) && validatedTagContent.chain.length > 0) {
        // If the content has a chain, but the validation data does not have a chain, then the chain is invalid
        // The chain is expanded and validated as individual tags

        if (tagData && tagData.chain) {
          const validatedTagChainContent = this.validateTagChainsRecursive(
            context,
            bitType,
            BitContentLevel.Chain,
            validatedTagContent.chain,
            tagData.chain,
          );
          if (validatedTagChainContent && validatedTagChainContent.length > 0) {
            validatedTagContent.chain = validatedTagChainContent;
          } else {
            // Tag chain is invalid, remove it
            validatedTagContent.chain = undefined;
          }
        } else {
          // Tag chain does not exist in bit config. Expand chain as individual tags
          // This allows for 'bugs' such as [%item][%lead] - works chained or not chained.
          // (except for resource chains)
          if (validatedTagContent.type !== TypeKey.Resource) {
            dataOrNull.splice(i + 1, 0, ...validatedTagContent.chain);
            validatedTagContent.chain = undefined;
          }
        }
      }
    }

    // Raise warnings for the minimum counts
    for (const data of validTypeKeys.values()) {
      const { minCount, _seenCount } = data;
      if (minCount != null && _seenCount < minCount) {
        const warningMsg = `${this.getTagSignature(data)} is required at least ${minCount} time(s)`;
        context.addWarning(warningMsg);
      }
    }

    // Filter all the null's from the validated tags
    const res = dataOrNull.filter((content) => content != null) as BitContent[];

    return res;
  }

  /**
   * Validate a single bit tag
   *
   * @param context
   * @param bitType
   * @param bitLevel
   * @param content
   * @param typeKey
   * @param tagValidationData
   * @param cardSetConfig
   *
   * @returns validated tag, or undefined if the tag is invalid
   */
  private validateSingleTag(
    context: BitmarkPegParserContext,
    bitType: BitType,
    bitLevel: BitContentLevelType,
    content: BitContent,
    typeKey: TypeKeyType,
    tagValidationData: TagValidationData | undefined,
    cardSetConfig: CardSetConfig | undefined,
  ): BitContent | undefined {
    // if (context.DEBUG_BIT_TAG_VALIDATION) context.debugPrint('bit tag validation', data);

    const { type, key } = content as TypeKeyValue;

    const keyStr = tagValidationData ? this.getTagSignature(tagValidationData) : this.getUnknownTagSignature(type, key);
    const ignoredStr = ' It will be ignored';
    let warningStr = '';
    let validatedContent: BitContent | undefined;
    let warning: WarningInfo | undefined;

    // // Get seen data from the seen cache
    // let seen = seenTypeKeys.get(typeKeyPlusKey);
    // if (seen == undefined) {
    //   seen = {
    //     count: 0,
    //   };
    //   seenTypeKeys.set(typeKeyPlusKey, seen);
    // }

    // let previousContent = seen.previous;
    // seen.count++;

    if (tagValidationData) {
      // Increment the seen count for this tag
      tagValidationData._seenCount++;

      // This type key is valid. Now check if it's been seen before and if so, how many times
      switch (typeKey) {
        case TypeKey.Property: {
          const { content: c, warning: w } = this.validatePropertyTag(
            context,
            bitLevel,
            bitType,
            tagValidationData,
            content as TypeKeyValue,
          );
          validatedContent = c;
          warning = w;
          break;
        }

        case TypeKey.Resource: {
          const { content: c, warning: w } = this.validateResourceTag(
            context,
            bitLevel,
            bitType,
            tagValidationData,
            content as TypeKeyValue,
          );
          validatedContent = c;
          warning = w;
          break;
        }

        case TypeKey.CardSet: {
          const { content: c, warning: w } = this.validateCardSet(
            context,
            bitType,
            tagValidationData,
            content as TypeKeyValue,
            cardSetConfig,
          );
          validatedContent = c;
          warning = w;
          break;
        }

        default: {
          const { content: c, warning: w } = this.validateStandardTag(
            context,
            bitLevel,
            bitType,
            tagValidationData,
            content as TypeKeyValue,
          );
          validatedContent = c;
          warning = w;
        }
      }
    } else {
      // type is not valid as no tag data exists for it
      switch (typeKey) {
        case TypeKey.Property: {
          // The property is not valid for this bit type, but since we allow extra properties, we will return it as
          // ok but with a warning
          warning = { extraProperty: true };
          validatedContent = content; // Add tag anyway - we don't remove extra properties
          break;
        }

        case TypeKey.Resource: {
          warning = { excessResource: true };
          validatedContent = content; // Add tag anyway, will be added as an excess resource
          break;
        }

        default:
          warning = { invalid: true };
      }
    }

    // Add a warning if there is one
    if (warning) {
      const previousContent = tagValidationData?._previous;

      // TODO - warning and ignore
      if (warning.invalid || warning.excessResource) {
        warningStr = `${keyStr} is not valid here.${ignoredStr}`;
      } else if (warning.tooMany != null) {
        warningStr = `${keyStr} is included more than ${warning.tooMany} time(s).`;
        if (warning.tooMany > 0) warningStr += ' The earlier ones will be ignored';
        // } else if (warning.tooFew != null) {
        //   warningStr = `'${type}'${keyStr} is not included enough times(s). It should be included ${warning.tooFew} time(s)`;
      } else if (warning.extraProperty) {
        warningStr = `${keyStr} is an unknown property. It can be excluded from the output using the 'excludeUnknownProperties' flag`;
      } else if (warning.unexpectedCardSet) {
        warningStr = `${keyStr} is not expected here.${ignoredStr}`;
      } else if (warning.unexpectedCardSideVariant) {
        warningStr = `${keyStr} has a card / side / variant that is not expected here.${ignoredStr}`;
      }

      context.addWarning(warningStr, content, previousContent);
    }

    // Update the seen data
    if (tagValidationData) {
      tagValidationData._previous = content;
    }

    return validatedContent;
  }

  /**
   * Validates a standard bit tag
   *
   * @param context
   * @param bitLevel
   * @param bitType
   * @param tagValidationData
   * @param content
   * @param seen
   *
   * @returns validated tag (plus warning message if one is generated) or undefined if the tag is invalid
   */
  private validateStandardTag(
    _context: BitmarkPegParserContext,
    _bitLevel: BitContentLevelType,
    _bitType: BitType,
    tagValidationData: TagValidationData,
    content: TypeKeyValue,
  ): ValidateReturn {
    // Check if the property is valid for this bit type

    const validCount = tagValidationData.maxCount == null ? 1 : tagValidationData.maxCount;

    // If validCount is infinity, an infinite number of this type is allowed
    if (validCount !== Count.infinity) {
      if (tagValidationData._seenCount > validCount) {
        return {
          warning: { tooMany: validCount },
          content: content, // Return content anyway when too many, as last wins
        };
      }
    }

    // If we get here, the property is valid and can be added
    return {
      content: content,
    };
  }

  /**
   * Validates a single property tag
   *
   * @param context
   * @param bitLevel
   * @param bitType
   * @param tagValidationData
   * @param content
   * @param seen
   *
   * @returns validated tag (plus warning message if one is generated) or undefined if the tag is invalid
   */
  private validatePropertyTag(
    _context: BitmarkPegParserContext,
    _bitLevel: BitContentLevelType,
    _bitType: BitType,
    tagValidationData: TagValidationData,
    content: TypeKeyValue,
  ): ValidateReturn {
    // Check if the property is valid for this bit type

    const validCount = tagValidationData.maxCount == null ? 1 : tagValidationData.maxCount;

    // If validCount is infinity, an infinite number of this type is allowed
    if (validCount !== Count.infinity) {
      if (tagValidationData._seenCount > validCount) {
        return {
          warning: { tooMany: validCount },
          content: content, // Return content anyway when too many, as last wins
        };
      }
    }

    // If we get here, the property is valid and can be added
    return {
      content: content,
    };
  }

  /**
   * Validates a single resource tag
   *
   * @param context
   * @param bitLevel
   * @param bitType
   * @param tagValidationData
   * @param content
   * @param seen
   *
   * @returns validated tag (plus warning message if one is generated) or undefined if the tag is invalid
   */
  private validateResourceTag(
    _context: BitmarkPegParserContext,
    _bitLevel: BitContentLevelType,
    _bitType: BitType,
    tagValidationData: TagValidationData,
    content: TypeKeyValue,
  ): ValidateReturn {
    // Check if the resource is valid for this bit type

    const validCount = tagValidationData.maxCount == null ? 1 : tagValidationData.maxCount;

    // If validCount is infinity, an infinite number of this type is allowed
    if (validCount !== Count.infinity) {
      if (tagValidationData._seenCount > validCount) {
        return {
          warning: { tooMany: validCount },
          content: content, // Return content anyway when too many, as last wins
        };
      }
    }

    // If we get here, the property is valid and can be added
    return {
      content: content,
    };
  }

  /**
   * Validates a card set
   *
   * @param context
   * @param bitLevel
   * @param bitType
   * @param _tagValidationData
   * @param content
   * @param cardSetConfig
   * @param depth recursion depth
   *
   * @returns validated tag (plus warning message if one is generated) or undefined if the tag is invalid
   */
  private validateCardSet(
    context: BitmarkPegParserContext,
    bitType: BitType,
    _tagValidationData: TagValidationData,
    content: TypeKeyValue,
    cardSetConfig: CardSetConfig | undefined,
  ): ValidateReturn {
    // if (context.DEBUG_BIT_TAG_VALIDATION) context.debugPrint('bit tag validation', data);

    if (!cardSetConfig || !cardSetConfig.variants || cardSetConfig.variants.length === 0) {
      // Card set exists with no card set config for the bit
      return {
        warning: { unexpectedCardSet: true },
      };
    }

    const { value } = content;
    const cardSet = value as ParsedCardSet;
    let warning: WarningInfo | undefined;

    // For each of the variants in the card set, validate its contents
    let sideIndex = 0;
    let variantIndex = 0;
    for (const card of cardSet.cards) {
      sideIndex = 0;
      for (const side of card.sides) {
        variantIndex = 0;
        for (const variant of side.variants) {
          const variantContent = variant.content;
          let validatedContent: BitContent[] | undefined;
          const variantConfig = this.getVariantConfig(cardSetConfig.variants, sideIndex, variantIndex);

          if (variantConfig) {
            // Validate the variant against the config
            validatedContent = this.validateTagChainsRecursive(
              context,
              bitType,
              BitContentLevel.Card,
              variantContent,
              variantConfig.tags,
            );
          } else {
            // TODO - warning!
            warning = {
              unexpectedCardSideVariant: true,
            };
          }

          // TODO - add the validated content to the card set, or remove the invalid variant
          if (validatedContent && validatedContent.length > 0) {
            side.variants[variantIndex] = {
              parser: variant.parser,
              content: validatedContent,
            };
          } else {
            // Variant is invalid, remove it
            side.variants[variantIndex] = {
              parser: variant.parser,
              content: [],
            };
          }

          variantIndex++;
        }
        sideIndex++;
      }
    }

    return {
      content: content,
      warning,
    };
  }

  /**
   * Check the body of the bit for patterns which indicate common potential bitmark language mistakes.
   *
   * @param context
   * @param _bitLevel
   * @param bitType
   * @param body
   * @returns
   */
  private checkBodyForCommonPotentialMistakes(
    context: BitmarkPegParserContext,
    _bitLevel: BitContentLevelType,
    bitType: BitType,
    body: string,
  ): void {
    if (!body) return;

    for (const mistake of COMMON_MISTAKE_STRINGS) {
      if (body.includes(mistake)) {
        context.addWarning(`Bit '${bitType.alias}' might contain a mistake: ${mistake}`);
      }
    }

    for (const mistake of COMMON_STARTS_WITH_MISTAKE_STRINGS) {
      if (body.startsWith(mistake)) {
        context.addWarning(`Bit '${bitType.alias}' might contain a mistake: ${mistake}`);
      }
    }

    for (const mistake of COMMON_ENDS_WITH_MISTAKE_STRINGS) {
      if (body.endsWith(mistake)) {
        context.addWarning(`Bit '${bitType.alias}' might contain a mistake: ${mistake}`);
      }
    }
  }

  /**
   * Convert the tag data configuration to TypeKeys
   *
   * @param context
   * @param _bitLevel
   * @param bitType
   * @param tags
   * @param depth recursion depth
   * @returns
   */
  private convertTagsToTypeKeyMap(
    _context: BitmarkPegParserContext,
    _bitLevel: BitContentLevelType,
    _bitType: BitType,
    tags: TagsConfig,
  ): Map<TypeKeyType | string, TagValidationData> {
    // Using a map here as we might add the 'count' of tags valid at a later stage
    const res = new Map<TypeKeyType | string, TagValidationData>();

    // Add the tags
    for (const v of Object.values(tags)) {
      // Save the key in the TagData
      const tagValidationData: TagValidationData = {
        minCount: v.minCount,
        maxCount: v.maxCount,
        isTag: v.type === BitTagType.tag,
        isProperty: v.type === BitTagType.property,
        isResource: v.type === BitTagType.resource,
        chain: v.chain,

        // Private
        _configKey: v.configKey,
        _type: v.type,
        _tag: v.tag,
        _seenCount: 0,
        _previous: undefined,
      };

      if (tagValidationData.isProperty) {
        res.set(`${TypeKey.Property}:${v.tag}`, tagValidationData);
      } else if (tagValidationData.isResource) {
        res.set(`${TypeKey.Resource}:${v.tag}`, tagValidationData);
      } else {
        // Take advantage of the same naming convention (dangerous - should be improved)
        const typeKey = TypeKey.fromValue(v.tag);
        if (typeKey) {
          res.set(typeKey, tagValidationData);
        }
      }
    }

    return res;
  }

  /**
   * Get the configuration for a particular card side and variant
   * (checking for infinitely repeating variants)
   *
   * @param config all variant configurations
   * @param side side index
   * @param variant variant index
   *
   * @returns the config if found, otherwise undefined
   */
  private getVariantConfig(
    config: CardVariantConfig[][],
    side: number,
    variant: number,
  ): CardVariantConfig | undefined {
    let ret: CardVariantConfig | undefined;

    if (config.length === 0) return undefined;

    const sideIdx = Math.min(side, config.length - 1);

    const variantConfigs = config[sideIdx];

    // Check for variant
    const maxVariantIndex = variantConfigs.length - 1;
    if (variant > maxVariantIndex) {
      ret = variantConfigs[maxVariantIndex];
      if (ret.repeatCount !== Count.infinity) return undefined;
    } else {
      ret = variantConfigs[variant];
    }

    return ret;
  }

  private getTagSignature(tagValidationData: TagValidationData): string {
    switch (tagValidationData._type) {
      case BitTagType.tag:
        return `[${tagValidationData._tag}]`;
      case BitTagType.property:
        return `[@${tagValidationData._tag}]`;
      case BitTagType.resource:
        return `[&${tagValidationData._tag}]`;
      default:
        return `'${tagValidationData._type}' tag '${tagValidationData._tag}'`;
    }
  }

  private getUnknownTagSignature(type: string, tag: string): string {
    switch (type) {
      case TypeKey.Property:
        return `[@${tag}]`;
      case TypeKey.Resource:
        return `[&${tag}]`;
      default:
        return `'${type}' tag '${tag}'`;
    }
  }
}

const instance = new BitmarkPegParserValidator();

export { instance as BitmarkPegParserValidator };
