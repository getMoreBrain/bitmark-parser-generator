/**
 * BitmarkPegParserValidator.ts
 * RA Sewell
 *
 * (c) 2023 Get More Brain AG
 * All rights reserved.
 *
 */

import { Config } from '../../../config/Config.ts';
import { type BreakscapedString } from '../../../model/ast/BreakscapedString.ts';
import { type Body, type BodyPart } from '../../../model/ast/Nodes.ts';
import { type JsonText } from '../../../model/ast/TextNodes.ts';
import { CardSetConfig } from '../../../model/config/CardSetConfig.ts';
import { ConfigKey, type ConfigKeyType } from '../../../model/config/enum/ConfigKey.ts';
import { type TagsConfig } from '../../../model/config/TagsConfig.ts';
import {
  BitTagConfigKeyType,
  type BitTagConfigKeyTypeType,
} from '../../../model/enum/BitTagConfigKeyType.ts';
import { type BitTypeType } from '../../../model/enum/BitType.ts';
import { Count, type CountType } from '../../../model/enum/Count.ts';
import { type TagType } from '../../../model/enum/Tag.ts';
import { type TextFormatType } from '../../../model/enum/TextFormat.ts';
import { type ParserData } from '../../../model/parser/ParserData.ts';
import { type TagValidationData } from '../../../model/parser/TagValidationData.ts';
import {
  type BitContent,
  BitContentLevel,
  type BitmarkPegParserContext,
  type ContentDepthType,
  type ParsedCardSet,
  TypeKey,
  type TypeKeyType,
  type TypeKeyValue,
} from './BitmarkPegParserTypes.ts';

const COMMON_MISTAKE_STRINGS = [
  // Card divider errors
  '----',
  '\n==\n',
  '\n---\n',
  // Remark errors
  // Comment errors
];

const COMMON_STARTS_WITH_MISTAKE_STRINGS = [
  // Card divider errors
  '==\n',
  '--\n',
];

const COMMON_ENDS_WITH_MISTAKE_STRINGS = [
  // Card divider errors
  '\n==',
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
  warning?: string;
  content?: BitContent;
  previousContent?: ParserData | undefined;
}

interface ValidateReturn {
  content?: BitContent | undefined;
  warning?: WarningInfo;
}

interface ValidateSingleTagReturn {
  validated: BitContent | undefined;
  warning?: WarningInfo;
}

interface ValidateChainRecursiveReturn {
  validated: BitContent[];
  remaining?: BitContent; // Tag split off from the chain
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
  validateBitTags(context: BitmarkPegParserContext, data: BitContent[]): BitContent[] {
    // if (context.DEBUG_BIT_TAG_VALIDATION) context.debugPrint('bit tag validation', data);
    if (!data) return [];

    const { bitConfig, bitType, resourceType } = context;

    // Get the bit config to check how to parse the bit

    const { tags: bitTags, cardSet: cardSetConfig } = bitConfig;

    // Insert the resource tags from the resources config (which can depends on the resource type attachment in the bit header).
    const resourcesConfig = Config.getBitResourcesConfig(bitType, resourceType);
    const tags = { ...bitTags, ...resourcesConfig.tags };

    // Validate and convert the tag chains
    const res: BitContent[] = this.validateTagChainsRecursive(
      context,
      BitContentLevel.Bit,
      bitType,
      data,
      tags,
      cardSetConfig,
    ).validated;

    // TODO: Check the minimum counts
    // const minCount = tagData.minCount == null ? 0 : tagData.minCount;

    return res;
  }

  /**
   * Check the body of the bit.
   *
   * This function also converts the body to JSON if the text format is JSON.
   *
   * @param context
   * @param bitType
   * @param _contentDepth
   * @param body
   * @returns
   */
  checkBody(
    context: BitmarkPegParserContext,
    _contentDepth: ContentDepthType,
    bitType: BitTypeType,
    _textFormat: TextFormatType,
    bodyParts: BodyPart[] | undefined,
  ): BodyPart[] | undefined {
    if (!bodyParts) return bodyParts;

    const { bitConfig } = context;

    // Get the bit config to check how to parse the bit

    const { bodyAllowed } = bitConfig;

    const hasBody = bodyParts.length > 0;

    if (hasBody && !bodyAllowed) {
      context.addWarning(`Bit '${bitType}' should not have a body.`);
    }

    return bodyParts;
  }

  /**
   * Check the body part of the bit.
   *
   * @param context
   * @param _contentDepth
   * @param bitType
   * @param body
   * @returns
   */
  checkBodyPart(
    context: BitmarkPegParserContext,
    contentDepth: ContentDepthType,
    bodyPart: BreakscapedString,
  ): BreakscapedString {
    if (!bodyPart) return bodyPart;

    this.checkBodyForCommonPotentialMistakes(context, contentDepth, bodyPart);

    return bodyPart;
  }

