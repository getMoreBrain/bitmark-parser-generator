// bitmark Text parser
// v8.0.10

//Parser peggy.js

// parser options (parameter when running parser):
// allowedStartRules: ["bitmarkPlusPlus", "bitmarkPlus", "bitmarkMinusMinus", "bitmarkPlusString", "bitmarkMinusMinusString"]

// The start rules ending in "String" are for internal use only.
// The public rules return a full StyledText object. This means things got consitent to handle. However, this means, there is always at least one block (a paragraph in case of bitmark+ and bitmark--) present.

// Todos

// - JSON for color
// - JSON for pure marked text ==aaa== (no attributes)
// - Are empty attrs needed?

// not sure

// - LaTeX embed ?

/*

Empty StyledString

[{ "type": "text", "text": "" }] // NOK - TipTap Error
[{ "type": "text"}] // NOK - TipTap Error
[] - OK

Empty StyledText

[{ "type": "paragraph", "content": [] }] // OK
[{ "type": "paragraph" }] // OK
[] // OK - preferred

*/

/*

# Hallo

Hier kommt...

Alex

|

## Vorhang auf!

• Eins
• Zwei
	•1 Num 1 ==inline code==|code:javascript|
	•1 Num 2
	Second Line
• Three
	• Sub Three
	• More Sub Three


•+ Milk
•+ Cheese
•- Wine


|image:https://apple.com|width:300|height:  400|

|code: javascript

let a = 3
let b = 4

let c = a + b

|^code: js


|

Das war's

 */





// global initializer
// global utility functions

{{

// const UNBREAKSCAPE_REGEX = new RegExp('\\^([\\^]*)', "g");
// const UNBREAKSCAPE_REGEX = new RegExp(/=\^(\^*)(?==)|\*\^(\^*)(?=\*)|_\^(\^*)(?=_)|\[\^(\^*)|\|\^(\^*)/, "g") // RegExp( /([\[*_`!])\^(?!\^)/, "g")
const UNBREAKSCAPE_REGEX = new RegExp(/=\^(\^*)(?==)|\*\^(\^*)(?=\*)|_\^(\^*)(?=_)|`\^(\^*)(?=`)|!\^(\^*)(?=!)|\[\^(\^*)|\|\^(\^*)/, "g") // RegExp( /([\[*_`!])\^(?!\^)/, "g")

function s(_string) {
  return _string ?? ""
}

function unbreakscape(_str) {
	let u_ = _str || ""

  function replacer(match, p1, offset, string, groups) {
  		return match.replace("^", "");
	}

  let re_ = UNBREAKSCAPE_REGEX;
  u_ = u_.replace(re_, replacer)

  return u_
}

function bitmarkPlusPlus(_str) {
  if (typeof parser !== 'undefined') {
  	return parser.parse(_str, { startRule: "bitmarkPlusPlus" })
  }
  return peg$parse(_str, { startRule: "bitmarkPlusPlus" })
  // if (parser) {
  // 	return parser.parse(_str, { startRule: "bitmarkPlusPlus" })
  // } else {
  //   // embedded in Get More Brain
  //   return parse(_str, { startRule: "bitmarkPlusPlus" })
  // }
}

function bitmarkPlusString(_str) {
  if (typeof parser !== 'undefined') {
    return parser.parse(_str, { startRule: "bitmarkPlusString" })
  }
  return peg$parse(_str, { startRule: "bitmarkPlusString" })
  // if (parser) {
  // 	return parser.parse(_str, { startRule: "bitmarkPlusString" })
  // } else {
  //   // embedded in Get More Brain
  //   return parse(_str, { startRule: "bitmarkPlusString" })
  // }
}

function bitmarkMinusMinusString(_str) {
  if (typeof parser !== 'undefined') {
  	return parser.parse(_str, { startRule: "bitmarkMinusMinusString" })
  }
  return peg$parse(_str, { startRule: "bitmarkMinusMinusString" })
  // if (parser) {
  // 	return parser.parse(_str, { startRule: "bitmarkMinusMinusString" })
  // } else {
  //   // embedded in Get More Brain
  //   return parse(_str, { startRule: "bitmarkMinusMinusString" })
  // }
}

}}

// per-parse initializer
//   instance variables

{
    var indentStack = [], indent = ""

    input = input.trimStart()
}










// peggy.js // PEG.js

bitmarkPlusPlus "StyledText"
  = Block+
  / NoContent

Block
  = b: TitleBlock { return { ...b }}
  / b: ListBlock { return { ...b }}
  / b: ImageBlock { return { ...b }}
  / b: CodeBlock { return { ...b }}
  / b: Paragraph { return { ...b }}


