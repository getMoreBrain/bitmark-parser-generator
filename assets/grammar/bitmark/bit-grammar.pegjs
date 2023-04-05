/**
 * Bitmark parser grammar
 * v0.0.1
 * RA Sewell
 *
 * (c) 2023 Get More Brain AG
 */

{{ // GLOBAL JS

// Types

interface BitHeader {
  bitType?: BitTypeType;
  textFormat?: TextFormatType;
  resourceType?: ResourceTypeType;
}

type BitTag = TypeValue | TypeKeyValue;

interface TypeValue {
  type: string;
  value?: unknown;
}

interface TypeKeyValue {
  type: string;
  key: string;
  value?: unknown;
}

// Code Enumerations
const TypeKey = superenum({
  TextFormat: 'TextFormat',
  ResourceType: 'ResourceType',
  Property: 'Property',
  UnknownProperty: 'UnknownProperty',
  Instruction: 'Instruction',
});

//
// Global variables
//
const builder = new Builder();



}} // END GLOBAL JS



{ // PER PARSE JS

//
// Instance variables
//
const nonFatalErrors: ParserError[] = [];


//
// Instance functions
//

// Build bits
function buildBits(bits: (Bit | undefined)[]): BitmarkAst {
  const res = builder.bitmark({
    bits: bits.filter(bit => !!bit) as Bit[],
    errors: nonFatalErrors.length > 0 ? nonFatalErrors : undefined,
  })

  return res;
}

// Build bit
function buildBit(bitHeader: BitHeader, bitTags: BitTag[], bitContent: string): Bit | undefined {
  const { bitType, textFormat, resourceType } = bitHeader;

  // Bit type was invalid, so ignore the bit
  if (!bitType) return undefined;

  // Map the bit tags
  const tags = mapBitTags(bitTags);

  // const bit: Bit = {
  //   bitType,
  //   textFormat,
  //   resourceType,
  //   ...tags,
  //   content: bitContent,
  // } as Bit;

  // Build the final bit
  const bit = builder.bit({
    bitType,
    textFormat,
    resourceType,
    ...tags,
  });

  bit.content = bitContent;

  return bit;
}

// Build bit header
function buildBitHeader(bitType: string, textFormatAndResourceType: Partial<BitHeader>): BitHeader {
  // Get / check bit type
  const validBitType = BitType.fromValue(bitType);
  if (!validBitType) {
    addError(`Invalid bit type: ${bitType}`);
  }

  return {
    bitType: validBitType,
    ...textFormatAndResourceType,
  }
}

// Build text and resource type
function buildTextAndResourceType(value1: TypeValue | undefined, value2: TypeValue | undefined): Partial<BitHeader> {
  const res: Partial<BitHeader> = { textFormat: TextFormat.bitmarkMinusMinus };
  const processValue = (value: TypeValue | undefined) => {
    if (value) {
      if (value.type === TypeKey.TextFormat) {
        // Parse text format, adding default if not set / invalid
        res.textFormat = TextFormat.fromValue(value.value);
        if (value.value && !res.textFormat) {
          addError(`Invalid text format '${value.value}', defaulting to '${TextFormat.bitmarkMinusMinus}'`);
        }
        res.textFormat = res.textFormat ?? TextFormat.bitmarkMinusMinus;
      } else {
        // Parse resource type, adding error if invalid
        res.resourceType = ResourceType.fromValue(value.value);
        if (value.value && !res.resourceType) {
          addError(`Invalid resource type '${value.value}', Resource type will be implied automatically if a resource is present`);
        }
      }
    }
  }
  processValue(value1);
  processValue(value2);

  return res;
}

// Process the bit tags
function mapBitTags(bitTags: BitTag[]) {
  const extraProperties: any = {};

  const res = bitTags.reduce((acc, bitTag, _index) => {
    const { type, key, value } = bitTag as TypeKeyValue;

    switch (type) {
      case TypeKey.Property: {
        if (PropertyKey.fromValue(key)) {
          // Known property
          acc[key] = value;
        } else {
          // Unknown (extra) property
          extraProperties[key] = value;
        }
        break;
      }

      default:
        return bitTag;
    }

    return acc;
  }, {} as any);

  res.extraProperties = extraProperties;

  return res;
}


/**
 * Add an error to the list of non-fatal errors
 * @param message The error message
 */
function addError(message: string) {
  const error: ParserError = {
    message,
    text: text(),
    location: location(),
  };
  nonFatalErrors.push(error);
}

} // END PER PARSE JS


