import { Breakscape } from '../../../../breakscaping/Breakscape.ts';
import { Config } from '../../../../config/Config.ts';
import { type BreakscapedString } from '../../../../model/ast/BreakscapedString.ts';
import { ConfigKey } from '../../../../model/config/enum/ConfigKey.ts';
import { PropertyConfigKey } from '../../../../model/config/enum/PropertyConfigKey.ts';
import { PropertyTagConfig } from '../../../../model/config/PropertyTagConfig.ts';
import { type TagsConfig } from '../../../../model/config/TagsConfig.ts';
import { PropertyFormat } from '../../../../model/enum/PropertyFormat.ts';
import { PropertyTag } from '../../../../model/enum/PropertyTag.ts';
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
  let { key: tag } = content as TypeKeyValue;
  const isChain = contentDepth === BitContentLevel.Chain;

  // Get the property config for the tag (if it exists)
  const propertyConfig = Config.getTagConfigForTag(tagsConfig, PropertyTag.fromValue(tag));
  const configKey = propertyConfig ? propertyConfig.configKey : undefined;

  // Handle internal comments
  if (tag === PropertyTag.internalComment) {
    internalCommentTagContentProcessor(context, contentDepth, content, target);
    return;
  }

  // Check for chains
  // Generally, the chain will only be present in the correct bit as the data was already validated. The bit type
  // should also be checked here if the property may occur in another bit with a different meaning.
  if (propertyConfig) {
    if (configKey === PropertyConfigKey.example) {
      exampleTagContentProcessor(context, contentDepth, content, target);
      return;
    } else if (
      configKey === PropertyConfigKey.ratingLevelStart ||
      configKey === PropertyConfigKey.ratingLevelEnd
    ) {
      ratingLevelChainContentProcessor(
        context,
        contentDepth,
        propertyConfig.chain,
        content,
        target,
      );
      return;
    } else if (configKey === PropertyConfigKey.technicalTerm) {
      technicalTermChainContentProcessor(
        context,
        contentDepth,
        propertyConfig.chain,
        content,
        target,
      );
      return;
    } else if (configKey === PropertyConfigKey.servings) {
      servingsChainContentProcessor(context, contentDepth, propertyConfig.chain, content, target);
      return;
    } else if (configKey === PropertyConfigKey.person || configKey === PropertyConfigKey.partner) {
      personChainContentProcessor(context, contentDepth, propertyConfig.chain, content, target);
      return;
    } else if (configKey === PropertyConfigKey.imageSource) {
      imageSourceChainContentProcessor(context, contentDepth, tagsConfig, content, target);
      return;
    } else if (configKey === PropertyConfigKey.book) {
      bookChainContentProcessor(context, contentDepth, propertyConfig.chain, content, target);
      return;
    } else if (configKey === PropertyConfigKey.markConfig && !isChain) {
      markConfigChainContentProcessor(context, contentDepth, tagsConfig, content, target);
      return;
    } else if (configKey === PropertyConfigKey.property_title && isChain) {
      // Hack the intermediate tag so as not to clash with [#title] tags which are not chained (yet)
      tag = 'propertyTitle';
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

          case PropertyFormat.plainText:
            return Breakscape.unbreakscape(
              StringUtils.isString(v)
                ? (StringUtils.trimmedString(v) as BreakscapedString)
                : undefined,
              {
                format: TextFormat.plainText,
                location: TextLocation.tag,
              },
            );

          case PropertyFormat.number:
            return NumberUtils.asNumber(
              Breakscape.unbreakscape(v as BreakscapedString, {
                format: TextFormat.plainText,
                location: TextLocation.tag,
              }),
            );

          case PropertyFormat.boolean:
            return BooleanUtils.toBoolean(
              Breakscape.unbreakscape(v as BreakscapedString, {
                format: TextFormat.plainText,
                location: TextLocation.tag,
              }),
              true,
            );

          case PropertyFormat.invertedBoolean:
            return !BooleanUtils.toBoolean(
              Breakscape.unbreakscape(v as BreakscapedString, {
                format: TextFormat.plainText,
                location: TextLocation.tag,
              }),
              true,
            );

          case PropertyFormat.bitmarkText:
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
    if (c?.astKey) tag = c.astKey;

    if (c?.single) {
      obj[tag] = v;
    } else {
      if (Object.prototype.hasOwnProperty.call(obj, tag)) {
        const originalValue = obj[tag];
        obj[tag] = [...originalValue, v];
      } else {
        obj[tag] = [v];
      }
    }
  };

  if (propertyConfig) {
    // Known property in correct position
    addProperty(target, tag, value, propertyConfig);
  } else {
    // Unknown (extra) property
    addProperty(target.extraProperties, tag, value, propertyConfig);
  }

  // HACKS: Need to allow properties for different bits and in chains to have different/multiple formats!
  // This is not currently supported by the config system; it would need to be extended to support this.
  // That is a bit job, so instead there are just some hacks here for the few cases where it is currently needed :(
  if (tag === PropertyTag.tag_sampleSolution) {
    addProperty(
      target,
      '__sampleSolutionAst',
      value,
      new PropertyTagConfig(
        ConfigKey.sampleSolution,
        PropertyTag.tag_sampleSolution,
        1,
        1,
        undefined,
        undefined,
        undefined,
        true,
        PropertyFormat.bitmarkText,
        undefined,
        undefined,
      ),
    );
  }
}

export { propertyContentProcessor };
