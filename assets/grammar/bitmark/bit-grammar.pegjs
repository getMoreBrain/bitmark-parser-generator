/**
 * Bitmark parser grammar
 * v0.0.1
 * RA Sewell
 *
 * (c) 2023 Get More Brain AG
 * All rights reserved.
 *
 * For details of opertation, see the comments in BitmarkParserHelper.ts
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
// - this rule splits the input into individual bits
// - it will match ANYTHING, so all bitmark is valid
// - it will return an array of bit markup
bitmark
  = BM_Bitmark

BM_Bitmark
  = (WS / CommentTag)* firstBit: BM_FirstBit bits: BM_Bits { return helper.buildBits([ firstBit, ...bits]) }
  / (WS / CommentTag)* bit: $Anything { return helper.buildBits([ bit ]) }

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


// Root bit rule
// - parses a single bit
bit
 = BlankLine* bit: Bit BlankLine* { return bit }

// A single bit
Bit
 = bitHeader: BitHeader bitContent: BitContent { return helper.buildBit(bitHeader, bitContent) }
 / bit: $Anything { return helper.invalidBit(bit) }

// The bit header, e.g. [.interview&image:bitmark++], [.interview:bitmark--&image], [.cloze]
BitHeader
  = "[." bitType: Bit_Value formatAndResource: TextFormatAndResourceType? "]" { return helper.buildBitHeader(bitType, formatAndResource) }

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
  = value: (CardSet / GapTagsChain / TrueFalseTagsChain / StandardTagsChain / BodyChar)* { return helper.reduceToArrayOfTypes(value) }

// Standard bit tags chain
StandardTagsChain
  = value: (BitTag ChainedBitTag*) { return helper.reduceToArrayOfTypes(value) }

// Chained bit tag
ChainedBitTag
 = WSL* value: BitTag { return value }

// Bit tag
BitTag
  = value: (CommentTag / RemarkTag / TitleTag / AnchorTag / ReferenceTag / PropertyTag / ItemLeadTag / InstructionTag / HintTag / ResourceTags) { return value }

// Line of Body of the bit
BodyChar
  = value: . { return { type: TypeKey.BodyChar, value: value } }

// CardSet
CardSet
  = value: (CardSetStart Cards* CardSetEnd) { return { type: TypeKey.CardSet, value: value[1].flat() } }

CardSetStart
  = NL "===" NL { helper.processCardSetStart(); }

CardSetEnd
  = ("===" &EOL) { helper.processCardSetEnd(); }
  // = !("===" NL .* "===" EOF) ("===" &EOL) { helper.processCardSetEnd(); }
  // = Anything

Card
  = value: ("===" NL CardContent) { helper.processCard(); return value[2]; }

CardContent
  = value: ((PossibleCardLine !("===" EOL))* PossibleCardLine !EOL) {
    const cards = helper.reduceToArrayOfTypes(value, [TypeKey.Card]);
    return cards;
  };

PossibleCardLine
  = value: ("===" NL / "==" NL / "--" NL / CardLine) { console.log(`PossibleCardLine: ${JSON.stringify(value)}`); return helper.processPossibleCardLine(value); }

CardLine
 = value: $(Line NL) { return helper.processCardLine(value); }

Cards
  // = value: ("===" NL / "==" NL / "--" NL / CardLine) { return helper.processPossibleCardLine(value); }
  = !("===" (!(NL "===") .)* EOF) value: PossibleCardLine { console.log(`Cards: ${JSON.stringify(value)}`); }
// Comment_Value
//   = value: $(!"||" .)* { return value }


//
// Card content (standard)
//

// Root cardContent rule
cardContent
  = value: (CardContentTags / CardChar)* { return value; }

CardContentTags
  // = value: (CommentTag / ItemLeadTag / InstructionTag / HintTag / SampleSolutionTag / TrueTag / FalseTag / PropertyTag / TitleTag / ResourceTags) { return value; }
  = value: (CommentTag / ItemLeadTag / InstructionTag / HintTag / SampleSolutionTag / TrueFalseTagsChain / PropertyTag / TitleTag / ResourceTags) { return value; }

// Line of Body of the card
CardChar
  = value: . { return { type: TypeKey.CardChar, value: value } }


//
// Resource
//
ResourceTags
  = value: ResourceTag props: ResourcePropertyTag* { return helper.processResourceTags(value, props); }

// The bit header, e.g. [.interview&image:bitmark++], [.interview:bitmark--&image], [.cloze]
ResourceTag
  = "[&" key: KeyValueTag_Key value: KeyValueTag_Value "]" { return { type: TypeKey.Resource, key, value } }

// Resource Extra Data Tag
ResourcePropertyTag
  = "[@" key: KeyValueTag_Key value: KeyValueTag_Value "]" { return { type: TypeKey.ResourceProperty, key, value } }


//
// Tag chains
//

// Gap tags chain
GapTagsChain
  = value: ClozeTag+ others: (ClozeTag / ChainedItemLeadTag / ChainedInstructionTag / ChainedHintTag / ChainedPropertyTag)* { return { type: TypeKey.GapChain, value: [...value, ...others] }; }

// True/False tags chain
TrueFalseTagsChain
  = value: (TrueTag / FalseTag)+ others: (ChainedItemLeadTag / ChainedInstructionTag / ChainedHintTag / ChainedPropertyTag)* { return { type: TypeKey.TrueFalseChain, value: [...value, ...others] } }


//
// Tags
//

// Title tag
TitleTag
  = "[" level: "#"+ title: Tag_Value "]" { return { type: TypeKey.Title, value: { level, title } } }

// Anchor tag
AnchorTag
  = "[▼" value: Tag_Value "]" { return { type: TypeKey.Anchor, value } }

// Reference tag
ReferenceTag
  = "[►" value: Tag_Value "]" { return { type: TypeKey.Reference, value } }

// Property (@) tag
PropertyTag
  = "[@" key: KeyValueTag_Key value: KeyValueTag_Value "]" { return { type: TypeKey.Property, key, value } }

// Item / Lead (%) tag
ItemLeadTag
  = "[%" value: Tag_Value "]" { return { type: TypeKey.ItemLead, value } }

// Instruction (!) tag
InstructionTag
  = "[!" value: Tag_Value ("]" / (WS* EOF)) { return { type: TypeKey.Instruction, value } }

// Hint (?) tag
HintTag
  = "[?" value: Tag_Value "]" { return { type: TypeKey.Hint, value } }

// True (+) tag
TrueTag
  = "[+" value: Tag_Value "]" { return { type: TypeKey.True, value } }

// False (-) tag
FalseTag
  = "[-" value: Tag_Value "]" { return { type: TypeKey.False, value } }

// Sample Solution tag
SampleSolutionTag
  = "[$" value: Tag_Value "]" { return { type: TypeKey.SampleSolution, value } }

// Cloze tag
ClozeTag
  = "[_" value: Tag_Value "]" { return { type: TypeKey.Cloze, value } }

// Remark (unparsed body)
RemarkTag
  = value: $("::" RemarkTag_Key "::" RemarkTag_Value "::") { return { type: TypeKey.BodyText, value } }

// Comment Tag
CommentTag
  = "||" value: Comment_Value "||" { return { type: TypeKey.Comment, value } }



//
// Chained Tags
//

// Chained Property (@) tag
ChainedPropertyTag
  = WS* "[@" key: KeyValueTag_Key value: KeyValueTag_Value "]" { return { type: TypeKey.Property, key, value } }

// Chained Item / Lead (%) tag
ChainedItemLeadTag
  = WS* "[%" value: Tag_Value "]" { return { type: TypeKey.ItemLead, value } }

// Chained Instruction (!) tag
ChainedInstructionTag
  = WS* "[!" value: Tag_Value "]" { return { type: TypeKey.Instruction, value } }

// Chained Hint (?) tag
ChainedHintTag
  = WS* "[?" value: Tag_Value "]" { return { type: TypeKey.Hint, value } }


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

