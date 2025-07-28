import { Breakscape } from '../../../../breakscaping/Breakscape.ts';
import { Config } from '../../../../config/Config.ts';
import { type BreakscapedString } from '../../../../model/ast/BreakscapedString.ts';
import { ConfigKey, configKeyToPropertyType } from '../../../../model/config/enum/ConfigKey.ts';
import { PropertyTagConfig } from '../../../../model/config/PropertyTagConfig.ts';
import { type TagsConfig } from '../../../../model/config/TagsConfig.ts';
import { PropertyKey } from '../../../../model/enum/PropertyKey.ts';
import { TagFormat } from '../../../../model/enum/TagFormat.ts';
import { TextFormat } from '../../../../model/enum/TextFormat.ts';
import { TextLocation } from '../../../../model/enum/TextLocation.ts';
import { BooleanUtils } from '../../../../utils/BooleanUtils.ts';
import { NumberUtils } from '../../../../utils/NumberUtils.ts';
import { StringUtils } from '../../../../utils/StringUtils.ts';
import { TextParser } from '../../../text/TextParser.ts';
import {
  type BitContent,
  BitContentLevel,
  type BitContentProcessorResult,
  type BitmarkPegParserContext,
  type ContentDepthType,
  type TypeKeyValue,
} from '../BitmarkPegParserTypes.ts';
import { bookChainContentProcessor } from './BookChainContentProcessor.ts';
import { exampleTagContentProcessor } from './ExampleTagContentProcessor.ts';
import { groupTagChainContentProcessor } from './GroupTagChainContentProcessor.ts';
import { imageSourceChainContentProcessor } from './ImageSourceChainContentProcessor.ts';
import { commentTagContentProcessor as internalCommentTagContentProcessor } from './InternalCommentTagContentProcessor.ts';
import { markConfigChainContentProcessor } from './MarkConfigChainContentProcessor.ts';
import { personChainContentProcessor } from './PersonChainContentProcessor.ts';
import { ratingLevelChainContentProcessor } from './RatingLevelChainContentProcessor.ts';
import { servingsChainContentProcessor } from './ServingsChainContentProcessor.ts';
import { technicalTermChainContentProcessor } from './TechnicalTermChainContentProcessor.ts';

const textParser = new TextParser();

