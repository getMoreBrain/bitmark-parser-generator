import { EnumType, superenum } from '@ncoderz/superenum';

/**
 * The key of the property in JSON.
 *
 * Only keys that vary from the markup default are included.
 */
const PropertyJsonKey = superenum({
  //
});

export type PropertyJsonKeyType = EnumType<typeof PropertyJsonKey>;

export { PropertyJsonKey };
