/* eslint-disable @typescript-eslint/no-explicit-any */
import { Builder } from '../../../../ast/Builder';
import { BodyPart, Gap } from '../../../../model/ast/Nodes';
import { BitTypeType } from '../../../../model/enum/BitType';
import { StringUtils } from '../../../../utils/StringUtils';

import {
  BitContent,
  BitContentLevel,
  BitContentLevelType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
  TypeKey,
  TypeValue,
} from '../BitmarkPegParserTypes';

const builder = new Builder();

function clozeTagContentProcessor(
  context: BitmarkPegParserContext,
  bitLevel: BitContentLevelType,
  bitType: BitTypeType,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  const { value } = content as TypeValue;

  const solutions = target.solutions;

  if (!solutions) return;

  if (StringUtils.isString(value)) {
    const trimmedStringValue = StringUtils.trimmedString(value);

    solutions.push(trimmedStringValue);
  }
}
export { clozeTagContentProcessor };
