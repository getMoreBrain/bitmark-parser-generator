import { Bit, Resource, StillImageFilmResource } from '../../model/ast/Nodes';
import { BitType } from '../../model/enum/BitType';
import { ResourceType } from '../../model/enum/ResourceType';
import { StringUtils } from '../../utils/StringUtils';

class NodeValidator {
  validateBit(bit: Bit | undefined): Bit | undefined {
    if (!bit) return bit;

    let ret: Bit | undefined = bit;
    switch (bit.bitType) {
      case BitType.interview:
      case BitType.interviewInstructionGrouped:
      case BitType.botInterview:
        ret = this.validateInterviewBit(bit);
        break;
    }

    return ret;
  }

  validateResource<T extends Resource>(resource: T | undefined): T | undefined {
    if (!resource) return undefined;

    let ret: T | undefined = resource;
    let valid = false;

    switch (resource.type) {
      case ResourceType.stillImageFilm: {
        const r = resource as unknown as StillImageFilmResource;
        r.image = this.validateResource(r.image) ?? { type: ResourceType.image };
        r.audio = this.validateResource(r.audio) ?? { type: ResourceType.audio };
        valid = !!r.image || !!r.audio; // Allow valid is just image or audio is valid
        break;
      }
      default:
        valid = !!resource.value;
    }

    // Note: even if resource is invalid, we still return it as it is used to set the resource attachment type
    // in the bit declaration, and if it is removed completely this cannot be done.
    if (!valid) {
      if (resource.type) {
        ret = {
          type: resource.type,
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

  private validateInterviewBit(bit: Bit): Bit | undefined {
    // Ensure bit has a questions array as the
    // ===
    // ===
    // must be included in the markup
    if (!bit.questions) {
      bit.questions = [];
    }

    return bit;
  }
}

const nodeValidator = new NodeValidator();

export { nodeValidator as NodeValidator };
