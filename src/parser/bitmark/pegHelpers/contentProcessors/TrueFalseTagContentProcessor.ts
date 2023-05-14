/* eslint-disable @typescript-eslint/no-explicit-any */
import { BitTypeType } from '../../../../model/enum/BitType';
import { StringUtils } from '../../../../utils/StringUtils';

import {
  BitContent,
  BitContentLevelType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
  TypeKey,
  TypeValue,
} from '../BitmarkPegParserTypes';

function trueFalseTagContentProcessor(
  context: BitmarkPegParserContext,
  bitLevel: BitContentLevelType,
  bitType: BitTypeType,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  const { type, value } = content as TypeValue;

  const trueFalse = target.trueFalse;

  if (!trueFalse) return;

  const trimmedStringValue = StringUtils.trimmedString(value);

  trueFalse.push({
    text: trimmedStringValue,
    isCorrect: type === TypeKey.True,
  });
}
export { trueFalseTagContentProcessor };
