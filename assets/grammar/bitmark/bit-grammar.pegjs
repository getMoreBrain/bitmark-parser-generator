/**
 * Bitmark parser grammar
 * v0.0.1
 * RA Sewell
 *
 * (c) 2023 Get More Brain AG
 * All rights reserved.
 *
 * For details of opertation, see the comments in BitmarkPegParserBuilder.ts
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

const processor = new BitmarkPegParserProcessor({
  parse: peg$parse,
  parserText: text,
  parserLocation: location,
});

const builder = new BitmarkPegParserBuilder({
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
  = (WS / CommentTag)* firstBit: BM_FirstBit bits: BM_Bits { return builder.buildBits([ firstBit, ...bits]) }
  / (WS / CommentTag)* bit: $Anything { return builder.buildBits([ bit ]) }

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
 = bitHeader: BitHeader bitContent: BitContent { return builder.buildBit(bitHeader, bitContent) }
 / bit: $Anything { return builder.invalidBit(bit) }

// The bit header, e.g. [.interview&image:bitmark++], [.interview:bitmark--&image], [.cloze]
BitHeader
  = "[." bitType: Bit_Value formatAndResource: TextFormatAndResourceType? "]" { return builder.buildBitHeader(bitType, formatAndResource) }

// Text format and resource type
TextFormatAndResourceType
  = value1: (TextFormat / ResourceType)? value2: (TextFormat / ResourceType)? { return builder.buildTextAndResourceType(value1, value2) }

// Text format
TextFormat
  = ":" value: Bit_Value { return processor.processTextFormat(value) }

// Resource type
ResourceType
  = "&" value: Bit_Value { return processor.processResourceType(value) }

// All bit content (tags, body, cards)
BitContent
  = value: (CardSet / GapTagsChain / TrueFalseTagsChain / StandardTagsChain / BodyChar)* { return processor.processBitContent(value) }

// Standard bit tags chain
StandardTagsChain
  = value: (BitTag ChainedBitTag*) { return processor.processStandardTagsChain(value) }

// Chained bit tag
ChainedBitTag
 = value: BitTag { return value }

// Bit tag
BitTag
  = value: (CommentTag / RemarkTag / TitleTag / AnchorTag / ReferenceTag / PropertyTag / ItemLeadTag / InstructionTag / HintTag / ResourceTagsChain) { return processor.processBitTag(value) }

// Character of Body of the bit - parse directly and don't add location information for performance
BodyChar
  = value: . { return { type: TypeKey.BodyChar, value: value } }

// CardSet
CardSet
  = value: (CardSetStart Cards* CardSetEnd) { return processor.processCardSet(value[1].flat()); }

CardSetStart
  = NL &("===" NL) { processor.processCardSetStart(); }

CardSetEnd
  = ("===" &EOL) { processor.processCardSetEnd(); }

// Matches anything that is NOT '===' followed by anything except a '===' to the EOF, so matches the rest of the card
// set without consuming the final '===' which is consumed by the CardSetEnd rule
Cards
  = !("===" (!(NL "===") .)* EOF) value: CardLineOrDivider { return processor.processCards(value); }

CardLineOrDivider
  = value: ("===" NL / "==" NL / "--" NL / CardLine) { return processor.processCardLineOrDivider(value); }

CardLine
 = value: $(Line NL) { return processor.processCardLine(value); }


//
// Card content (standard)
//

// Root cardContent rule
cardContent
  = value: (CardContentTags / CardChar)* { return processor.processCardContent(value); }

CardContentTags
  = value: (CommentTag / ItemLeadTag / InstructionTag / HintTag / SampleSolutionTag / TrueFalseTagsChain / PropertyTag / TitleTag / ResourceTagsChain) { return processor.processCardTags(value); }

// Line of Body of the card - parse directly and don't add location information for performance
CardChar
  = value: . { return { type: TypeKey.CardChar, value: value } }


//
// Resource
//

// Resource tag with chained properties
ResourceTagsChain
  = value: ResourceTag props: ResourcePropertyTag* { return processor.processResourceTagsChain(value, props); }

// The resource tag
ResourceTag
  = "[&" key: KeyValueTag_Key value: KeyValueTag_Value "]" { return processor.processReourceTag(key, value); }

// Resource Extra Data Tag
ResourcePropertyTag
  = "[@" key: KeyValueTag_Key value: KeyValueTag_Value "]" { return processor.processReourcePropertyTag(key, value); }


//
// Tag chains
//

// Gap tags chain
GapTagsChain
  = value: ClozeTag+ others: (ClozeTag / ItemLeadTag / InstructionTag / HintTag / PropertyTag)* { return processor.processGapChainTags([...value, ...others]); }

// True/False tags chain
TrueFalseTagsChain
  = value: (TrueTag / FalseTag)+ others: (ItemLeadTag / InstructionTag / HintTag / PropertyTag)* { return processor.processTrueFalseChainTags([...value, ...others]); }


//
// Tags
//

// Title tag
TitleTag
  = "[" level: "#"+ title: Tag_Value "]" { return processor.processTag(TypeKey.Title, { level, title }) }

// Anchor tag
AnchorTag
  = "[▼" value: Tag_Value "]" { return processor.processTag(TypeKey.Anchor, value) }

// Reference tag
ReferenceTag
  = "[►" value: Tag_Value "]" { return processor.processTag(TypeKey.Reference, value) }

// Property (@) tag
PropertyTag
  = "[@" key: KeyValueTag_Key value: KeyValueTag_Value "]" { return processor.processPropertyTag(key, value) }

// Item / Lead (%) tag
ItemLeadTag
  = "[%" value: Tag_Value "]" { return processor.processTag(TypeKey.ItemLead, value) }

// Instruction (!) tag
InstructionTag
  = "[!" value: Tag_Value ("]" / (WS* EOF)) { return processor.processTag(TypeKey.Instruction, value) }

// Hint (?) tag
HintTag
  = "[?" value: Tag_Value "]" { return processor.processTag(TypeKey.Hint, value) }

// True (+) tag
TrueTag
  = "[+" value: Tag_Value "]" { return processor.processTag(TypeKey.True, value) }

// False (-) tag
FalseTag
  = "[-" value: Tag_Value "]" { return processor.processTag(TypeKey.False, value) }

// Sample Solution tag
SampleSolutionTag
  = "[$" value: Tag_Value "]" { return processor.processTag(TypeKey.SampleSolution, value) }

// Cloze tag
ClozeTag
  = "[_" value: Tag_Value "]" { return processor.processTag(TypeKey.Cloze, value) }

// Remark (unparsed body)
RemarkTag
  = value: $("::" RemarkTag_Key "::" RemarkTag_Value "::") { return processor.processTag(TypeKey.BodyText, value); }

// Comment Tag
CommentTag
  = "||" value: Comment_Value "||" { return processor.processTag(TypeKey.Comment, value); }


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

