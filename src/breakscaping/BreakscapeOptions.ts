import { type BodyTextFormatType } from '../model/enum/BodyTextFormat.ts';
import { type TextLocationType } from '../model/enum/TextLocation.ts';

/**
 * Configuration options for breakscape and unbreakscape operations.
 *
 * @public
 */
export interface BreakscapeOptions {
  /**
   * The text format to use for processing.
   * @defaultValue TextFormat.bitmarkPlusPlus
   */
  format?: BodyTextFormatType; // default: BodyTextFormat.bitmarkPlusPlus

  /**
   * The text location context for processing.
   * @defaultValue TextLocation.body
   */
  location?: TextLocationType; // default: TextLocation.body

  /**
   * Whether to mutate the input array in-place when processing arrays.
   * If false, a new array will be created.
   * @defaultValue false
   */
  inPlaceArray?: boolean; // mutate in‑place?

  /**
   * Legacy: if true, perform v2 breakscaping from JSON
   */
  v2?: boolean;
}
