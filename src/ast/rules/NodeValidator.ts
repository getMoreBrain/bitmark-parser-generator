import { Bit, CardBit, Resource } from '../../model/ast/Nodes';
import { ResourceJson } from '../../model/json/ResourceJson';
import { StringUtils } from '../../utils/StringUtils';

/**
 * Validates a node as the builder level (i.e. when creating AST).
 *
 * This is not really implemented yet.
 * Validation happens in the bitmark parsing, but not when creating the AST.
 * This means that the JSON => bitmark conversion is not well validated yet.
 */
class NodeValidator {
  validateBit(bit: Bit | undefined): Bit | undefined {
    if (!bit) return bit;

    // TODO
    const ret: Bit | undefined = bit;
    // switch (bit.bitType.root) {
    //   case BitType.interview:
    //     ret = this.validateInterviewBit(bit);
    //     break;
    // }

    return ret;
  }

  validateCardBit(bit: CardBit | undefined): CardBit | undefined {
    if (!bit) return bit;

    const ret: CardBit | undefined = bit;
    // TODO

    return ret;
  }

  validateResource<T extends ResourceJson>(resource: T | undefined): T | undefined {
    if (!resource) return undefined;

    let ret: T | undefined = resource;
    let valid = false;

    switch (resource.type) {
      // case ResourceType.imageResponsive: {
      //   const r = resource as unknown as ImageResponsiveResource;
      //   r.imagePortrait = this.validateResource(r.imagePortrait) ?? {
      //     type: ResourceType.image,
      //     typeAlias: ResourceType.imagePortrait,
      //   };
      //   r.imageLandscape = this.validateResource(r.imageLandscape) ?? {
      //     type: ResourceType.image,
      //     typeAlias: ResourceType.imageLandscape,
      //   };
      //   valid = true;
      //   break;
      // }

      // case ResourceType.stillImageFilm: {
      //   const r = resource as unknown as StillImageFilmResource;
      //   r.image = this.validateResource(r.image) ?? { type: ResourceType.image, typeAlias: ResourceType.image };
      //   r.audio = this.validateResource(r.audio) ?? { type: ResourceType.audio, typeAlias: ResourceType.image };
      //   valid = true;
      //   break;
      // }

      default:
        valid = !!resource.value;
    }

    // Note: even if resource is invalid, we still return it as it is used to set the resource attachment type
    // in the bit declaration, and if it is removed completely this cannot be done.
    if (!valid) {
      if (resource.type) {
        ret = {
          type: resource.type,
          typeAlias: resource.type,
        } as T;
      }
    }

    return ret;
  }

  isRequired(val: unknown, name: string) {
    if (val) return;
    throw new Error(`${name} is required but is not set`);
  }

  isOneOfRequired(vals: unknown[], names: string[]) {
    if (Array.isArray(vals)) {
      for (const v of vals) {
        if (v) return;
      }
    }

    throw new Error(`One of '${names.join(', ')}' is required but none is set`);
  }

  isString(val: unknown, name: string) {
    if (StringUtils.isString(val)) return;
    throw new Error(`${name} is required to be a string`);
  }

  isNonEmptyString(val: unknown, name: string) {
    if (StringUtils.isString(val) && val !== '') return;
    throw new Error(`${name} is required to be a non-empty string`);
  }

  isStringOrBoolean(val: unknown, name: string) {
    if (StringUtils.isString(val)) return;
    if (val === true || val === false) return;
    throw new Error(`${name} is required to be a string or a boolean`);
  }

  isNonEmptyStringOrBoolean(val: unknown, name: string) {
    if (StringUtils.isString(val) && val !== '') return;
    if (val === true || val === false) return;
    throw new Error(`${name} is required to be a non-empty string or a boolean`);
  }

  isArray(val: unknown, name: string) {
    if (Array.isArray(val)) return;
    throw new Error(`${name} is required to be a array`);
  }

  isNonEmptyArray(val: unknown, name: string) {
    if (Array.isArray(val) && val.length > 0) return;
    throw new Error(`${name} is required to be a non-empty array`);
  }

  isNumber(val: unknown, name: string) {
    if (Number.isFinite(val)) return;
    throw new Error(`${name} is required to be a number`);
  }

  isBoolean(val: unknown, name: string) {
    if (val === true || val === false) return;
    throw new Error(`${name} is required to be a boolean`);
  }

  isStringOrNumberOrBooleanOrNullOrUndefined(val: unknown, name: string) {
    if (StringUtils.isString(val)) return;
    if (Number.isFinite(val)) return;
    if (val === true || val === false) return;
    if (val == null) return;
    throw new Error(`${name} is required to be a string or a number or a boolean or null or undefined`);
  }

  //
  // private
  //

  // private validateInterviewBit(bit: Bit): Bit | undefined {
  //   // Ensure bit has a questions array as the
  //   // ===
  //   // ===
  //   // must be included in the markup
  //   if (!bit.cardNode) {
  //     bit.cardNode = {};
  //   }

  //   if (!bit.cardNode.questions) {
  //     bit.cardNode.questions = [];
  //   }

  //   return bit;
  // }
}

const nodeValidator = new NodeValidator();

export { nodeValidator as NodeValidator };
