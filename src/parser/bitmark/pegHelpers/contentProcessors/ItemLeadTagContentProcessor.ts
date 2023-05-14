/* eslint-disable @typescript-eslint/no-explicit-any */
import { BitTypeType } from '../../../../model/enum/BitType';
import { StringUtils } from '../../../../utils/StringUtils';

import {
  BitContent,
  BitContentLevelType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
  TypeValue,
} from '../BitmarkPegParserTypes';

function itemLeadTagContentProcessor(
  context: BitmarkPegParserContext,
  bitLevel: BitContentLevelType,
  bitType: BitTypeType,
  content: BitContent,
  target: BitContentProcessorResult,
  isLead: boolean,
): void {
  const { type, value } = content as TypeValue;

  const trimmedStringValue = StringUtils.trimmedString(value);

  if (!isLead) {
    target.item = trimmedStringValue;
  } else {
    target.lead = trimmedStringValue;
  }
}
export { itemLeadTagContentProcessor };