BlockStartTags
  = TitleTags
  / ListTags
  / ImageTag
  / CodeTag

BlockTag = '|'

NoContent
    = '' { return [] }

Heading
  = ':' h: $(char*) { return bitmarkMinusMinusString(h.trim()) }
  / '' { return [] }



// Title Block

TitleTags
  = '### '
  / '## '
  / '# '

TitleBlock
  = h: TitleTags t: $char* EOL  NL? { return { type: "heading", content: bitmarkMinusMinusString(t), attrs: { level: h.length - 1 } } }




// Code Block

CodeType
  = 'code'

CodeTag
  = BlockTag t: CodeType { return t }

CodeBlock
  = h: CodeHeader b: CodeBody { return { ...h, content: b }}

CodeHeader
  = CodeTag $([ \t]* EOL) { return { type: "codeBlock", language: "" }}
  / CodeTag ':' l: CodeLanguage $([ \t]* EOL) { return { type: "codeBlock", attrs: { language: l.trim().toLowerCase() } }}

CodeLanguage
  = 'bitmark++'
  / 'bitmark--'
  / 'JavaScript'
  / $(char+)
  / ''

 // https://en.wikipedia.org/wiki/List_of_programming_languages
 // https://en.wikipedia.org/wiki/List_of_markup_languages
 // https://en.wikipedia.org/wiki/List_of_document_markup_languages

CodeBody
  = c: $(CodeLine*) { return [{ type: "text", text: c.trim()}] }

CodeLine
  = !(BlockStartTags / (BlockTag [ \t]* EOL)) t: $(char+ EOL)  { return t }
  / NL


// Lists

BulletListTag = '• '
OrderedListTag = '•1 '
TaskListTag = '•+ ' / "•- "

ListTags
  = BulletListTag
  / OrderedListTag
  / TaskListTag

ListBlock
  = c: BulletListContainer bl: BulletListLine+ NL? { return { ...c, content: bl, attrs: { } } }
  / c: OrderedListContainer bl: BulletListLine+ NL? { return { ...c, content: bl, attrs: { } } }
  / c: TaskListContainer bl: BulletListLine+ NL? { return { ...c, content: bl, attrs: { } } }

BulletListContainer = &BulletListTag { return { type: "bulletList" } }
OrderedListContainer = &OrderedListTag { return { type: "orderedList" } }
TaskListContainer = &TaskListTag { return { type: "taskList" } }

BulletListLine
  = SAMEDENT lt: ListTags listItem: $(( !NL . )* NL?)
    lines: ListLine*
    children: ( INDENT c: BulletListLine* DEDENT { return c })?
    {

      let parent = 'bulletList'
      if ('•1 ' == lt) {
        parent = 'orderedList'
      }
      if ('•+ ' == lt || '•- ' == lt ) {
        parent = 'taskList'
      }

	    let li = (listItem + lines.join("")).trim()

      let item = {
      	type: "paragraph",
		    attrs: { },
      	content: bitmarkPlusString(li)
      }

	    let content = [item]

      if (children && children[0] && children[0].parent) {
        let sublist = {
          type: children[0].parent,
          attrs: { start: 1 },
          content: children,
          parent: ""
        }

        if ("orderedList" == sublist.parent) {
        	sublist.attrs.start = 1
        }

        content.push(sublist)
      }

      let t = "listItem"
      let attrs = {}

      if ("taskList" == parent) {
        t = "taskItem"
        let checked = false
        if ('•+ ' == lt) {
          checked = true
        }
        attrs = { checked }
      }

      return { type: t, content, parent, attrs }
    }

ListLine
  = !BlankLine SAMEDENT !ListTags ll: $(( !NL . )+ EOL) { return ll }

BlankLine
  = [ \t] * NL


SAMEDENT
  = i: '\t' * &{ return i.join("") === indent }

INDENT
  = &( i: '\t' + &{ return i.length > indent.length }
      { indentStack.push(indent); indent = i.join("")})

DEDENT
  = &{ indent = indentStack.pop(); return true }




// Paragraph (Block)

Paragraph
   = !BlockStartTags BlockTag? body: ParagraphBody { return { type: "paragraph", content: bitmarkPlusString(body.trim()), attrs: { } } }

ParagraphBody
  = $(ParagraphLine+)

ParagraphLine
  = !BlockStartTags t: $(char+ EOL)
  / t: NL



// Image Block

ImageType
  = 'image'

ImageTag
  = BlockTag t: ImageType { return t }