function propertyContentProcessor(
  context: BitmarkPegParserContext,
  contentDepth: ContentDepthType,
  tagsConfig: TagsConfig | undefined,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  const { value } = content as TypeKeyValue;
  const { key: keyIn } = content as TypeKeyValue;
  const isChain = contentDepth === BitContentLevel.Chain;

  // Get the property config for the tag (if it exists)
  const propertyConfig = Config.getTagConfigForTag(tagsConfig, PropertyKey.fromValue(keyIn));
  const configKey = propertyConfig ? propertyConfig.configKey : undefined;
  let property = configKeyToPropertyType(keyIn);

  // Handle internal comments
  if (configKey === ConfigKey.property_internalComment) {
    internalCommentTagContentProcessor(context, contentDepth, content, target);
    return;
  }

  // Check for chains
  // Generally, the chain will only be present in the correct bit as the data was already validated. The bit type
  // should also be checked here if the property may occur in another bit with a different meaning.
  if (propertyConfig) {
    if (configKey === ConfigKey.property_example) {
      exampleTagContentProcessor(context, contentDepth, content, target);
      return;
    } else if (configKey === ConfigKey.property_groupTag) {
      groupTagChainContentProcessor(context, contentDepth, propertyConfig.chain, content, target);
      return;
    } else if (
      configKey === ConfigKey.property_ratingLevelStart ||
      configKey === ConfigKey.property_ratingLevelEnd
    ) {
      ratingLevelChainContentProcessor(
        context,
        contentDepth,
        propertyConfig.chain,
        content,
        target,
      );
      return;
    } else if (configKey === ConfigKey.property_technicalTerm) {
      technicalTermChainContentProcessor(
        context,
        contentDepth,
        propertyConfig.chain,
        content,
        target,
      );
      return;
    } else if (configKey === ConfigKey.property_servings) {
      servingsChainContentProcessor(context, contentDepth, propertyConfig.chain, content, target);
      return;
    } else if (
      configKey === ConfigKey.property_person ||
      configKey === ConfigKey.property_partner
    ) {
      personChainContentProcessor(context, contentDepth, propertyConfig.chain, content, target);
      return;
    } else if (configKey === ConfigKey.property_imageSource) {
      imageSourceChainContentProcessor(context, contentDepth, tagsConfig, content, target);
      return;
    } else if (configKey === ConfigKey.property_book) {
      bookChainContentProcessor(context, contentDepth, propertyConfig.chain, content, target);
      return;
    } else if (configKey === ConfigKey.property_mark && !isChain) {
      markConfigChainContentProcessor(context, contentDepth, tagsConfig, content, target);
      return;
    } else if (configKey === ConfigKey.property_title && isChain) {
      // Hack the intermediate tag so as not to clash with [#title] tags which are not chained (yet)
      property = 'propertyTitle';
    }
  }

  // Helper for building the properties
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addProperty = (obj: any, tag: string, v: unknown, c: PropertyTagConfig | undefined) => {
    // if (key === 'progress') debugger;

    // Convert property as needed
    const processValue = (v: unknown) => {
      if (v == null) return undefined;

      if (c) {
        switch (c.format) {
          // case PropertyFormat.string:
          //   return StringUtils.isString(v) ? StringUtils.string(v) : undefined;

          case TagFormat.plainText:
            return Breakscape.unbreakscape(
              StringUtils.isString(v)
                ? (StringUtils.trimmedString(v) as BreakscapedString)
                : undefined,
              {
                format: TextFormat.plainText,
                location: TextLocation.tag,
              },
            );

          case TagFormat.number:
            return NumberUtils.asNumber(
              Breakscape.unbreakscape(v as BreakscapedString, {
                format: TextFormat.plainText,
                location: TextLocation.tag,
              }),
            );

          case TagFormat.boolean:
            return BooleanUtils.toBoolean(
              Breakscape.unbreakscape(v as BreakscapedString, {
                format: TextFormat.plainText,
                location: TextLocation.tag,
              }),
              true,
            );

          case TagFormat.invertedBoolean:
            return !BooleanUtils.toBoolean(
              Breakscape.unbreakscape(v as BreakscapedString, {
                format: TextFormat.plainText,
                location: TextLocation.tag,
              }),
              true,
            );

          case TagFormat.bitmarkText:
            v = StringUtils.isString(v) ? v : '';
            return textParser.toAst(v as BreakscapedString, {
              format: TextFormat.bitmarkText,
              location: TextLocation.tag,
            });
        }
      }
      return Breakscape.unbreakscape(v as BreakscapedString, {
        format: TextFormat.plainText,
        location: TextLocation.tag,
      });
    };

    // Convert property and key as needed
    v = processValue(v);

    if (c == null || c.array) {
      if (Object.prototype.hasOwnProperty.call(obj, tag)) {
        const originalValue = obj[tag];
        obj[tag] = [...originalValue, v];
      } else {
        obj[tag] = [v];
      }
    } else {
      obj[tag] = v;
    }
  };

  if (propertyConfig) {
    // Known property in correct position
    addProperty(target, property, value, propertyConfig);
  } else {
    // Unknown (extra) property
    addProperty(target.extraProperties, property, value, propertyConfig);
  }

  // HACKS: Need to allow properties for different bits and in chains to have different/multiple formats!
  // This is not currently supported by the config system; it would need to be extended to support this.
  // That is a big job, so instead there are just some hacks here for the few cases where it is currently needed :(
  if (configKey === ConfigKey.property_sampleSolution) {
    addProperty(
      target,
      '__sampleSolutionAst',
      value,
      new PropertyTagConfig({
        configKey: ConfigKey.property_sampleSolution,
        tag: 'sampleSolution',
        maxCount: 1,
        minCount: 1,
        chain: undefined,
        jsonKey: undefined,
        format: TagFormat.bitmarkText,
        defaultValue: undefined,
        deprecated: undefined,
      }),
    );
  }
}

export { propertyContentProcessor };