// Root rule
bitmark
  = bits: Bits+ { return buildBits(bits) }
  / NoContent { return { bits: [] } }

// No content in the input
NoContent
  = Empty

// A bit with lines before / after
Bits
  = BlankLine* bit: Bit BlankLine* { return bit }

// A bit
Bit
  = bitHeader: BitHeader bitTags: BitTags bitContent: $Anything { return buildBit(bitHeader, bitTags, bitContent) }
  // = bitHeader: BitHeader bitTags: BitTags Anything { return { type: bitHeader, bitTags } }

// The bit header, e.g. [.interview&image:bitmark++], [.interview:bitmark--&image], [.cloze]
BitHeader
  = "[." bitType: Bit_Value formatAndResource: TextFormatAndResourceType? "]" NL? { return buildBitHeader(bitType, formatAndResource) }

// Text format and resource type
TextFormatAndResourceType
  = value1: (TextFormat / ResourceType)? value2: (TextFormat / ResourceType)? { return buildTextAndResourceType(value1, value2) }

// Text format
TextFormat
  = ":" value: Bit_Value { return { type: TypeKey.TextFormat, value } }

// Resource type
ResourceType
  = "&" value: Bit_Value { return { type: TypeKey.ResourceType, value } }

// All bit tags
BitTags
  = bitTags: (PropertyTag)* { return bitTags }

// Property (@) Bit
PropertyTag
  = "[@" key: KeyValueTag_Key value: KeyValueTag_Value "]" NL? { return { type: TypeKey.Property, key, value } }

// Instruction (!) Bit
InstructionBit
  = "[!" value: Tag_Value "]"  NL? { return { type: TypeKey.Instruction, value } }



//
// Bitmark generic
//

Tag_Value
  = value: $[^\]]* { return value }

KeyValueTag_Key
  = value: $[^:\]]* { return value }

Bit_Value
  = value: $[^&:\]]* { return value }

KeyValueTag_Value
  = ":" value: Tag_Value { return value }
  / '' { return true }

//
// Enumerations
//

// Valid property types
// PropertyTypeEnum
//   = 'id'
//   / 'externalId'
//   / 'ageRange'
//   / 'language'
//   / 'computerLanguage'
//   / 'coverImage'
//   / 'publisher'
//   / 'publications'
//   / 'author'
//   / 'date'
//   / 'location'
//   / 'theme'
//   / 'kind'
//   / 'action'
//   / 'thumbImage'
//   / 'duration'
//   / 'deeplink'
//   / 'externalLink'
//   / 'externalLinkText'
//   / 'videoCallLink'
//   / 'bot'
//   / 'list'
//   / 'labelTrue'
//   / 'labelFalse'
//   / 'quotedPerson'


//
// Generic rules
//

// Match empty space (multiple lines or single line)
Empty
  = ([ \t] / NL)*

// Match anything
Anything
  = .*

// Match a single charachter, but not a line terminator
Char
  = [^\n\r\u2028\u2029] //u2028: line separator, u2029: paragraph separator

// Match a line of text, excluding the line terminator
Line
 = Char*

// Match an empty line, including the line terminator
BlankLine
  = [ \t]* NL


NL "Line Terminator"
  = "\n"
  / "\r\n"
  / "\r"
  / "\u2028"
  / "\u2029"

EOL
  = NL / !.





// WSL "whitespace in line"
//   = [ \t]*

// _ "space"
//   = $((WhiteSpace / LineTerminator )*)

// HTS "language tag separator"
//     = [ \t] / NL

// WhiteSpace "white space, separator"
//   = [\t\v\f \u00A0\uFEFF\u0020\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]

// LineTerminator = [\n\r\u2028\u2029]
// char = [^\n\r\u2028\u2029] //u2028: line separator, u2029: paragraph separator
// word = [^\n\r\u2028\u2029\t\v\f \u00A0\uFEFF\u0020\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]