ImageBlock
  = t: ImageTag ':' ' '? u: UrlHttp BlockTag ch: MediaChain? $([ \t]* EOL) NL?
  {

    const chain = Object.assign({}, ...ch)

    let textAlign_ = chain.captionAlign || "left"; delete chain.captionAlign
    let alt_ = chain.alt || null; delete chain.alt
    let title_ = chain.caption || null; delete chain.caption
    let class_ = chain.align || "center"; delete chain.align

    let image = {
      type: t,
      attrs: {
        textAlign: textAlign_,
        src: u,
        alt: alt_,
        title: title_,
        class: class_,
        ...chain
      }
    }

    return image
  }


MediaChain
  = ch: MediaChainItem* { return ch }

MediaChainItem
  = '#' str: $((!BlockTag char)*) BlockTag {return { comment: str }}
  / '@'? p: MediaNumberTags ':' ' '* v: $( (!BlockTag [0-9])+) BlockTag { return { [p]: parseInt(v) } }
  / '@'? p: MediaNumberTags ':' ' '* v: $((!BlockTag char)*) BlockTag { return { type: "error", msg: p + ' must be an positive integer.', found: v }}
  / '@'? p: $((!(BlockTag / ':') char)*) ':' ' '? v: $((!BlockTag char)*) BlockTag { return { [p]: v } }
  / '@'? p: $((!BlockTag char)*) BlockTag {return { [p]: true } }

MediaNumberTags
  = 'width' / 'height'







// bitmark+

bitmarkPlus "StyledText"
  = bs: InlineTags { return [ { type: 'paragraph', content: bs, attrs: { } } ] }

bitmarkPlusString "StyledString"
  = InlineTags

InlineTags
  = first: InlinePlainText? more: (InlineStyledText / InlinePlainText)*  { return first ? [first, ...more.flat()] : more.flat() }

InlinePlainText
  = NL { return { text: "\n", type: "text" } }
  / t: $(((InlineTagTags? !InlineStyledText .) / (InlineTagTags !InlineStyledText))+) { return { text: unbreakscape(t), type: "text" } } // remove breakscaping tags in body


InlineHalfTag = '='
InlineLaTexHalfTag = '𝑓'  // |𝑓 Latex Block

InlineTag = InlineHalfTag InlineHalfTag
InlineLaTexTag = InlineLaTexHalfTag InlineLaTexHalfTag

InlineStyledText
  = BodyBitOpenTag t: $(([0-9])+ ) BodyBitCloseTag { return { index: +t, type: "bit" } }
  / InlineTag ' '? t: $((!(' '? InlineTag) .)* ) ' '? InlineTag marks: AttrChain? { if (!marks) marks = []; return { marks, text: unbreakscape(t), type: "text" } }
  / BoldTag ' '? t: $((!(' '? BoldTag) .)* ) ' '? BoldTag { return { marks: [{type: "bold"}], text: unbreakscape(t), type: "text" } }
  / ItalicTag ' '? t: $((!(' '? ItalicTag) .)* ) ' '? ItalicTag { return { marks: [{type: "italic"}], text: unbreakscape(t), type: "text" } }
  / LightTag ' '? t: $((!(' '? LightTag) .)* ) ' '? LightTag { return { marks: [{type: "light"}], text: unbreakscape(t), type: "text" } }
  / HighlightTag ' '? t: $((!(' '? HighlightTag) .)* ) ' '? HighlightTag { return { marks: [{type: "highlight"}], text: unbreakscape(t), type: "text" } }
  / u: Url { return { marks: [{ type: "link", attrs: { href: (u.pr + u.t).trim(), target: '_blank' } }], text: u.t, type: "text" } }

InlineTagTags
  = $(InlineTag InlineHalfTag+)
  / $(InlineLaTexTag InlineLaTexHalfTag+)
  / $(LightTag LightHalfTag+)
  / $(HighlightTag HighlightHalfTag+)

AttrChain
  = '|' ch: AttrChainItem* { return ch }

// ==This is a link==|link:https://www.apple.com/|
// ==503==|var:AHV Mindestbeitrag|
// ==let a = 3==|code|
// ==let a = 3==|code:javascript|

