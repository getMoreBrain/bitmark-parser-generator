/**
 * Bitmark parser grammar
 * RA Sewell
 *
 * (c) 2023 Get More Brain AG
 * All rights reserved.
 *
 * For details of opertation, see the comments in BitmarkPegParserProcessor.ts
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

const helper = new BitmarkPegParserHelper({
  parse: peg$parse,
  parserText: text,
  parserLocation: location,
});

const processor = new BitmarkPegParserProcessor({
  parse: peg$parse,
  parserText: text,
  parserLocation: location,
});


} // END PER PARSE JS

//
// Bitmark
//

// Root bitmark rule
// - this rule splits the input into individual bits
// - it will match ANYTHING, so all bitmark is valid
// - it will return an array of bit markup
bitmark
  = BM_Bitmark

BM_Bitmark
  = (WS / CommentTag)* firstBit: BM_FirstBit bits: BM_Bits { return processor.buildBits([ firstBit, ...bits]) }
  / (WS / CommentTag)* bit: $Anything { return processor.buildBits([ bit ]) }

// First bit (matches any content before the first bit header that starts with a NL)
BM_FirstBit
  = $(BlankLine* BM_BodyLine*)

// Subsequent bits after the first bit
BM_Bits
  = ($BM_Bit)*

// A bit with potential blank lines / comments before it
BM_Bit
  =  BlankLine* BM_BitHeader BM_BodyLine*

// A bit header
BM_BitHeader
  = NL? $("[." [^\]]* "]")

// A line of bit body (and not a subsequent bit header)
BM_BodyLine
  = NL !BitHeader / Char+


//
// Bit
//

// Root bit rule
// - parses a single bit
bit
 = BlankLine* bit: Bit BlankLine* { return bit }

// A single bit
Bit
 = bitHeader: BitHeader bitContent: BitContent { return processor.buildBit(bitHeader, bitContent) }
 / bit: $Anything { return processor.invalidBit(bit) }

// The bit header, e.g. [.interview&image:bitmark++], [.interview:bitmark--&image], [.cloze]
BitHeader
  = "[." bitType: Bit_Value formatAndResource: TextFormatAndResourceType? "]" { return processor.buildBitHeader(bitType, formatAndResource) }

// Text format and resource type
TextFormatAndResourceType
  = value1: (TextFormat / ResourceType)? value2: (TextFormat / ResourceType)? { return processor.buildTextAndResourceType(value1, value2) }

// Text format
TextFormat
  = ":" value: Bit_Value { return helper.handleTextFormat(value) }

// Resource type
ResourceType
  = "&" value: Bit_Value { return helper.handleResourceType(value) }

// All bit content (tags, body, cards)
BitContent
  = value: (CardSet_V2 / CardSet_V1 / TagChain / BodyChar)* { return helper.handleBitContent(value) }

// Bit tag chain
TagChain
  = value: (BitTag ChainedBitTag*) { return helper.handleTagChain(value) }

// Chained bit tag
ChainedBitTag
 = value: BitTag { return value }

// Bit tag
BitTag
  = value: (
    CommentTag
  / RemarkTag
  / PropertyTag
  / TitleTag
  / AnchorTag
  / ReferenceTag
  / ItemLeadTag
  / InstructionTag
  / HintTag
  / GapTag
  / SampleSolutionTag
  / TrueTag
  / FalseTag
  / ResourceTag) { return helper.handleBitTag(value) }

// Character of Body of the bit - parse directly and don't add location information for performance
BodyChar
  = value: . { return { type: TypeKey.BodyChar, value: value } }

// Modern CardSet
CardSet_V2
  = value: (CardSetStart_V2 Cards_V2* CardSetEnd_V2) { return helper.handleCardSet(value[1].flat()); }

CardSetStart_V2
  = NL "++" NL &("====" NL) { helper.handleCardSetStart(); }

CardSetEnd_V2
  = ("====" NL "++" &EOL) { helper.handleCardSetEnd(); }

// Matches anything that is NOT !("====" followed by anything except a !("====" to the EOF, so matches the
// rest of the card set without consuming the final !("====" which is consumed by the CardSetEnd rule
Cards_V2
  = !("====" (!(NL "====") .)* EOF) value: CardLineOrDivider_V2 { return helper.handleCards(value); }

CardLineOrDivider_V2
  = value: ("====" NL / "--" NL / "~~" NL / CardLine_V2) { return helper.handleCardLineOrDivider(value, 2); }

CardLine_V2
 = value: $(Line NL) { return helper.handleCardLine(value); }


// Legacy CardSet
CardSet_V1
  = value: (CardSetStart_V1 Cards_V1* CardSetEnd_V1) { return helper.handleCardSet(value[1].flat()); }

CardSetStart_V1
  = NL &("===" NL) { helper.handleCardSetStart(); }

CardSetEnd_V1
  = ("===" &EOL) { helper.handleCardSetEnd(); }

// Matches anything that is NOT '===' followed by anything except a '===' to the EOF, so matches the rest of the card
// set without consuming the final '===' which is consumed by the CardSetEnd rule
Cards_V1
  = !("===" (!(NL "===") .)* EOF) value: CardLineOrDivider_V1 { return helper.handleCards(value); }

CardLineOrDivider_V1
  = value: ("===" NL / "==" NL / "--" NL / CardLine_V1) { return helper.handleCardLineOrDivider(value, 1); }

CardLine_V1
 = value: $(Line NL) { return helper.handleCardLine(value); }


//
// Card content (standard)
//

// Root cardContent rule
cardContent
  = value: (TagChain / CardChar)* { return helper.handleCardContent(value); }

// Line of Body of the card - parse directly and don't add location information for performance
CardChar
  = value: . { return { type: TypeKey.CardChar, value: value } }


//
// Generic Tags
//

// Title tag
TitleTag
  = "[" level: "#"+ title: Tag_Value "]" { return helper.handleTag(TypeKey.Title, { level, title }) }

// Anchor tag
AnchorTag
  = "[▼" value: Tag_Value "]" { return helper.handleTag(TypeKey.Anchor, value) }

// Reference tag
ReferenceTag
  = "[►" value: Tag_Value "]" { return helper.handleTag(TypeKey.Reference, value) }

// Property (@) tag
PropertyTag
  = "[@" key: KeyValueTag_Key value: KeyValueTag_Value "]" { return helper.handlePropertyTag(key, value) }

// Item / Lead (%) tag
ItemLeadTag
  = "[%" value: Tag_Value "]" { return helper.handleTag(TypeKey.ItemLead, value) }

// Instruction (!) tag
InstructionTag
  = "[!" value: Tag_Value ("]" / (WS* EOF)) { return helper.handleTag(TypeKey.Instruction, value) }

// Hint (?) tag
HintTag
  = "[?" value: Tag_Value "]" { return helper.handleTag(TypeKey.Hint, value) }

// True (+) tag
TrueTag
  = "[+" value: Tag_Value "]" { return helper.handleTag(TypeKey.True, value) }

// False (-) tag
FalseTag
  = "[-" value: Tag_Value "]" { return helper.handleTag(TypeKey.False, value) }

// Sample Solution tag
SampleSolutionTag
  = "[$" value: Tag_Value "]" { return helper.handleTag(TypeKey.SampleSolution, value) }

// Gap tag
GapTag
  = "[_" value: Tag_Value "]" { return helper.handleTag(TypeKey.Gap, value) }

// Resource tag
ResourceTag
  = "[&" key: KeyValueTag_Key value: KeyValueTag_Value "]" { return helper.handleResourceTag(key, value); }

// Remark (unparsed body)
RemarkTag
  = value: $("::" RemarkTag_Key "::" RemarkTag_Value "::") { return helper.handleTag(TypeKey.BodyText, value); }

// Comment Tag
CommentTag
  = "||" value: Comment_Value "||" { return helper.handleTag(TypeKey.Comment, value); }


//
// Bitmark generic
//

Tag_Value
  = value: $[^\]]* { return value }

KeyValueTag_Key
  = value: $[^:\]]* { return value ? value.trim() : '' }

Bit_Value
  = value: $[^&:\]]* { return value ? value.trim() : null }

KeyValueTag_Value
  = ":" value: Tag_Value { return value ? value.trim() : '' }
  / '' { return true }

RemarkTag_Key
  = value: $(!"::" Char)* { return value }

RemarkTag_Value
  = value: $(!"::" .)* { return value }

Comment_Value
  = value: $(!"||" .)* { return value }

//
// Enumerations
//


//
// Generic rules
//

// Match empty space to the end of the input
Empty "Empty"
  = ([ \t] / NL)* EOF

// Match anything
Anything "Anything"
  = .*

// Match a single charachter, but not a line terminator
Char "Character"
  = [^\n\r\u2028\u2029] // u2028: line separator, u2029: paragraph separator

// Match a line of text or and empty line, excluding the line terminator
Line "Line"
 = Char*

WSL "whitespace in line"
  = [ \t]

// Match an empty line, including the line terminator
BlankLine "Blank Line"
  = [ \t]* NL

NL "Line Terminator"
  = "\n"
  / "\r\n"
  / "\r"
  / "\u2028"
  / "\u2029"

WS "whitespace"
  = [ \t\n\r\u2028\u2029]

// End of line including End of file
EOL
  = NL / !.

// End of file
EOF
 = !.