  /**
   * Check the footer of the bit.
   *
   * @param context
   * @param _contentDepth
   * @param bitType
   * @param body
   * @returns
   */
  checkFooter(
    context: BitmarkPegParserContext,
    contentDepth: ContentDepthType,
    footer: BreakscapedString,
  ): BreakscapedString {
    if (!footer) return footer;

    const { bitConfig, bitType } = context;

    // Get the bit config to check how to parse the bit
    const { footerAllowed } = bitConfig;

    this.checkBodyForCommonPotentialMistakes(context, contentDepth, footer);

    if (!footerAllowed) {
      context.addWarning(`Bit '${bitType}' should not have a footer.`);
    }

    return footer;
  }

  /**
   * Check the footer of the bit.
   *
   * @param context
   * @param _contentDepth
   * @param bitType
   * @param cardBody
   * @returns
   */
  checkCardBody(
    context: BitmarkPegParserContext,
    _contentDepth: ContentDepthType,
    bitType: BitTypeType,
    cardBody: Body | undefined,
    cardNo: number,
    sideNo: number,
    variantNo: number,
  ): Body | undefined {
    if (!cardBody || !cardBody.body) return cardBody;

    const { bitConfig } = context;

    // Get the bit config to check how to parse the bit
    if (!bitConfig.cardSet) return cardBody; // Won't happen. Just to make TS happy

    const variantConfig = Config.getCardSetVariantConfig(bitType, sideNo, variantNo);
    if (!variantConfig) return cardBody; // Won't happen. Just to make TS happy

    const { bodyAllowed } = variantConfig;

    const hasBody = (cardBody.bodyString as JsonText).length > 0;

    // this.checkBodyForCommonPotentialMistakes(context, contentDepth, bitType, cardBody);

    if (hasBody && !bodyAllowed) {
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
   * @param contentDepth
   * @param bitType
   * @param data
   * @param tags
   * @param cardSetConfig
   */
  private validateTagChainsRecursive(
    context: BitmarkPegParserContext,
    contentDepth: ContentDepthType,
    bitType: BitTypeType,
    data: BitContent[],
    tags: TagsConfig,
    cardSetConfig?: CardSetConfig,
    chainHeadType?: TypeKeyType,
  ): ValidateChainRecursiveReturn {
    if (!data) {
      return {
        validated: [],
      };
    }

    let remaining: BitContent | undefined;
    const dataOrNull: (BitContent | null)[] = [...data];

    // Get valid type keys from the tags
    const validTypeKeys = this.convertTagsToTypeKeyMap(context, contentDepth, bitType, tags);

    // Helper function for add extra valid type keys
    const addExtraValidTypeKeys = (key: TypeKeyType, maxCount: CountType, minCount: number) => {
      validTypeKeys.set(key, {
        maxCount,
        minCount,
        _type: key as BitTagConfigKeyTypeType,
        _tag: key as TagType,
        _seenCount: 0,
      });
    };

    if (contentDepth === BitContentLevel.Bit) {
      // Add the extra valid tags dependent on bit configuration
      if (cardSetConfig) addExtraValidTypeKeys(TypeKey.CardSet, 1, 0);

      // These tags are always allowed here, and validated later
      addExtraValidTypeKeys(TypeKey.TextFormat, 1, 0);
      addExtraValidTypeKeys(TypeKey.BodyText, Count.infinity, 0);
      addExtraValidTypeKeys(TypeKey.BodyTextPlain, Count.infinity, 0);
      addExtraValidTypeKeys(TypeKey.PlainTextDivider, Count.infinity, 0);
      addExtraValidTypeKeys(TypeKey.FooterDivider, Count.infinity, 0); // No warning for multiple footers, just ignore
    } else if (contentDepth === BitContentLevel.Card) {
      // These tags are always allowed here, and validated later
      addExtraValidTypeKeys(TypeKey.CardText, Count.infinity, 0);
    }

    // const end = data.length;
    for (let i = 0; i < dataOrNull.length; i++) {
      const content = dataOrNull[i];
      if (!content) continue;

      const { type, key } = content as TypeKeyValue;
      let typeKey = TypeKey.fromValue(type);
      if (!typeKey) continue; // Should not happen

      // Build the final valid type key which is the key for property / resources
      let validTypeKey: TypeKeyType | string | undefined = typeKey;
      if (typeKey === TypeKey.Property || typeKey === TypeKey.Resource) {
        validTypeKey = key;
      }

      // Get the tag data for this tag type and key. If not found, the tag is not valid
      let tagData = validTypeKeys.get(validTypeKey);

      // Support [@ fallback to [&:
      // See: https://github.com/getMoreBrain/cosmic/issues/7859
      // In the case of a property tag that is not found, convert it to a resource tag and retry
      // Only for specific tags. This is to support legacy tags for a short period and will be removed in the future
      // (support @ instead of & for resources)
      if (!tagData && typeKey === TypeKey.Property) {
        const resourceKey = key.replace(/^@/, '&') as ConfigKeyType;
        if (
          resourceKey === ConfigKey.resource_backgroundWallpaper ||
          resourceKey === ConfigKey.resource_imagePlaceholder
        ) {
          tagData = validTypeKeys.get(resourceKey);
          if (tagData) {
            typeKey = TypeKey.Resource;
            content.type = TypeKey.Resource;

            const warningMsg = `Falling back to '[${resourceKey}]' from '[${key}]'. Replace '[${key}]' with '[&${key}]' to avoid this warning.`;
            context.addWarning(warningMsg);
          }
        }
      }

      // Validate the single tag
      const { validated: validatedTagContent, warning } = this.validateSingleTag(
        context,
        contentDepth,
        bitType,
        content,
        typeKey,
        tagData,
        cardSetConfig,
      );

      // HACK to handle 'chain-within-chain' for [@person] tags (at least to stop the parser splitting the chain)
      if (typeKey === TypeKey.Resource) chainHeadType = TypeKey.Resource;

      // Tag is not valid in this position. Either remove it or reprocess by breaking the current chain
      let addWarning = true;
      if (!validatedTagContent) {
        if (contentDepth === BitContentLevel.Chain && chainHeadType !== TypeKey.Resource) {
          // If in a chain and the tag is invalid within the chain then break the chain and re-process the tag as a
          // single tag with the rest of the chain as a chain [excluding resource chains].
          remaining = content;
          const restOfChain = dataOrNull.slice(i + 1);
          if (restOfChain.length > 0) {
            remaining.chain = restOfChain as BitContent[];
          }

          // Remove the data from the current chain
          dataOrNull.splice(i);

          // Ignore the generated warning from validateSingleTag as the tag will be reprocessed and will then
          // be valid or will generated a warning there
          addWarning = false;
        } else {
          // The tag is not valid, and either this is not a chain or not a resource chain.

          // Remove the tag from the data
          dataOrNull.splice(i, 1, null);
        }
      }

      // Add the warning generated by validateSingleTag
      if (warning && addWarning) {
        context.addWarning(warning.warning ?? '', warning.content, warning.previousContent);
      }

      // If the content does not have a chain, but the validation data does have a chain, and there are still more
      // items in this chain, then the remaining items should be considered a sub-chain and processed as such.
      // Split the remaining items off from the current chain and process them as a separate chain.
      if (
        contentDepth === BitContentLevel.Chain &&
        tagData &&
        tagData.chain &&
        validatedTagContent &&
        !validatedTagContent.chain
      ) {
        const restOfChain = dataOrNull.slice(i + 1);
        if (restOfChain.length > 0) {
          validatedTagContent.chain = restOfChain as BitContent[];
        }
        dataOrNull.splice(i + 1);
      }

      // If the content has a chain, but the validation data does not have a chain, then the chain is invalid
      // The chain is split off from the single tag for further processing.
      // This allows non-chained tags to be compressed into a chain without breaking the behaviour, and makes the
      // parser more forgiving.
      if (
        validatedTagContent &&
        Array.isArray(validatedTagContent.chain) &&
        validatedTagContent.chain.length > 0
      ) {
        if (tagData && tagData.chain) {
          const { validated: validatedTagChainContent, remaining: remainingTagChainContent } =
            this.validateTagChainsRecursive(
              context,
              BitContentLevel.Chain,
              bitType,
              validatedTagContent.chain,
              tagData.chain,
              undefined,
              validatedTagContent.type as TypeKeyType,
            );
          if (validatedTagChainContent && validatedTagChainContent.length > 0) {
            validatedTagContent.chain = validatedTagChainContent;
          } else {
            // Tag chain is invalid, remove it
            validatedTagContent.chain = undefined;
          }

          // If there is remaining tag chain content to process, insert it into the data
          if (remainingTagChainContent) {
            dataOrNull.splice(i + 1, 0, remainingTagChainContent);
          }
        } else {
          // Tag does not have a chain in the bit config. Split the chain and process as a separate chain.
          // This allows for 'bugs' such as [%item][%lead][!instruction] - instruction still works.
          if (validatedTagContent.type !== TypeKey.Resource) {
            // Build the 'split-off' bit content
            const remainingTagChainContent: BitContent = validatedTagContent.chain[0];
            if (validatedTagContent.chain.length > 1) {
              remainingTagChainContent.chain = validatedTagContent.chain.slice(1);
            }
            dataOrNull.splice(i + 1, 0, remainingTagChainContent);
            // Clear the original chain
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

    return {
      validated: res,
      remaining,
    };
  }

  /**
   * Validate a single bit tag
   *
   * @param context
   * @param contentDepth
   * @param bitType
   * @param content
   * @param typeKey
   * @param tagValidationData
   * @param cardSetConfig
   *
   * @returns validated tag, or undefined if the tag is invalid
   */
  private validateSingleTag(
    context: BitmarkPegParserContext,
    contentDepth: ContentDepthType,
    bitType: BitTypeType,
    content: BitContent,
    typeKey: TypeKeyType,
    tagValidationData: TagValidationData | undefined,
    cardSetConfig: CardSetConfig | undefined,
  ): ValidateSingleTagReturn {
    // if (context.DEBUG_BIT_TAG_VALIDATION) context.debugPrint('bit tag validation', data);

    const { type, key } = content as TypeKeyValue;

    const keyStr = tagValidationData
      ? this.getTagSignature(tagValidationData)
      : this.getUnknownTagSignature(type, key);
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
            contentDepth,
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
            contentDepth,
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
            contentDepth,
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
          if (contentDepth !== BitContentLevel.Chain) {
            validatedContent = content; // Add tag anyway - we don't remove extra properties (unless in chain)
          }
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
        warningStr = `${keyStr} is not valid here (incorrectly chained?).${ignoredStr}`;
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

      warning.warning = warningStr;
      warning.content = validatedContent;
      warning.previousContent = previousContent;
    }

    // Update the seen data
    if (tagValidationData) {
      tagValidationData._previous = content;
    }

    return {
      validated: validatedContent,
      warning,
    };
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
    _contentDepth: ContentDepthType,
    _bitType: BitTypeType,
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
    _contentDepth: ContentDepthType,
    _bitType: BitTypeType,
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
    _contentDepth: ContentDepthType,
    _bitType: BitTypeType,
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
    bitType: BitTypeType,
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
          const variantConfig = Config.getCardSetVariantConfig(bitType, sideIndex, variantIndex);

          if (variantConfig) {
            // Validate the variant against the config
            const res = this.validateTagChainsRecursive(
              context,
              BitContentLevel.Card,
              bitType,
              variantContent,
              variantConfig.tags,
            );
            validatedContent = res.validated;
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
   * @param _contentDepth
   * @param bitType
   * @param body
   * @returns
   */
  private checkBodyForCommonPotentialMistakes(
    context: BitmarkPegParserContext,
    _contentDepth: ContentDepthType,
    body: string,
  ): void {
    if (!body) return;

    const { bitType } = context;

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
   * @param context
   * @param _contentDepth
   * @param bitType
   * @param tags
   * @param depth recursion depth
   * @returns
   */
  private convertTagsToTypeKeyMap(
    _context: BitmarkPegParserContext,
    _contentDepth: ContentDepthType,
    _bitType: BitTypeType,
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
        isTag: v.type === BitTagConfigKeyType.tag,
        isProperty: v.type === BitTagConfigKeyType.property,
        isResource: v.type === BitTagConfigKeyType.resource,
        chain: v.chain,

        // Private
        _configKey: v.configKey,
        _type: v.type,
        _tag: v.tag,
        _seenCount: 0,
        _previous: undefined,
      };

      if (tagValidationData.isProperty) {
        res.set(v.configKey, tagValidationData);
      } else if (tagValidationData.isResource) {
        res.set(v.configKey, tagValidationData);
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

  private getTagSignature(tagValidationData: TagValidationData): string {
    switch (tagValidationData._type) {
      case BitTagConfigKeyType.tag:
      case BitTagConfigKeyType.property:
      case BitTagConfigKeyType.resource:
        return `[${tagValidationData._configKey}]`;
      default:
        return `'${tagValidationData._type}' tag '${tagValidationData._tag}'`;
    }
  }

  private getUnknownTagSignature(type: string, tag: string): string {
    switch (type) {
      case TypeKey.Property:
      case TypeKey.Resource:
        return `[${tag}]`;
      default:
        return tag ? `'${type}' tag '${tag}'` : `'${type}' tag`;
    }
  }
}

const instance = new BitmarkPegParserValidator();

export { instance as BitmarkPegParserValidator };
