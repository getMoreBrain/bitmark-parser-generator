/**
 * Bitmark parser grammar
 * v0.0.1
 * RA Sewell
 *
 * (c) 2023 Get More Brain AG
 *
 *   CardSet
 * === Card
 * ==    Side
 * --      Variant
 *
 */

{{ // GLOBAL JS

// Types

interface BitHeader {
  bitType?: BitTypeType;
  textFormat?: TextFormatType;
  resourceType?: ResourceTypeType;
}

type BitContent = TypeValue | TypeKeyValue;

interface TypeValue {
  type: string;
  value?: unknown;
}

interface TypeKeyValue {
  type: string;
  key: string;
  value?: unknown;
}

// CardSet types
interface CardSet {
  card: Card[];
}

interface Card {
  side: Side[];
}

interface CardSide {
  variant: CardVariant[];
}

type CardVariant = string;

// Code Enumerations
const TypeKey = superenum({
  Ignore: 'Ignore',
  TextFormat: 'TextFormat',
  ResourceType: 'ResourceType',
  Property: 'Property',
  UnknownProperty: 'UnknownProperty',
  ItemLead: 'ItemLead',
  Instruction: 'Instruction',
  Hint: 'Hint',
  BodyLine: 'BodyLine',
  CardSet: 'CardSet',
  Card: 'Card',
  CardSide: 'CardSide',
  CardVariant: 'CardVariant',
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
let cardIndex = 0;
let cardSideIndex = 0;
let cardVariantIndex = 0;

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
function buildBit(bitHeader: BitHeader, bitContent: BitContent[], extraContent: string): Bit | undefined {
  const { bitType, textFormat, resourceType } = bitHeader;

  // Bit type was invalid, so ignore the bit
  if (!bitType) return undefined;

  // Map the bit tags
  const tags = mapBitContent(bitContent);

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


  bit.cardSet = tags.cardSet;
  bit.content = extraContent;
  // bit.resourceType = resourceType;

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

// Process the bit content
function mapBitContent(bitContent: BitContent[]) {
  console.log(bitContent);

  const extraProperties: any = {};
  let body = '';
  let seenItem = false;

  const res = bitContent.reduce((acc, content, _index) => {
    const { type, key, value } = content as TypeKeyValue;

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
      case TypeKey.ItemLead: {
        if (!seenItem) {
          acc.item = value;
        } else {
          acc.lead = value;
        }
        seenItem = true;
        break;
      }

      case TypeKey.Instruction: {
        acc.instruction = value;
        break;
      }

      case TypeKey.Hint: {
        acc.hint = value;
        break;
      }

      case TypeKey.BodyLine: {
        body += value;
        break;
      }

      case TypeKey.CardSet: {
        acc.cardSet = value;
        break;
      }

      default:
        // Unknown tag
    }

    return acc;
  }, {} as any);

  res.extraProperties = extraProperties;
  res.body = body.trim();

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
  = bitHeader: BitHeader bitContent: BitContent { return buildBit(bitHeader, bitContent) }
  // = bitHeader: BitHeader bitContent: BitContent extraContent: $Anything { return buildBit(bitHeader, bitContent, extraContent) }

// The bit header, e.g. [.interview&image:bitmark++], [.interview:bitmark--&image], [.cloze]
BitHeader
  = NL? "[." bitType: Bit_Value formatAndResource: TextFormatAndResourceType? "]" { return buildBitHeader(bitType, formatAndResource) }

// Text format and resource type
TextFormatAndResourceType
  = value1: (TextFormat / ResourceType)? value2: (TextFormat / ResourceType)? { return buildTextAndResourceType(value1, value2) }

// Text format
TextFormat
  = ":" value: Bit_Value { return { type: TypeKey.TextFormat, value } }

// Resource type
ResourceType
  = "&" value: Bit_Value { return { type: TypeKey.ResourceType, value } }

// All bit content (tags, body, cards)
BitContent
  // = value: (Tag / CardSet / BodyLine)* { return value }
  // = value: (CardSet / (Tag / BodyLine)*) { return value }
  = value: (CardSet / Tag / BodyLine)* { return value }

// Bit tag
Tag
  = value: (PropertyTag / ItemLeadTag / InstructionTag / HintTag) { return value }

// Line of Body of the bit
BodyLine
  = value: $(NL !BitHeader / Char+) { return { type: TypeKey.BodyLine, value: value } }

// CardSet
CardSet
  = value: (CardSetStart Card+ CardSetEnd) { return { type: TypeKey.CardSet, value: value } }

CardSetStart
  = NL &("===" NL) { cardIndex = 0; cardSideIndex = 0; cardVariantIndex = 0; }

CardSetEnd
  = "===" { console.log('CardSetEnd'); }

Card
  = value: ("===" NL CardContent) { cardIndex++; cardSideIndex = 0; cardVariantIndex = 0; return value; }

CardContent
  = value: ((PossibleCardLine !("===" EOL))* PossibleCardLine) { return value; };

PossibleCardLine
  = value: ("===" NL /"==" NL / "--" NL / CardLine) {
    if (value === "==") {
      cardSideIndex++;
      cardVariantIndex = 0;
      console.log(`Card ${cardIndex} Side: ${value}`)
    } else if (value === "--") {
      cardVariantIndex++;
      console.log(`Card ${cardIndex}, Side ${cardSideIndex}, Variant: ${cardVariantIndex}`)
    }

    return value;
  };

// TODO - move code into functions and process other rules to simplify output
CardLine
 = value: $(Line NL) {
  console.log(`CardLine (Card ${cardIndex}, Side ${cardSideIndex}, Variant: ${cardVariantIndex}): ${value}`)
  return {
    type: TypeKey.Card,
    value: {
      cardIndex,
      cardSideIndex,
      cardVariantIndex,
      value
    }
  };
};

// Property (@) tag
PropertyTag
  = NL? "[@" key: KeyValueTag_Key value: KeyValueTag_Value "]" { return { type: TypeKey.Property, key, value } }

// Item / Lead (%) tag
ItemLeadTag
  = NL? "[%" value: Tag_Value "]" { return { type: TypeKey.ItemLead, value } }

// Instruction (!) tag
InstructionTag
  = NL? "[!" value: Tag_Value "]" { return { type: TypeKey.Instruction, value } }

// Hint (?) tag
HintTag
  = NL? "[?" value: Tag_Value "]" { return { type: TypeKey.Hint, value } }


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


//
// Generic rules
//

// Match empty space (multiple lines or single line)
Empty "Empty"
  = ([ \t] / NL)*

// Match anything
Anything "Anything"
  = .*

// Match a single charachter, but not a line terminator
Char "Character"
  = [^\n\r\u2028\u2029] //u2028: line separator, u2029: paragraph separator

// Match a line of text or and empty line, excluding the line terminator
Line "Line"
 = Char*

// Match an empty line, including the line terminator
BlankLine "Blank Line"
  = [ \t]* NL


NL "Line Terminator"
  = "\n"
  / "\r\n"
  / "\r"
  / "\u2028"
  / "\u2029"

// End of line including End of file
EOL
  = NL / !.

// End of file
EOF
 = !.



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