AttrChainItem
  = 'link:' str: $((!BlockTag char)*) BlockTag {return { type: 'link', attrs: { href: str.trim(), target: '_blank' } }}
  / 'var:' str: $((!BlockTag char)*) BlockTag {return { type: 'var', attrs: { name: str.trim() } }}
  / 'code' BlockTag {return { type: 'code', attrs: { language: "plain text" } }}
  / 'code:' lang: $((!BlockTag char)*) BlockTag {return { type: 'code', attrs: { language: lang.trim().toLowerCase() } }}
  / 'color:' color: Color BlockTag {return { type: 'color', attrs: { color } }}
  / style: AlternativeStyleTags BlockTag {return { type: style }}
  / '#' str: $((!BlockTag char)*) BlockTag {return { type: "comment", comment: str }}
 // / p: $((!(BlockTag / ':') word)*) ':' ' '? v: $((!BlockTag char)*) BlockTag { return { [p]: v } }
 // / p: $((!BlockTag word)*) BlockTag {return { [p]: true } }

AlternativeStyleTags
  = 'bold'
  / 'italic'
  / 'light'
  / 'highlight'
  / 'strike'
  / 'sub'
  / 'super'
  / 'ins'
  / 'del'


Color
  = 'aqua'
  / 'black'
  / 'blue'
  / 'pink'
  / 'fuchsia'
  / 'lightgrey'
  / 'gray'
  / 'darkgray'
  / 'green'
  / 'lime'
  / 'magenta'
  / 'maroon'
  / 'navy'
  / 'olive'
  / 'orange'
  / 'purple'
  / 'red'
  / 'silver'
  / 'teal'
  / 'violet'
  / 'white'
  / 'yellow'







// bitmark--

bitmarkMinusMinus "MinimalStyledText"
  = bs: bitmarkMinusMinusString { return [ { type: 'paragraph', content: bs, attrs: { } } ] }

bitmarkMinusMinusString "MinimalStyledString"
  = first: PlainText? more: (StyledText / PlainText)*  { return first ? [first, ...more.flat()] : more.flat() }

PlainText
  = t: $((TagTags? !StyledText .)+) { return { text: unbreakscape(t), type: "text" } } // remove breakscaping tags in body
  / NL

BoldHalfTag = '*'
ItalicHalfTag = '_'
LightHalfTag = '`'
HighlightHalfTag = '!'

BoldTag = BoldHalfTag BoldHalfTag
ItalicTag = ItalicHalfTag ItalicHalfTag
LightTag = LightHalfTag LightHalfTag
HighlightTag = HighlightHalfTag HighlightHalfTag

// Reuse the instruction tag for the body bit.
// It cannot appear in the body as the bitmark parser would remove it, so it is safe to re-use.
BodyBitOpenTag = '[!'
BodyBitCloseTag = ']'

StyledText
  = BodyBitOpenTag t: $(([0-9])+ ) BodyBitCloseTag { return { index: +t, type: "bit" } }
  / BoldTag ' '? t: $((!(' '? BoldTag) .)* ) ' '? BoldTag { return { marks: [{type: "bold"}], text: unbreakscape(t), type: "text" } }
  / ItalicTag ' '? t: $((!(' '? ItalicTag) .)* ) ' '? ItalicTag { return { marks: [{type: "italic"}], text: unbreakscape(t), type: "text" } }
  / LightTag ' '? t: $((!(' '? LightTag) .)* ) ' '? LightTag { return { marks: [{type: "light"}], text: unbreakscape(t), type: "text" } }
  / HighlightTag ' '? t: $((!(' '? HighlightTag) .)* ) ' '? HighlightTag { return { marks: [{type: "highlight"}], text: unbreakscape(t), type: "text" } }

TagTags
  = $(BoldTag BoldHalfTag+)
  / $(ItalicTag ItalicHalfTag+)
  / $(LightTag LightHalfTag+)
  / $(HighlightTag HighlightHalfTag+)




NL "Line Terminator"
  = "\n"
  / "\r\n"
  / "\r"
  / "\u2028"
  / "\u2029"

WSL "whitespace in line"
  = [ \t]*

_ "space"
  = $((WhiteSpace / LineTerminator )*)

HTS "language tag separator"
    = [ \t] / NL

WhiteSpace "white space, separator"
  = [\t\v\f \u00A0\uFEFF\u0020\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]

LineTerminator = [\n\r\u2028\u2029]
char = [^\n\r\u2028\u2029] //u2028: line separator, u2029: paragraph separator
word = [^\n\r\u2028\u2029\t\v\f \u00A0\uFEFF\u0020\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]

EOL = NL / !.

UrlHttp
  = $( 'http' 's'? '://' (!BlockTag UrlChars)* )

Url
  = pr: $( 'http' 's'? '://' / 'mailto:' ) t: $((!BlockTag UrlChars)* ) { return { pr, t} }

UrlChars
  =  [a-zA-Z0-9!*'()=+-/._?#@[\]$&(),;%:{}] / '~' / '^' / "'"
