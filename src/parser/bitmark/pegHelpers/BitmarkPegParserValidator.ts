/**
 * BitmarkPegParserValidator.ts
 * RA Sewell
 *
 * (c) 2023 Get More Brain AG
 * All rights reserved.
 *
 */

import { INFINITE_COUNT, TagData, TagDataMap } from '../../../model/config/TagData';
import { BitType, BitTypeMetadata, BitTypeType } from '../../../model/enum/BitType';
import { CardSetTypeType } from '../../../model/enum/CardSetType';
import { ResourceTypeType } from '../../../model/enum/ResourceType';
import { ParserData } from '../../../model/parser/ParserData';

import {
  BitContent,
  BitContentLevelType,
  BitmarkPegParserContext,
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
  invalid?: boolean;
  tooMany?: number;
  excessProperty?: boolean;
  previous?: ParserData;
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
  validateBitTags(
    context: BitmarkPegParserContext,
    bitLevel: BitContentLevelType,
    bitType: BitTypeType,
    data: BitContent[],
  ): BitContent[] {
    // if (context.DEBUG_BIT_TAG_VALIDATION) context.debugPrint('bit tag validation', data);
    if (!data) return [];

    // Get the bit metadata to check how to parse the bit
    const meta = BitType.getMetadata<BitTypeMetadata>(bitType);
    if (!meta) {
      throw new Error(`Bit type ${bitType} has no metadata`);
    }
    const { tags, resourceAttachmentAllowed, resourceType, cardSetType } = meta;

    // Validate and convert the tag chains
    const res: BitContent[] = this.validateTagChainsRecursive(
      context,
      bitLevel,
      bitType,
      data,
      tags,
      true,
      resourceAttachmentAllowed,
      resourceType,
      cardSetType,
    );

    // TODO: Check the minimum counts
    // const minCount = tagData.minCount == null ? 0 : tagData.minCount;

    return res;
  }

  /**
   * Validate the card set type.
   *
   * @param context
   * @param _bitLevel
   * @param bitType
   * @param cardSet
   * @param cardSetType
   */
  validateCardSetType(
    context: BitmarkPegParserContext,
    _bitLevel: BitContentLevelType,
    bitType: BitTypeType,
    cardSet: BitContent[] | undefined,
    cardSetType: CardSetTypeType | undefined,
  ): void {
    if (cardSet && !cardSetType) {
      const parserData = Array.isArray(cardSet) && cardSet.length > 0 ? cardSet[0] : undefined;
      context.addWarning(`Bit '${bitType}' should not have a card set. It will be ignored`, parserData);
    } else if (!cardSet && cardSetType) {
      context.addWarning(`Bit '${bitType}' is missing the card set. It should have a '${cardSetType}' type card set`);
    }
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
  checkBodyForCommonPotentialMistakes(
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

  //
  // Private
  //

  /**
   * Validate tag chains from the innermost to the outermost, expanding any tag chains that are not valid,
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
    isTopLevel?: boolean,
    _resourceAttachmentAllowed?: boolean,
    _resourceType?: ResourceTypeType,
    cardSetType?: CardSetTypeType,
  ): BitContent[] {
    if (!data) return [];

    const dataOrNull: (BitContent | null)[] = [...data];

    // Maps to keep track of seen tags
    const seenTypeKeys = new Map<TypeKeyType, SeenData>();
    const seenPropertyKeys = new Map<string, SeenData>();
    const seenResourceKeys = new Map<string, SeenData>();

    // Get valid type keys from the tags
    const validTypeKeys = this.convertTagsToTypeKeyMap(tags);

    if (isTopLevel) {
      // Add the extra valid tags dependent on bit configuration
      if (cardSetType) validTypeKeys.set(TypeKey.CardSet, {});

      // These tags are always allowed at this stage
      validTypeKeys.set(TypeKey.TextFormat, {});
      validTypeKeys.set(TypeKey.BodyText, {
        maxCount: INFINITE_COUNT,
      }); // Even if body disallowed, because the body is always present, but can be empty
    }

    // const end = data.length;
    for (let i = 0; i < dataOrNull.length; i++) {
      const content = dataOrNull[i];
      if (!content) continue;

      const { type, key } = content as TypeKeyValue;
      const typeKey = TypeKey.fromValue(type);
      if (!typeKey) continue; // Should not happen

      const tagData: TagData = validTypeKeys.get(typeKey) as TagData;

      // Validate the single tag
      const validatedTagContent = this.validateSingleTag(
        context,
        bitLevel,
        bitType,
        content,
        typeKey,
        tagData,
        seenTypeKeys,
        seenPropertyKeys,
        seenResourceKeys,
      );

      if (!validatedTagContent) {
        // Remove the tag from the data
        dataOrNull.splice(i, 1, null);
      }

      if (validatedTagContent && Array.isArray(validatedTagContent.chain) && validatedTagContent.chain.length > 0) {
        // If the content has a chain, but the validation data does not have a chain, then the chain is invalid
        // The chain is expanded and validated as individual tags

        // Check if the tagData is an array and if so extract the relevant tag data
        const tagDataChain = Array.isArray(tagData) ? tagData.find((tagData) => tagData._key === key) : tagData;

        if (tagDataChain && tagDataChain.chain) {
          const validatedTagChainContent = this.validateTagChainsRecursive(
            context,
            bitLevel,
            bitType,
            validatedTagContent.chain,
            tagDataChain.chain,
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
    tagData: TagData | TagData[],
    seenTypeKeys: Map<TypeKeyType, SeenData>,
    seenPropertyKeys: Map<string, SeenData>,
    seenResourceKeys: Map<string, SeenData>,
  ): BitContent | undefined {
    // if (context.DEBUG_BIT_TAG_VALIDATION) context.debugPrint('bit tag validation', data);

    const { type, key } = content as TypeKeyValue;

    const keyStr = type === TypeKey.Property ? ` with key '${key}'` : '';
    let warningStr = '';
    let validatedContent: BitContent | undefined;
    let warning: WarningInfo | undefined;

    // Get seen data from the seen cache
    let seen = seenTypeKeys.get(typeKey);
    if (seen == undefined) {
      seen = {
        count: 0,
      };
      seenTypeKeys.set(typeKey, seen);
    }

    let previousContent = seen.previous;
    seen.count++;

    const tagDataSingle = tagData as TagData;

    if (tagData) {
      // This type key is valid. Now check if it's been seen before and if so, how many times
      switch (typeKey) {
        case TypeKey.Property: {
          const { content: propertyContent, warning: propertyWarning } = this.validatePropertyTag(
            context,
            bitLevel,
            bitType,
            tagData as TagData[],
            content as TypeKeyValue,
            seenPropertyKeys,
          );
          validatedContent = propertyContent;
          warning = propertyWarning;
          break;
        }
        case TypeKey.Resource: {
          const { content: resourceContent, warning: resourceWarning } = this.validateResourceTag(
            context,
            bitLevel,
            bitType,
            tagData as TagData[],
            content as TypeKeyValue,
            seenResourceKeys,
          );
          validatedContent = resourceContent;
          warning = resourceWarning;
          break;
        }
        case TypeKey.CardSet:
          // TODO: validate card set
          break;

        default: {
          const maxCount = tagDataSingle.maxCount == null ? 1 : tagDataSingle.maxCount;

          // Check the count of each type.
          // If validCount is 0 or less, then an infinite number of this type is allowed
          if (maxCount > 0) {
            if (seen.count > maxCount) {
              // Too many item / lead tags
              warning = { tooMany: maxCount, previous: seen.previous };
            }
          }
          validatedContent = content; // Add tag anyway, as last wins
        }
      }

      // Add a warning if there is one
      if (warning) {
        previousContent = warning.previous;

        // TODO - warning and ignore
        if (warning.invalid) {
          warningStr = `${type}${keyStr} is not valid here`;
        } else if (warning.tooMany) {
          warningStr = `${type}${keyStr} is included more than ${warning.tooMany} time(s)`;
        } else if (warning.excessProperty) {
          warningStr = `${type}${keyStr} is an excess property here`;
        }
      }
    } else {
      // type is not valid
      warningStr = `${type}${keyStr} is not valid here`;
    }

    if (warningStr) {
      context.addWarning(warningStr, content, previousContent);
    }

    // Update the seen data
    seen.previous = content;

    // TODO: Check the minimum counts
    // const minCount = tagData.minCount == null ? 0 : tagData.minCount;

    return validatedContent;
  }

  /**
   * Validates a single property tag
   *
   * @param context
   * @param bitLevel
   * @param bitType
   * @param tagDatas
   * @param content
   * @param seenPropertyKeys
   *
   * @returns validated tag (plus warning message if one is generated) or undefined if the tag is invalid
   */
  private validatePropertyTag(
    _context: BitmarkPegParserContext,
    _bitLevel: string,
    _bitType: string,
    tagDatas: TagData[],
    content: TypeKeyValue,
    seenPropertyKeys: Map<string, SeenData>,
  ): ValidateReturn {
    const { key } = content as TypeKeyValue;

    // Get seen data from the seen cache
    let seen = seenPropertyKeys.get(key);
    if (seen == undefined) {
      seen = {
        count: 0,
      };
      seenPropertyKeys.set(key, seen);
    }

    seen.count++;

    // Check if the property is valid for this bit type
    const tagData = tagDatas.find((tagData) => tagData._key === key);

    // Check if the property is valid for this bit type
    if (tagData) {
      const validCount = tagData.maxCount == null ? 1 : tagData.maxCount;

      // If validCount is 0 or less, then an infinite number of this type is allowed
      if (validCount > 0) {
        if (seen.count > validCount) {
          return {
            warning: { tooMany: validCount, previous: seen.previous },
          };
        }
      }

      // If we get here, the property is valid and can be added
      return {
        content: content,
      };
    }

    // The property is not valid for this bit type, but since we allow excess properties, we will return it as
    // ok but with a warning
    return {
      content: content,
      warning: { excessProperty: true },
    };
  }

  /**
   * Validates a single resource tag
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
  private validateResourceTag(
    _context: BitmarkPegParserContext,
    _bitLevel: string,
    _bitType: string,
    tagDatas: TagData[],
    content: TypeKeyValue,
    seenResourceKeys: Map<string, SeenData>,
  ): ValidateReturn {
    const { key } = content as TypeKeyValue;

    // Get seen data from the seen cache
    let seen = seenResourceKeys.get(key);
    if (seen == undefined) {
      seen = {
        count: 0,
      };
      seenResourceKeys.set(key, seen);
    }

    seen.count++;

    // Check if the property is valid for this bit type
    const tagData = tagDatas.find((tagData) => tagData._key === key);

    // Check if the property is valid for this bit type
    if (tagData) {
      const validCount = tagData.maxCount == null ? 1 : tagData.maxCount;

      // If validCount is 0 or less, then an infinite number of this type is allowed
      if (validCount > 0) {
        if (seen.count > validCount) {
          return {
            warning: { tooMany: validCount, previous: seen.previous },
          };
        }
      }

      // If we get here, the property is valid and can be added
      return {
        content: content,
      };
    }

    // The property is not valid for this bit type, but since we allow excess resources, we will return it as
    // ok but with a warning
    return {
      content: content,
      // TODO
      warning: { excessProperty: true },
    };
  }

  /**
   * Convert the tag data configuration to TypeKeys
   *
   * @param tags
   * @returns
   */
  private convertTagsToTypeKeyMap(tags: TagDataMap): Map<TypeKeyType, TagData | TagData[]> {
    // Using a map here as we might add the 'count' of tags valid at a later stage
    const res = new Map<TypeKeyType, TagData | TagData[]>();

    // Add the tags
    for (const [k, v] of Object.entries(tags)) {
      // Save the key in the TagData
      v._key = k;

      if (v.isProperty) {
        const tagDatas: TagData[] = (res.get(TypeKey.Property) as TagData[]) ?? [];
        tagDatas.push(v);
        res.set(TypeKey.Property, tagDatas);
      } else if (v.isResource) {
        const tagDatas: TagData[] = (res.get(TypeKey.Resource) as TagData[]) ?? [];
        tagDatas.push(v);
        res.set(TypeKey.Resource, tagDatas);
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
}

const instance = new BitmarkPegParserValidator();

export { instance as BitmarkPegParserValidator };
