import { Breakscape } from '../../../../breakscaping/Breakscape';
import { Config } from '../../../../config/Config';
import { BreakscapedString } from '../../../../model/ast/BreakscapedString';
import { PropertyTagConfig } from '../../../../model/config/PropertyTagConfig';
import { TagsConfig } from '../../../../model/config/TagsConfig';
import { ConfigKey } from '../../../../model/config/enum/ConfigKey';
import { PropertyConfigKey } from '../../../../model/config/enum/PropertyConfigKey';
import { PropertyFormat } from '../../../../model/enum/PropertyFormat';
import { PropertyTag } from '../../../../model/enum/PropertyTag';
import { ResourceTag } from '../../../../model/enum/ResourceTag';
import { TextFormat } from '../../../../model/enum/TextFormat';
import { BooleanUtils } from '../../../../utils/BooleanUtils';
import { NumberUtils } from '../../../../utils/NumberUtils';
import { StringUtils } from '../../../../utils/StringUtils';
import { TextParser } from '../../../text/TextParser';

import { bookChainContentProcessor } from './BookChainContentProcessor';
import { exampleTagContentProcessor } from './ExampleTagContentProcessor';
import { imageSourceChainContentProcessor } from './ImageSourceChainContentProcessor';
import { commentTagContentProcessor as internalCommentTagContentProcessor } from './InternalCommentTagContentProcessor';
import { markConfigChainContentProcessor } from './MarkConfigChainContentProcessor';
import { personChainContentProcessor } from './PersonChainContentProcessor';
import { ratingLevelChainContentProcessor } from './RatingLevelChainContentProcessor';
import { propertyStyleResourceContentProcessor } from './ResourceContentProcessor';
import { servingsChainContentProcessor } from './ServingsChainContentProcessor';
import { technicalTermChainContentProcessor } from './TechnicalTermChainContentProcessor';

import {
  BitContent,
  BitContentLevel,
  ContentDepthType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
  TypeKeyValue,
} from '../BitmarkPegParserTypes';

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
    } else if (configKey === PropertyConfigKey.ratingLevelStart || configKey === PropertyConfigKey.ratingLevelEnd) {
      ratingLevelChainContentProcessor(context, contentDepth, propertyConfig.chain, content, target);
      return;
    } else if (configKey === PropertyConfigKey.technicalTerm) {
      technicalTermChainContentProcessor(context, contentDepth, propertyConfig.chain, content, target);
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
    } else if (configKey === PropertyConfigKey.imagePlaceholder) {
      propertyStyleResourceContentProcessor(context, contentDepth, tagsConfig, content, target, ResourceTag.image);
      return;
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

          case PropertyFormat.trimmedString:
            return Breakscape.unbreakscape(
              StringUtils.isString(v) ? (StringUtils.trimmedString(v) as BreakscapedString) : undefined,
            );

          case PropertyFormat.number:
            return NumberUtils.asNumber(Breakscape.unbreakscape(v as BreakscapedString));

          case PropertyFormat.boolean:
            return BooleanUtils.toBoolean(Breakscape.unbreakscape(v as BreakscapedString), true);

          case PropertyFormat.invertedBoolean:
            return !BooleanUtils.toBoolean(Breakscape.unbreakscape(v as BreakscapedString), true);

          case PropertyFormat.bitmarkMinusMinus:
            return textParser.toAst(v as BreakscapedString, {
              textFormat: TextFormat.bitmarkMinusMinus,
              isProperty: true,
            });

          case PropertyFormat.bitmarkPlusPlus:
            return textParser.toAst(v as BreakscapedString, {
              textFormat: TextFormat.bitmarkPlusPlus,
              isProperty: true,
            });
        }
      }
      return Breakscape.unbreakscape(v as BreakscapedString);
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
        PropertyFormat.bitmarkMinusMinus,
        undefined,
        undefined,
      ),
    );
  }
}

export { propertyContentProcessor };
