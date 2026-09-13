import { Enum } from '@ncoderz/superenum';

import { Breakscape } from '../../../../breakscaping/Breakscape.ts';
import { Config } from '../../../../config/Config.ts';
import { JSONKEY_IGNORE } from '../../../../model/config/_Config.ts';
import { ConfigKey } from '../../../../model/config/enum/ConfigKey.ts';
import { type TagConfig } from '../../../../model/config/TagConfig.ts';
import { type TagsConfig } from '../../../../model/config/TagsConfig.ts';
import { Tag } from '../../../../model/enum/Tag.ts';
import {
  type BitContent,
  BitContentLevel,
  type BitContentProcessorResult,
  type BitmarkPegParserContext,
  type ContentDepthType,
  TypeKey,
} from '../BitmarkPegParserTypes.ts';
import { itemLeadTagContentProcessor } from './ItemLeadTagContentProcessor.ts';

/**
 * Recursively flatten nested chain content into a flat array.
 * Handles both flat chains (old config) and nested sub-chains (new config).
 */
function flattenChainContent(content: BitContent): BitContent[] {
  const result: BitContent[] = [content];
  if (content.chain) {
    for (const child of content.chain) {
      result.push(...flattenChainContent(child));
    }
  }
  return result;
}

function itemLeadChainContentProcessor(
  context: BitmarkPegParserContext,
  contentDepth: ContentDepthType,
  tagsConfig: TagsConfig | undefined,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  if (contentDepth === BitContentLevel.Chain) {
    itemLeadTagContentProcessor(context, contentDepth, tagsConfig, content, target);
  } else {
    buildItemLead(context, contentDepth, tagsConfig, content, target);
  }
}

function buildItemLead(
  context: BitmarkPegParserContext,
  _contentDepth: ContentDepthType,
  tagsConfig: TagsConfig | undefined,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  if (context.DEBUG_CHAIN_CONTENT) context.debugPrint('item lead content', content);

  // Process the chain (lead)
  const itemLeadConfig = Config.getTagConfigForTag(tagsConfig, Enum(Tag).fromValue(content.type));
  const chainContent = flattenChainContent(content);

  const chainTags = context.bitContentProcessor(
    BitContentLevel.Chain,
    itemLeadConfig?.chain,
    chainContent,
  );

  if (context.DEBUG_CHAIN_TAGS) context.debugPrint('item lead TAGS', chainTags);

  // Only the [%...] entries feed itemLead, so filter to those to keep the
  // positional index aligned with the parsed values (a chain may also carry
  // other tag types, e.g. [!instruction]).
  const itemLeadContent = chainContent.filter((c) => c.type === TypeKey.ItemLead);

  dropPlaceholderValues(context, itemLeadConfig, chainTags, itemLeadContent);

  // Set the lead item from the chain
  target.itemLead = chainTags.itemLead;
  target.__itemLeadString = chainTags.__itemLeadString;
}

/**
 * True for the `"@ignore"` key pattern — the key-pattern language's "tag takes
 * no value" form (specs/JSONKEY_SYNTAX.md §6.2). The tag still fires and
 * consumes its chain slot; any value written in it is dropped with a warning.
 *
 * Deliberately distinct from `{}` ("consumed and used, written elsewhere" — how
 * [@internalComment] and [@isCaseSensitive] are declared, both of which carry a
 * meaningful value) and from `null`/absent ("use the tag-name default key").
 */
function takesNoValue(config: TagConfig): boolean {
  return config.exportJsonKey === JSONKEY_IGNORE;
}

/**
 * PLAN-023: enforce the `"@ignore"` placeholder links.
 *
 * The [%...] chain is positional (1st = item, 2nd = lead, 3rd = pageNumber,
 * 4th = marginNumber), so on the lightweight bits the earlier links must exist
 * in order to reach pageNumber / marginNumber even though they carry no value.
 * Any value written in a placeholder link is dropped, with one warning per
 * offending link.
 *
 * Both output arrays are blanked in lockstep — `__itemLeadString` feeds the
 * card-level item/lead in CardContentProcessor, so leaving it set would let a
 * dropped value reappear there.
 */
function dropPlaceholderValues(
  context: BitmarkPegParserContext,
  itemLeadConfig: TagConfig | undefined,
  chainTags: BitContentProcessorResult,
  itemLeadContent: BitContent[],
): void {
  const { itemLead, __itemLeadString: itemLeadString } = chainTags;
  if (!itemLead || !itemLeadString) return;

  let config: TagConfig | undefined = itemLeadConfig;

  for (let i = 0; i < itemLead.length; i++) {
    if (!config) break;

    // Only a link explicitly configured to take no value is a placeholder
    if (takesNoValue(config) && itemLeadString[i]) {
      context.addWarning(
        `[%] '${config.jsonKey ?? config.tag}' does not take a value on bit '${context.bitType}'. It will be ignored.`,
        itemLeadContent[i],
      );
      itemLead[i] = [];
      itemLeadString[i] = Breakscape.EMPTY_STRING;
    }

    config = config.chain?.[ConfigKey.tag_item];
  }
}

export { itemLeadChainContentProcessor };
