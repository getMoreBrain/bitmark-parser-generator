/**
 * Bitmark parser grammar
 * v0.0.1
 * RA Sewell
 *
 * (c) 2023 Get More Brain AG
 * All rights reserved.
 *
 */

{{ // GLOBAL JS

//
// Global variables
//

// None

}} // END GLOBAL JS



{ // PER PARSE JS

//
// Instance variables
//

const helper = new BitmarkParserHelper({
  parse: peg$parse,
  parserText: text,
  parserLocation: location,
});


} // END PER PARSE JS

//
// Bitmark
//

// Root bitmark rule
bitmark
  = bits: Bits+ { return helper.buildBits(bits) }
  / NoContent { return { bits: [] } }

// No content in the input
NoContent
  = Empty

// A bit with lines before / after
Bits
  = BlankLine* bit: Bit BlankLine* { return bit }

// A bit
Bit
  = bitHeader: BitHeader bitContent: BitContent { return helper.buildBit(bitHeader, bitContent) }
  // = bitHeader: BitHeader bitContent: BitContent extraContent: $Anything { return buildBit(bitHeader, bitContent, extraContent) }

// The bit header, e.g. [.interview&image:bitmark++], [.interview:bitmark--&image], [.cloze]
BitHeader
  = NL? "[." bitType: Bit_Value formatAndResource: TextFormatAndResourceType? "]" { return helper.buildBitHeader(bitType, formatAndResource) }

// Text format and resource type
TextFormatAndResourceType
  = value1: (TextFormat / ResourceType)? value2: (TextFormat / ResourceType)? { return helper.buildTextAndResourceType(value1, value2) }

// Text format
TextFormat
  = ":" value: Bit_Value { return { type: TypeKey.TextFormat, value } }

// Resource type
ResourceType
  = "&" value: Bit_Value { return { type: TypeKey.ResourceType, value } }

// All bit content (tags, body, cards)
BitContent
  = value: (CardSet / BitTag / BodyLine)* { return value }

// Bit tag
BitTag
  = value: (PropertyTag / ItemLeadTag / InstructionTag / HintTag) { return value }

// Line of Body of the bit
BodyLine
  = value: $(NL !BitHeader / Char+) { return { type: TypeKey.BodyLine, value: value } }

// CardSet
CardSet
  = value: (CardSetStart Card* CardSetEnd) { return { type: TypeKey.CardSet, value: value[1].flat() } }

CardSetStart
  = NL &("===" NL) { helper.processCardSetStart(); }

CardSetEnd
  = "===" &EOL { helper.processCardSetEnd(); }

Card
  = value: ("===" NL CardContent) { helper.processCard(); return value[2]; }

CardContent
  = value: ((PossibleCardLine !(("===" EOL) / BitHeader))* PossibleCardLine (!BitHeader !EOL)) {
    const cards = helper.reduceToArrayOfTypes(value, TypeKey.Card);
    return cards;
  };

PossibleCardLine
  = value: ("===" NL / "==" NL / "--" NL / CardLine) { return helper.processPossibleCardLine(value); }

CardLine
 = value: $(Line NL) { return helper.processCardLine(value); }


//
// Body
//

// Root body rule
body
  = value: (BodyTags / BodyChar)* { return value; }

// Line of Body of the bit
BodyChar
  = value: (Char / NL) { return { type: TypeKey.BodyChar, value: value } }

// BodyTags
BodyTags
  = value: (GapTags / SelectTags) { return value; }

// Gap tags
GapTags
  = value: ClozeTag others: (ClozeTag / InstructionTag / HintTag / PropertyTag)* { return { type: TypeKey.Gap, value: [value, ...others] }; }

// Select tags
SelectTags
  = value: (TrueTag / FalseTag)+ others: (TrueTag / FalseTag / InstructionTag / HintTag / PropertyTag)* { return { type: TypeKey.Select, value: [...value, ...others] } }


//
// Card content (standard)
//

// Root cardContent rule
cardContent
  = value: (CardContentTags / BodyChar)* { return value; }

CardContentTags
  = value: (ItemLeadTag / InstructionTag / HintTag / SampleSolutionTag / TrueTag / FalseTag / PropertyTag / HeadingTag / SubHeadingTag / ResourceTags) { return value; }

//
// Resource
//
ResourceTags
  = value: ResourceTag {
    console.log('RESOURCE_TAGS', value);
    // TODO - insert other tags values into the resource tag value
    return value;
  }

// The bit header, e.g. [.interview&image:bitmark++], [.interview:bitmark--&image], [.cloze]
ResourceTag
  = NL? "[&" key: KeyValueTag_Key value: KeyValueTag_Value "]" { return { type: TypeKey.Resource, key, url: value } }

// Resource Extra Data Tag
ResourceXXTag
  = value1: (TextFormat / ResourceType)? value2: (TextFormat / ResourceType)? { return helper.buildTextAndResourceType(value1, value2) }




//
// Tags
//

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

// True (+) tag
TrueTag
  = NL? "[+" value: Tag_Value "]" { return { type: TypeKey.True, value } }

// False (-) tag
FalseTag
  = NL? "[-" value: Tag_Value "]" { return { type: TypeKey.False, value } }

// Cloze tag
ClozeTag
  = NL? "[_" value: Tag_Value "]" { return { type: TypeKey.Cloze, value } }

// Sample Solution tag
SampleSolutionTag
  = NL? "[$" value: Tag_Value "]" { return { type: TypeKey.SampleSolution, value } }

// Heading tag
HeadingTag
  = NL? "[#" value: Tag_Value "]" { return { type: TypeKey.Heading, value } }

// Sub-Heading tag
SubHeadingTag
  = NL? "[##" value: Tag_Value "]" { return { type: TypeKey.SubHeading, value } }


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
  = [^\n\r\u2028\u2029] // u2028: line separator, u2029: paragraph separator

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

