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
// - this rule splits the input into individual bits
// - it will match ANYTHING, so all bitmark is valid
// - it will return an array of bit markup
bitmark
  = BM_Bitmark

BM_Bitmark
  = firstBit: BM_FirstBit bits: BM_Bits { return helper.buildBits([ firstBit, ...bits]) }
  / bit: $Anything { return helper.buildBits([ bit ]) }

// First bit (matches any content before the first bit header that starts with a NL)
BM_FirstBit
  = $(BlankLine* BM_BodyLine*)

// Subsequent bits after the first bit
BM_Bits
  = ($BM_Bit)+

// A bit with potential blank lines before
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
 = bitHeader: BitHeader_Select bitContent: BitContent_Select { return helper.buildBit(bitHeader, bitContent) }
 / bitHeader: BitHeader bitContent: BitContent { return helper.buildBit(bitHeader, bitContent) }
 / bit: $Anything { return helper.invalidBit(bit) }

// The bit header, e.g. [.interview&image:bitmark++], [.interview:bitmark--&image], [.cloze]
BitHeader
  = "[." bitType: Bit_Value formatAndResource: TextFormatAndResourceType? "]" { return helper.buildBitHeader(bitType, formatAndResource) }

// The bit header Select, i.e. [.multiple-choice-text]
BitHeader_Select
  = "[." bitType: Bit_Value_Select formatAndResource: TextFormatAndResourceType? "]" { return helper.buildBitHeader(bitType, formatAndResource) }


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

// All bit content - V1 (tags, body)
BitContent_Select
  = value: (CardSet / BitTag_Select / BodyLine)* { return value }

// Bit tag
BitTag
  = value: (TitleTag / CommentTag / AnchorTag / ReferenceTag / PropertyTag / ItemLeadTag / InstructionTag / HintTag / TrueFalseTags_V1 / ResourceTags) { return value }

// Bit tags for select (do not capture top level true / false tags)
BitTag_Select
  = value: (TitleTag / CommentTag / AnchorTag / ReferenceTag / PropertyTag / ItemLeadTag / InstructionTag / HintTag / ResourceTags) { return value }

TrueFalseTags_V1
  = value: (TrueInlineTag / FalseInlineTag)+ others: (TrueInlineTag / FalseInlineTag / InstructionTag / HintTag / PropertyTag)* { return { type: TypeKey.TrueFalse_V1, value: [...value, ...others] } }

// Line of Body of the bit
BodyLine
  = value: $(NL / Char+ EOL) { return { type: TypeKey.BodyLine, value: value } }

// CardSet
CardSet
  = value: (CardSetStart Card* CardSetEnd) { return { type: TypeKey.CardSet, value: value[1].flat() } }

CardSetStart
  = NL? &("===" NL) { helper.processCardSetStart(); }

CardSetEnd
  = ("===" &EOL) { helper.processCardSetEnd(); }

Card
  = value: ("===" NL CardContent) { helper.processCard(); return value[2]; }

CardContent
  = value: ((PossibleCardLine !("===" EOL))* PossibleCardLine !EOL) {
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
  = value: ClozeInlineTag others: (ClozeInlineTag / InstructionTag / HintTag / PropertyTag)* { return { type: TypeKey.Gap, value: [value, ...others] }; }

// Select tags
SelectTags
  = value: (TrueInlineTag / FalseInlineTag)+ others: (TrueInlineTag / FalseInlineTag / InstructionTag / HintTag / PropertyTag)* { return { type: TypeKey.Select, value: [...value, ...others] } }


//
// Card content (standard)
//

// Root cardContent rule
cardContent
  = value: (CardContentTags / BodyChar)* { return value; }

CardContentTags
  = value: (ItemLeadTag / InstructionTag / HintTag / SampleSolutionTag / TrueTag / FalseTag / PropertyTag / TitleTag / ResourceTags) { return value; }

//
// Resource
//
ResourceTags
  = value: ResourceTag props: ResourcePropertyTag* {
    console.log('RESOURCE_TAGS', value, props);

    // TODO - insert other tags values into the resource tag value
    return helper.processResourceTags(value, props);
  }

// The bit header, e.g. [.interview&image:bitmark++], [.interview:bitmark--&image], [.cloze]
ResourceTag
  = NL? "[&" key: KeyValueTag_Key value: KeyValueTag_Value "]" { return { type: TypeKey.Resource, key, url: value } }

// Resource Extra Data Tag
ResourcePropertyTag
  = "[@" key: KeyValueTag_Key value: KeyValueTag_Value "]" { return { type: TypeKey.ResourceProperty, key, value } }




//
// Tags
//

// Title tag
TitleTag
  = NL? "[" level: "#"+ title: Tag_Value "]" { return { type: TypeKey.Title, value: { level, title } } }

// Anchor tag
AnchorTag
  = NL? "[▼" value: Tag_Value "]" { return { type: TypeKey.Anchor, value } }

// Reference tag
ReferenceTag
  = NL? "[►" value: Tag_Value "]" { return { type: TypeKey.Reference, value } }


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

// Sample Solution tag
SampleSolutionTag
  = NL? "[$" value: Tag_Value "]" { return { type: TypeKey.SampleSolution, value } }

// Comment Tag
CommentTag
  = NL? "||" value: Comment_Value "||" { return { type: TypeKey.Comment, value } }

//
// Inline Tags
//

// Cloze tag
ClozeInlineTag
  = "[_" value: Tag_Value "]" { return { type: TypeKey.Cloze, value } }

// True (+) tag
TrueInlineTag
  = "[+" value: Tag_Value "]" { return { type: TypeKey.True, value } }

// False (-) tag
FalseInlineTag
  = "[-" value: Tag_Value "]" { return { type: TypeKey.False, value } }


//
// Bitmark generic
//

Tag_Value
  = value: $[^\]]* { return value }

KeyValueTag_Key
  = value: $[^:\]]* { return value }

Bit_Value
  = value: $[^&:\]]* { return value }

Bit_Value_Select
  = value: $("multiple-choice-text") { return value }

KeyValueTag_Value
  = ":" value: Tag_Value { return value }
  / '' { return true }

Comment_Value
  = value: $[^||]* { return value }

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
  = [ \t]*

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

