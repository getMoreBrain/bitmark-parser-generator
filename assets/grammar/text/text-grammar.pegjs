// bitmark Text parser
// v7.4.4

//Parser peggy.js

// parser options (parameter when running parser):
// allowedStartRules: ["bitmarkPlusPlus", "bitmarkPlus", "bitmarkMinusMinus"]

// Todos

// - finalize inline code, codeBlock
//      - JSON of colored code extension
//      - lang case (caMel, lower?? > enforce)
//      - default for undefined language
// - JSON for color
// - JSON for pure marked text ==aaa== (no attributes)

// not sure

// - LaTeX embed ?
// - inline user comment // == Notiztext ==|user-note:@gaba| ?

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

|note

|note: Title

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

|

Das war's

 */

// global initializer
// global utility functions

{{

function s(_string) {
  return _string ?? ""
}

function unbreakscape(_str) {
	let u_ = _str || ""

  let re_ = new RegExp( /([*_`!])\^(?!\^)/, "g")
  u_ = u_.replace(re_, "$1")

  return u_
}

function bitmarkPlusPlus(_str) {
    return peg$parse(_str, { startRule: "bitmarkPlusPlus" })
}

function bitmarkPlus(_str) {
    return peg$parse(_str, { startRule: "bitmarkPlus" })
}

function bitmarkMinusMinus(_str) {
    return peg$parse(_str, { startRule: "bitmarkMinusMinus" })
}

}}

// per-parse initializer
//   instance variables

{
    let section = ""
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
  / b: Section { return { ...b }}
  / b: Paragraph { return { ...b }}


BlockStartTags
  = TitleTags
  / ListTags
  / ImageTag
  / CodeTag
  / SectionTag

BlockTag = '|'

NoContent
    = '' { return [] }


// Sections

SectionTag
  = BlockTag t: SectionType { return t }

Section
  = t: SectionTag h: Heading $([ \t]* EOL) NL? { section = t; return { type: "section", section: t, ...(0 != h.length && { content: h }) } }
  / BlockTag garbage: $(char+ EOL) { return { type: "error", msg: 'Unknown section type.', found: garbage }}

SectionType
  = 'note'
  / 'remark'
  / 'info'
  / 'hint'
  / 'help'
  / 'warning'
  / 'danger'
  / 'example'
  / 'side-note'
  / ''

Heading
  = ':' h: $(char*) { return bitmarkMinusMinus(h.trim()) }
  / '' { return [] }



// Title Block

TitleTags
  = '## '
  / '# '

TitleBlock
  = h: TitleTags t: $char* EOL  NL? { return { type: "heading", content: bitmarkMinusMinus(t), attrs: { level: h.length - 1, section } } }




// Code Block

CodeType
  = 'code'

CodeTag
  = BlockTag t: CodeType { return t }

CodeBlock
  = h: CodeHeader b: CodeBody { return { ...h, content: b }}

CodeHeader
  = CodeTag $([ \t]* EOL) { return { type: "codeBlock", codeLanguage: "", section }}
  / CodeTag ':' l: CodeLanguage $([ \t]* EOL) { return { type: "codeBlock", attrs: {language: l.trim(), section } }}

CodeLanguage
  = 'bitmark++'
  / 'bitmark--'
  / 'JavaScript'
  / $([a-zA-Z0-8 +!.#//*éö@:π-′]+)
  / ''

 // https://en.wikipedia.org/wiki/List_of_programming_languages
 // https://en.wikipedia.org/wiki/List_of_markup_languages
 // https://en.wikipedia.org/wiki/List_of_document_markup_languages

CodeBody
  = c: $(CodeLine*) { return [{ type: "text", text: c.trim()}] }

CodeLine
  = !BlockStartTags t: $(char+ EOL)  { return t }
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
  = c: BulletListContainer bl: BulletListLine+ NL? { return { ...c, content: bl, attrs: { section } } }
  / c: OrderedListContainer bl: BulletListLine+ NL? { return { ...c, content: bl, attrs: { section } } }
  / c: TaskListContainer bl: BulletListLine+ NL? { return { ...c, content: bl, attrs: { section } } }

BulletListContainer = &BulletListTag { return { type: "bulletList" } }
OrderedListContainer = &OrderedListTag { return { type: "orderedList" } }
TaskListContainer = &TaskListTag { return { type: "taskList" } }

BulletListLine
  = SAMEDENT lt: ListTags listItem: $(( !NL . )* NL?)
    lines: ListLine*
    children: ( INDENT c: BulletListLine* DEDENT { return c })?
    {

      if (null === section) section = "";

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
		    attrs: { section },
      	content: bitmarkPlus(li)
      }

	    let content = [item]

      if (children && children[0] && children[0].parent) {
        let sublist = {
          type: children[0].parent,
          attrs: { start: 1, section },
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
  = [ \t]* NL


SAMEDENT
  = i: '\t'* &{ return i.join("") === indent }

INDENT
  = &( i: '\t'+ &{ return i.length > indent.length }
      { indentStack.push(indent); indent = i.join("")})

DEDENT
  = &{ indent = indentStack.pop(); return true }




// Paragraph (Block)

Paragraph
   = !BlockStartTags body: ParagraphBody { return { type: "paragraph", content: bitmarkPlus(body.trim()), attrs: { section } } }

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
        ...chain,
        section
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


// StyledString

bitmarkPlus "StyledString"
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
  / 'code:' lang: $((!BlockTag char)*) BlockTag {return { type: 'code', attrs: { language: lang.trim() } }}
  / 'color:' color: Color BlockTag {return { type: 'color', attrs: { color } }}
  / style: AlternativeStyleTags BlockTag {return { type: style }}
  / '#' str: $((!BlockTag char)*) BlockTag {return { comment: str }}
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

bitmarkMinusMinus "MinmialStyledString"
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
