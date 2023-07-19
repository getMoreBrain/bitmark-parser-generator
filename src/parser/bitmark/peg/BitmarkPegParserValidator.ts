/**
 * BitmarkPegParserValidator.ts
 * RA Sewell
 *
 * (c) 2023 Get More Brain AG
 * All rights reserved.
 *
 */

import { Body } from '../../../model/ast/Nodes';
import { INFINITE_COUNT, TagData, TagDataMap } from '../../../model/config/TagData';
import { ParserData } from '../../../model/parser/ParserData';

import {
  BitType,
  BitTypeMetadata,
  BitTypeType,
  CardSetConfig,
  CardSetVariantConfig,
} from '../../../model/enum/BitType';

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

interface SeenData {
  previous?: ParserData;
  count: number;
}

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
   * @param bitLevel
   * @param bitType
   * @param data the unvalidated bit content from the parser
   *
   * @returns the validated and potentially unchained bit content
   */
  validateBitTags(context: BitmarkPegParserContext, bitType: BitTypeType, data: BitContent[]): BitContent[] {
    // if (context.DEBUG_BIT_TAG_VALIDATION) context.debugPrint('bit tag validation', data);
    if (!data) return [];

    // Get the bit metadata to check how to parse the bit
    const meta = this.getMetadataForBitType(bitType);
    const { tags, cardSet: cardSetConfig } = meta;

    // Validate and convert the tag chains
    const res: BitContent[] = this.validateTagChainsRecursive(
      context,
      BitContentLevel.Bit,
      bitType,
      data,
      tags,
      cardSetConfig,
    );

    // TODO: Check the minimum counts
    // const minCount = tagData.minCount == null ? 0 : tagData.minCount;

    return res;
  }

  // /**
  //  * Validate the card set type.
  //  *
  //  * @param context
  //  * @param _bitLevel
  //  * @param bitType
  //  * @param cardSet
  //  * @param cardSetType
  //  */
  // validateCardSetType(
  //   context: BitmarkPegParserContext,
  //   _bitLevel: BitContentLevelType,
  //   bitType: BitTypeType,
  //   cardSet: BitContent[] | undefined,
  //   cardSetType: CardSetTypeType | undefined,
  // ): void {
  //   if (cardSet && !cardSetType) {
  //     const parserData = Array.isArray(cardSet) && cardSet.length > 0 ? cardSet[0] : undefined;
  //     context.addWarning(`Bit '${bitType}' should not have a card set. It will be ignored`, parserData);
  //   } else if (!cardSet && cardSetType) {
  //     context.addWarning(`Bit '${bitType}' is missing the card set. It should have a '${cardSetType}' type card set`);
  //   }
  // }

  /**
   * Check the body of the bit.
   *
   * @param context
   * @param _bitLevel
   * @param bitType
   * @param body
   * @returns
   */
  checkBody(
    context: BitmarkPegParserContext,
    _bitLevel: BitContentLevelType,
    bitType: BitTypeType,
    body: Body | undefined,
  ): Body | undefined {
    if (!body) return body;

    // Get the bit metadata to check how to parse the bit
    const meta = this.getMetadataForBitType(bitType);
    const { bodyAllowed } = meta;

    const hasBody = body.bodyParts.length > 0;

    if (hasBody && !bodyAllowed) {
      context.addWarning(`Bit '${bitType}' should not have a body.`);
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
    bitLevel: BitContentLevelType,
    bitType: BitTypeType,
    bodyPart: string,
  ): string {
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
    bitLevel: BitContentLevelType,
    bitType: BitTypeType,
    footer: string,
  ): string {
    if (!footer) return footer;

    // Get the bit metadata to check how to parse the bit
    const meta = this.getMetadataForBitType(bitType);
    const { footerAllowed } = meta;

    this.checkBodyForCommonPotentialMistakes(context, bitLevel, bitType, footer);

    if (!footerAllowed) {
      context.addWarning(`Bit '${bitType}' should not have a footer.`);
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
    bitLevel: BitContentLevelType,
    bitType: BitTypeType,
    cardBody: string | undefined,
    cardNo: number,
    sideNo: number,
    variantNo: number,
  ): string | undefined {
    if (!cardBody) return cardBody;

    // Get the bit metadata to check how to parse the bit
    const meta = this.getMetadataForBitType(bitType);
    if (!meta.cardSet) return cardBody; // Won't happen. Just to make TS happy

    const variantConfig = this.getVariantConfig(meta.cardSet.variants, sideNo, variantNo);
    if (!variantConfig) return cardBody; // Won't happen. Just to make TS happy

    const { bodyAllowed } = variantConfig;

    this.checkBodyForCommonPotentialMistakes(context, bitLevel, bitType, cardBody);

    if (!bodyAllowed) {
      context.addWarning(
        `Bit '${bitType}' should not have a card body at card:${cardNo + 1}, side:${sideNo + 1}, variant:${
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
   */
  private validateTagChainsRecursive(
    context: BitmarkPegParserContext,
    bitLevel: BitContentLevelType,
    bitType: BitTypeType,
    data: BitContent[],
    tags: TagDataMap,
    cardSetConfig?: CardSetConfig,
  ): BitContent[] {
    if (!data) return [];

    const dataOrNull: (BitContent | null)[] = [...data];

    // Maps to keep track of seen tags
    const seenTypeKeys = new Map<TypeKeyType | string, SeenData>();

    // Get valid type keys from the tags
    const validTypeKeys = this.convertTagsToTypeKeyMap(tags);

    // Comment tags are allowed anywhere
    validTypeKeys.set(TypeKey.Comment, { maxCount: INFINITE_COUNT });

    if (bitLevel === BitContentLevel.Bit) {
      // Add the extra valid tags dependent on bit configuration
      if (cardSetConfig)
        validTypeKeys.set(TypeKey.CardSet, {
          _key: cardSetConfig.type,
        });

      // These tags are always allowed here, and validated later
      validTypeKeys.set(TypeKey.TextFormat, {});
      validTypeKeys.set(TypeKey.BodyText, { maxCount: INFINITE_COUNT });
    } else if (bitLevel === BitContentLevel.Card) {
      // These tags are always allowed here, and validated later
      validTypeKeys.set(TypeKey.CardText, { maxCount: INFINITE_COUNT });
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
        bitLevel,
        bitType,
        content,
        typeKey,
        typeKeyPlusKey,
        tagData,
        seenTypeKeys,
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
            BitContentLevel.Chain,
            bitType,
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
          // Tag chain does not exist in bit config. Expand chain as individual tags.
          dataOrNull.splice(i + 1, 0, ...validatedTagContent.chain);
          validatedTagContent.chain = undefined;
        }
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
   * @param bitLevel
   * @param bitType
   * @param content
   * @param typeKey
   * @param tagData
   * @param seenTypeKeys
   * @param seenPropertyKeys
   * @param seenResourceKeys
   *
   * @returns validated tag, or undefined if the tag is invalid
   */
  private validateSingleTag(
    context: BitmarkPegParserContext,
    bitLevel: BitContentLevelType,
    bitType: BitTypeType,
    content: BitContent,
    typeKey: TypeKeyType,
    typeKeyPlusKey: TypeKeyType | string,
    tagData: TagData | undefined,
    seenTypeKeys: Map<TypeKeyType | string, SeenData>,
    cardSetConfig: CardSetConfig | undefined,
  ): BitContent | undefined {
    // if (context.DEBUG_BIT_TAG_VALIDATION) context.debugPrint('bit tag validation', data);

    const { type, key } = content as TypeKeyValue;

    const keyStr = type === TypeKey.Property || type === TypeKey.Resource ? ` with key '${key}'` : '';
    const ignoredStr = ' It will be ignored';
    let warningStr = '';
    let validatedContent: BitContent | undefined;
    let warning: WarningInfo | undefined;

    // Get seen data from the seen cache
    let seen = seenTypeKeys.get(typeKeyPlusKey);
    if (seen == undefined) {
      seen = {
        count: 0,
      };
      seenTypeKeys.set(typeKeyPlusKey, seen);
    }

    let previousContent = seen.previous;
    seen.count++;

    if (tagData) {
      // This type key is valid. Now check if it's been seen before and if so, how many times
      switch (typeKey) {
        case TypeKey.Property: {
          const { content: c, warning: w } = this.validatePropertyTag(
            context,
            bitLevel,
            bitType,
            tagData,
            content as TypeKeyValue,
            seen,
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
            tagData,
            content as TypeKeyValue,
            seen,
          );
          validatedContent = c;
          warning = w;
          break;
        }

        case TypeKey.CardSet: {
          const { content: c, warning: w } = this.validateCardSet(
            context,
            bitType,
            tagData as TagData,
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
            tagData,
            content as TypeKeyValue,
            seen,
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
      previousContent = seen.previous;

      // TODO - warning and ignore
      if (warning.invalid || warning.excessResource) {
        warningStr = `'${type}'${keyStr} is not valid here.${ignoredStr}`;
      } else if (warning.tooMany) {
        warningStr = `'${type}'${keyStr} is included more than ${warning.tooMany} time(s). The earlier ones will be ignored`;
      } else if (warning.extraProperty) {
        warningStr = `'${type}'${keyStr} is an unknown property. It can be excluded from the output using the 'excludeUnknownProperties' flag`;
      } else if (warning.unexpectedCardSet) {
        warningStr = `'${type}'${keyStr} is not expected here.${ignoredStr}`;
      } else if (warning.unexpectedCardSideVariant) {
        warningStr = `'${type}'${keyStr} has a card / side / variant that is not expected here.${ignoredStr}`;
      }

      context.addWarning(warningStr, content, previousContent);
    }

    // Update the seen data
    seen.previous = content;

    // TODO: Check the minimum counts
    // const minCount = tagData.minCount == null ? 0 : tagData.minCount;

    return validatedContent;
  }

  /**
   * Validates a standard bit tag
   *
   * @param context
   * @param bitLevel
   * @param bitType
   * @param tagData
   * @param content
   * @param seen
   *
   * @returns validated tag (plus warning message if one is generated) or undefined if the tag is invalid
   */
  private validateStandardTag(
    _context: BitmarkPegParserContext,
    _bitLevel: BitContentLevelType,
    _bitType: BitTypeType,
    tagData: TagData,
    content: TypeKeyValue,
    seen: SeenData,
  ): ValidateReturn {
    // Check if the property is valid for this bit type

    const validCount = tagData.maxCount == null ? 1 : tagData.maxCount;

    // If validCount is 0 or less, then an infinite number of this type is allowed
    if (validCount > 0) {
      if (seen.count > validCount) {
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
   * @param tagData
   * @param content
   * @param seen
   *
   * @returns validated tag (plus warning message if one is generated) or undefined if the tag is invalid
   */
  private validatePropertyTag(
    _context: BitmarkPegParserContext,
    _bitLevel: BitContentLevelType,
    _bitType: BitTypeType,
    tagData: TagData,
    content: TypeKeyValue,
    seen: SeenData,
  ): ValidateReturn {
    // Check if the property is valid for this bit type

    const validCount = tagData.maxCount == null ? 1 : tagData.maxCount;

    // If validCount is 0 or less, then an infinite number of this type is allowed
    if (validCount > 0) {
      if (seen.count > validCount) {
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
   * @param tagData
   * @param content
   * @param seen
   *
   * @returns validated tag (plus warning message if one is generated) or undefined if the tag is invalid
   */
  private validateResourceTag(
    _context: BitmarkPegParserContext,
    _bitLevel: BitContentLevelType,
    _bitType: BitTypeType,
    tagData: TagData,
    content: TypeKeyValue,
    seen: SeenData,
  ): ValidateReturn {
    // Check if the property is valid for this bit type

    const validCount = tagData.maxCount == null ? 1 : tagData.maxCount;

    // If validCount is 0 or less, then an infinite number of this type is allowed
    if (validCount > 0) {
      if (seen && seen.count > validCount) {
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
   * @param tagDatas
   * @param content
   * @param seenResourceKeys
   *
   * @returns validated tag (plus warning message if one is generated) or undefined if the tag is invalid
   */
  private validateCardSet(
    context: BitmarkPegParserContext,
    bitType: BitTypeType,
    _tagData: TagData,
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
        for (const variantContent of side.variants) {
          let validatedContent: BitContent[] | undefined;
          const variantConfig = this.getVariantConfig(cardSetConfig.variants, sideIndex, variantIndex);

          if (variantConfig) {
            // Validate the variant against the config
            validatedContent = this.validateTagChainsRecursive(
              context,
              BitContentLevel.Card,
              bitType,
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
            side.variants[variantIndex] = validatedContent;
          } else {
            // Variant is invalid, remove it
            side.variants[variantIndex] = [];
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
    bitType: BitTypeType,
    body: string,
  ): void {
    if (!body) return;

    for (const mistake of COMMON_MISTAKE_STRINGS) {
      if (body.includes(mistake)) {
        context.addWarning(`Bit '${bitType}' might contain a mistake: ${mistake}`);
      }
    }

    for (const mistake of COMMON_STARTS_WITH_MISTAKE_STRINGS) {
      if (body.startsWith(mistake)) {
        context.addWarning(`Bit '${bitType}' might contain a mistake: ${mistake}`);
      }
    }

    for (const mistake of COMMON_ENDS_WITH_MISTAKE_STRINGS) {
      if (body.endsWith(mistake)) {
        context.addWarning(`Bit '${bitType}' might contain a mistake: ${mistake}`);
      }
    }
  }

  /**
   * Convert the tag data configuration to TypeKeys
   *
   * @param tags
   * @returns
   */
  private convertTagsToTypeKeyMap(tags: TagDataMap): Map<TypeKeyType | string, TagData> {
    // Using a map here as we might add the 'count' of tags valid at a later stage
    const res = new Map<TypeKeyType | string, TagData>();

    // Add the tags
    for (const [k, v] of Object.entries(tags)) {
      // Save the key in the TagData
      v._key = k;

      if (v.isProperty) {
        res.set(`${TypeKey.Property}:${k}`, v);
      } else if (v.isResource) {
        res.set(`${TypeKey.Resource}:${k}`, v);
      } else {
        // Take advantage of the same naming convention
        const typeKey = TypeKey.fromValue(k);
        if (typeKey) {
          res.set(typeKey, v);
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
    config: CardSetVariantConfig[][],
    side: number,
    variant: number,
  ): CardSetVariantConfig | undefined {
    let ret: CardSetVariantConfig | undefined;

    if (config.length === 0) return undefined;

    const sideIdx = Math.min(side, config.length - 1);

    const variantConfigs = config[sideIdx];

    // Check for variant
    const maxVariantIndex = variantConfigs.length - 1;
    if (variant > maxVariantIndex) {
      ret = variantConfigs[maxVariantIndex];
      if (!ret.infiniteRepeat) return undefined;
    } else {
      ret = variantConfigs[variant];
    }

    return ret;
  }

  /**
   * Get the metadata for a bit type
   * @param bitType bit type
   * @returns the metadata
   * @throws if the bit type has no metadata
   */
  private getMetadataForBitType(bitType: BitTypeType): BitTypeMetadata {
    const meta = BitType.getMetadata<BitTypeMetadata>(bitType);
    if (!meta) {
      throw new Error(`Bit type ${bitType} has no metadata`);
    }

    return meta;
  }
}

const instance = new BitmarkPegParserValidator();

export { instance as BitmarkPegParserValidator };
