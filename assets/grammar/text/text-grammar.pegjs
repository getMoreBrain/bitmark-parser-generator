// bitmark Text parser

{{

const VERSION = "8.34.3"

//Parser peggy.js

// parser options (parameter when running parser):
// allowedStartRules: ["bitmarkPlusPlus", "bitmarkPlus", "bitmarkMinusMinus", "bitmarkPlusString", "bitmarkMinusMinusString"]

// The start rules ending in "String" are for internal use only.
// The public rules return a full StyledText object. This means things got consitent to handle. However, this means, there is always at least one block (a paragraph in case of bitmark+ and bitmark--) present.

// Todos

// - JSON for color

// - LaTeX embed
// The formula == \\left( x | y \\right) ==|latex| is inline.

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
	•A Sub Three
	•A More Sub Three


•+ Milk
•+ Cheese
•- Wine


|image:https://apple.com|width:300|height: 400|

text ==alt text of the inline image==|image:https://img.io/img.svg|width:400|height:200|#comment| more text

|code: javascript

let a = 3
let b = 4

let c = a + b

|^code: js


|

Das war's ==1==|footnote:So long and **thanks for all the fish**|

 */





// global initializer
// global utility functions


function s(_string) {
  return _string ?? ""
}

function legacyContextAwarewUnbreakscape(_str) {
	let u_ = _str || ""

	function replacer(match, p1, offset, string, groups) {
  		return match.replace("^", "");
	}

  let re_ = new RegExp( /=\^(\^*)(?==)|\*\^(\^*)(?=\*)|_\^(\^*)(?=_)|`\^(\^*)(?=`)|!\^(\^*)(?=!)|\[\^(\^*)|•\^(\^*)|#\^(\^*)|\|\^(\^*)|\|\^(\^*)/, "g") // RegExp( /([\[*_`!])\^(?!\^)/, "g")

  u_ = u_.replace(re_, replacer)

  return u_
}

function unbreakscape(str) {
  if (typeof str !== 'string') return null;
  // return str.replace(/\^+/g, run => run.slice(1));

  return Breakscape.unbreakscape(str);
}

function removeTempParsingParent(obj) {
    if (obj && typeof obj === 'object') {
        delete obj._tempParsingParent; // Remove temp property if exists
        delete obj._tempListStart; // Remove temp property if exists

        Object.keys(obj).forEach(key => {
            // Recursively call the function for all sub-objects
            removeTempParsingParent(obj[key]);
        });
    }
}

// function cleanEmptyTextNodes(node) {
//   debugger;
//   if (Array.isArray(node)) {
//     return node.map(cleanEmptyTextNodes);
//   }
//   if (node !== null && typeof node === 'object') {
//     const hasType    = Object.prototype.hasOwnProperty.call(node, 'type');
//     const hasContent = Object.prototype.hasOwnProperty.call(node, 'content');
//     const result = {};

//     for (const [key, value] of Object.entries(node)) {
//       if (key === 'content' && hasType && hasContent && Array.isArray(value)) {
//         // filter out items where item.text === ""
//         const filtered = value.filter(item =>
//           !(item && typeof item === 'object' && 'text' in item && item.text === '')
//         );
//         result[key] = filtered.map(cleanEmptyTextNodes);

//       } else if (Array.isArray(value)) {
//         result[key] = value.map(cleanEmptyTextNodes);

//       } else {
//         result[key] = cleanEmptyTextNodes(value);
//       }
//     }

//     return result;
//   }
//   return node;
// }

/**
 * RAS 2025-05-22
 * Fixes / features
 * - Handles arrays or objects as input (including root array) - main reason for change
 * - Modifies in-place rather than copying array.
 * - Removed some unnecessary checks - will work fine without them
 */
function cleanEmptyTextNodes(root) {
  const isEmptyTextNode = (n) => n && n.type === "text" && !n.text;

  // Recursively walk 'content' arrays
  function cleanContentArray(arr) {
    for (let i = arr.length - 1; i >= 0; i--) {
      const item = arr[i];

      if (isEmptyTextNode(item)) {
        // drop the empty text node
        arr.splice(i, 1);
      } else if (item && Array.isArray(item.content)) {
        // recurse into `content` array
        cleanContentArray(item.content);
      }
      // Any other shape is ignored.
    }
  }

  if (Array.isArray(root)) {
    cleanContentArray(root);
  } else if (root && Array.isArray(root.content)) {
    cleanContentArray(root.content);
  }

  return root;
}

function bitmarkPlusPlus(_str) {

  // if (parser) {
  // 	return parser.parse(_str, { startRule: "bitmarkPlusPlus" })
  // } else {
  //   // embedded in Get More Brain
  //   return parse(_str, { startRule: "bitmarkPlusPlus" })
  // }
  if (typeof parser !== 'undefined') {
  	return parser.parse(_str, { startRule: "bitmarkPlusPlus" })
  }
  return peg$parse(_str, { startRule: "bitmarkPlusPlus" })
}

function bitmarkPlusString(_str) {

  // if (parser) {
  // 	return parser.parse(_str, { startRule: "bitmarkPlusString" })
  // } else {
  //   // embedded in Get More Brain
  //   return parse(_str, { startRule: "bitmarkPlusString" })
  // }
  if (typeof parser !== 'undefined') {
    return parser.parse(_str, { startRule: "bitmarkPlusString" })
  }
  return peg$parse(_str, { startRule: "bitmarkPlusString" })
}

function bitmarkMinusMinusString(_str) {

  // if (parser) {
  // 	return parser.parse(_str, { startRule: "bitmarkMinusMinusString" })
  // } else {
  //   // embedded in Get More Brain
  //   return parse(_str, { startRule: "bitmarkMinusMinusString" })
  // }
  if (typeof parser !== 'undefined') {
  	return parser.parse(_str, { startRule: "bitmarkMinusMinusString" })
  }
  return peg$parse(_str, { startRule: "bitmarkMinusMinusString" })
}

}}

// per-parse initializer
// instance variables

{
    var indentStack = [], indent = ""

    input = input.trimStart()
}










// peggy.js // PEG.js

//Start
//	= bitmarkMinusMinus
//	= bitmarkPlusPlus

version
  = .* { return VERSION }

bitmarkPlusPlus "StyledText"
  = Block+
  / NoContent

Block
  = b: TitleBlock { const cleaned_ = cleanEmptyTextNodes({ ...b }); return cleaned_ }
  / b: ListBlock { let lb_ = { ...b }; removeTempParsingParent(lb_); const cleaned_ = cleanEmptyTextNodes(lb_); return cleaned_ }
  / b: ImageBlock { return { ...b }}
  / b: CodeBlock { return { ...b }}
  / b: Paragraph { const cleaned_ = cleanEmptyTextNodes({ ...b }); return cleaned_ }

//const cleaned = cleanEmptyTextNodes(exampleData);

BlockStartTags
  = TitleTags
  / ListTags
  / ImageTag
  / CodeTag
  / ParagraphTag


BlockStart
  = TitleTags
  / ListTags
  / ImageBlock
  / CodeHeader
  / ExplicitParagraphHeader

BlockTag = '|'

NoContent
    = '' { return [] }



// Title Block

TitleTags
  = '### '
  / '## '
  / '# '

TitleBlock
  = h: TitleTags t: $char* EOL  NL? { return { type: "heading", content: bitmarkPlusString(t), attrs: { level: h.length - 1 } } }




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
  = c: $(CodeLine*) { return [{ type: "text", text: unbreakscape(c.trim())}] }

CodeLine
  = !BlockStart t: $(char+ EOL)  { return t }
  / NL


// Lists

BulletListTag = '• '
NoBulletListTag = '•_ '
OrderedListTag = $('•' [0-9]+ ' ')
OrderedListRomanTag = $('•' [0-9]+ 'I ')
OrderedListRomanLowerTag = $('•' [0-9]+ 'i ')
LetteredListTag = '•A '
LetteredListLowerTag = '•a '
TaskListTag = '•+ ' / "•- "

// no bullet, alpha-lower, roman-lower, roman-upper

ListTags
  = BulletListTag
  / NoBulletListTag
  / OrderedListTag
  / OrderedListRomanTag
  / OrderedListRomanLowerTag
  / LetteredListTag
  / LetteredListLowerTag
  / TaskListTag

ListBlock
  = c: BulletListContainer bl: BulletListLine+ NL? { return { ...c, content: bl, attrs: {} } }
  / c: NoBulletListContainer bl: BulletListLine+ NL? { return { ...c, content: bl, attrs: {} } }
  / c: OrderedListContainer bl: BulletListLine+ NL? { let start = bl[0]._tempListStart; return { ...c, attrs: { start }, content: bl } }
  / c: OrderedListRomanContainer bl: BulletListLine+ NL? { let start = bl[0]._tempListStart; return { ...c, attrs: { start }, content: bl } }
  / c: OrderedListRomanLowerContainer bl: BulletListLine+ NL? { let start = bl[0]._tempListStart; return { ...c, attrs: { start }, content: bl } }
  / c: LetteredListContainer bl: BulletListLine+ NL? { return { ...c, content: bl, attrs: {} } }
  / c: LetteredListLowerContainer bl: BulletListLine+ NL? { return { ...c, content: bl, attrs: {} } }
  / c: TaskListContainer bl: BulletListLine+ NL? { return { ...c, content: bl, attrs: {} } }

BulletListContainer = &BulletListTag { return { type: "bulletList" } }
NoBulletListContainer = &NoBulletListTag { return { type: "noBulletList" } }
OrderedListContainer = &OrderedListTag { return { type: "orderedList" } }
OrderedListRomanContainer = &OrderedListRomanTag { return { type: "orderedListRoman" } }
OrderedListRomanLowerContainer = &OrderedListRomanLowerTag { return { type: "orderedListRomanLower" } }
LetteredListContainer = &LetteredListTag { return { type: "letteredList" } }
LetteredListLowerContainer = &LetteredListLowerTag { return { type: "letteredListLower" } }
TaskListContainer = &TaskListTag { return { type: "taskList" } }

BulletListLine
  = SAMEDENT lt: ListTags listItem: $(( !NL . )* NL?)
    lines: ListLine*
    children: ( INDENT c: BulletListLine* DEDENT { return c })?
    {

      let _tempParsingParent = 'bulletList'

      const matchOrdered = lt.match(/•([0-9]+)([Ii]?) /)

      let start = 1

      if (matchOrdered) {
        _tempParsingParent = 'orderedList'
        if (matchOrdered.length > 1) {
            start = Number(matchOrdered[1])
        }

        if (matchOrdered.length > 2) {
            let roman = matchOrdered[2]
			if ('I' == roman) {
				_tempParsingParent = 'orderedListRoman'
			}
			if ('i' == roman) {
				_tempParsingParent = 'orderedListRomanLower'
			}
        }
      }

      if ('•_ ' == lt) {
        _tempParsingParent = 'noBulletList'
      }
      if ('•A ' == lt) {
        _tempParsingParent = 'letteredList'
      }
	  if ('•a ' == lt) {
        _tempParsingParent = 'letteredListLower'
      }
      if ('•+ ' == lt || '•- ' == lt ) {
        _tempParsingParent = 'taskList'
      }

	  let li = (listItem + lines.join("")).trim()

      let item = {
      	type: "paragraph",
		    attrs: {},
		    content: bitmarkPlusString(li)
      }

	  let content = [item]

      if (children && children[0] && children[0]._tempParsingParent) {

        let sublist = {
          type: children[0]._tempParsingParent,
          attrs: { start },
          content: children
        }

        if (sublist.type.startsWith("orderedList") || sublist.type.startsWith("letteredList")) {
	      	if (children[0]._tempListStart) {
            	const start = children[0]._tempListStart
				if (start > 1) sublist.attrs.start = start
            }
        }

        content.push(sublist)
      }

      let t = "listItem"
      let attrs = null

     if ("taskList" == _tempParsingParent) {
        t = "taskItem"
        let checked = false
        if ('•+ ' == lt) {
          checked = true
        }
        attrs = { checked }
      }

      const _tempListStart = start

      if (attrs) {
            return { type: t, attrs, content, _tempParsingParent, _tempListStart }
      } else {
            return { type: t, content, _tempParsingParent, _tempListStart }
      }
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

ParagraphTag
  = BlockTag

Paragraph
   = !BlockStart body: ParagraphBody { return { type: "paragraph", content: bitmarkPlusString(body.trim()), attrs: { } } }
   / ExplicitParagraphHeader body: ParagraphBody { return { type: "paragraph", content: bitmarkPlusString(body.trim()), attrs: { } } }
   / ExplicitParagraphHeader body: '' { return { type: "paragraph", content: bitmarkPlusString(body.trim()), attrs: { } } }

ParagraphBody
  = $(ParagraphLine+)

ParagraphLine
  = !BlockStart t: $(char+ EOL)
  / t: NL

ExplicitParagraphHeader
  = ParagraphTag $([ \t]* EOL) NL?


// Image Block

ImageType
  = 'image'

ImageTag
  = BlockTag t: ImageType { return t }

ImageBlock
  = t: ImageTag ':' ' '? u: UrlHttp ' '* BlockTag ch: MediaChain? $([ \t]* EOL) NL?
  {

    const chain = Object.assign({}, ...ch)

    let imageAlignment_ = chain.alignment || "center"; delete chain.alignment
    let textAlign_ = chain.captionAlign || "left"; delete chain.captionAlign
    let alt_ = chain.alt || null; delete chain.alt
    let title_ = chain.caption || null; delete chain.caption
    let class_ = chain.align || "center"; delete chain.align
    let zoomDisabled_ = chain.zoomDisabled === undefined ? true
    	: typeof chain.zoomDisabled === 'boolean' ? chain.zoomDisabled
    	: String(chain.zoomDisabled).toLowerCase() === 'true'; delete chain.zoomDisabled

    let image = {
      type: t,
      attrs: {
        alignment: imageAlignment_,
        textAlign: textAlign_,
        src: u,
        alt: unbreakscape(alt_),
        title: unbreakscape(title_),
        class: class_,
        zoomDisabled: zoomDisabled_,
        ...chain
      }
    }

    return image
  }


MediaChain
  = ch: MediaChainItem* { return ch }

MediaChainItem
  = '#' str: $((!BlockTag char)*) BlockTag {return { comment: str.trim() }}
  / '@'? p: MediaSizeTags ':' ' '* v: $( (!BlockTag [0-9])+) ' '* BlockTag { return { [p]: parseInt(v) } }
  / '@'? p: MediaTextTags ':' ' '* v: $((!BlockTag char)*) BlockTag { return { [p]: v.trim() } }
  / '@'? p: MediaAlignmentTags ':' ' '* v: MediaAlignment ' '* BlockTag  { return { [p]: v } }
  / '@'? p: MediaBooleanTags ':' ' '* v: Boolean ' '* BlockTag  { return { [p]: v } }
  / '@'? p: MediaBooleanTags ' '* BlockTag  { return { [p]: true } }
  / '@'? BlockTag  { return } // ignore empty chain elements ||
  / '@'? p: $((!BlockTag char)*) BlockTag { return { error: 'Found unknown property or invalid value: '+ p }} // don't break on unknown properties, but don't accept them neither

MediaSizeTags
  = 'width' / 'height'

MediaAlignmentTags
  = 'alignment' / 'captionAlign'

MediaAlignment
  = 'left' / 'center' / 'right'

MediaTextTags
  = 'alt' / 'caption'

MediaBooleanTags
  = 'zoomDisabled'

Boolean
  = 'true' / 'false'




// bitmark+

bitmarkPlus "StyledText"
  = bs: InlineTags { return [ { type: 'paragraph', content: bs, attrs: { } } ] }

bitmarkPlusString "StyledString"
  = InlineTags

InlineTags
  // RAS 2025-05-22 - for bitmarkPlus / bitmarkPlusString
  // = first: InlinePlainText? more: (InlineStyledText / InlinePlainText)*  { return first ? [first, ...more.flat()] : more.flat() }
  = first: InlinePlainText? more: (InlineStyledText / InlinePlainText)*  { const cleaned_ = cleanEmptyTextNodes(first ? [first, ...more.flat()] : more.flat()); return cleaned_ }

InlinePlainText
  = NL { return { "type": "hardBreak" } }
  / t: $(((InlineTagTags? !InlineStyledText char) / (InlineTagTags !InlineStyledText))+) { return { text: unbreakscape(t), type: "text" } } // remove breakscaping tags in body


InlineHalfTag = '='

InlineTag = InlineHalfTag InlineHalfTag

InlineStyledText
  = BodyBitOpenTag t: $(([0-9])+ ) BodyBitCloseTag { return { index: +t, type: "bit" } }
  / InlineTag t: $((!InlineTag .)* ) InlineTag '|latex|' { return { attrs: { formula: unbreakscape(t)}, type: "latex" } }
  / InlineTag alt: $((!InlineTag .)* ) InlineTag '|imageInline:' u: Url '|' ch: InlineMediaChain? { return { attrs: { alt, src: (u.pr + u.t).trim(), ...Object.assign({}, ...ch), zoomDisabled: true }, type: "imageInline" } }
  / InlineTag t: $((!InlineTag .)* ) InlineTag marks: AttrChain { if (!marks) marks = []; return { marks, text: unbreakscape(t), type: "text" } }
  / BoldTag t: $((!BoldTag .)* ) BoldTag { return { marks: [{type: "bold"}], text: unbreakscape(t), type: "text" } }
  / ItalicTag t: $((!ItalicTag .)* ) ItalicTag { return { marks: [{type: "italic"}], text: unbreakscape(t), type: "text" } }
  / LightTag t: $((!LightTag .)* ) LightTag { return { marks: [{type: "light"}], text: unbreakscape(t), type: "text" } }
  / HighlightTag t: $((!HighlightTag .)* ) HighlightTag { return { marks: [{type: "highlight"}], text: unbreakscape(t), type: "text" } }
  / u: Url { return { marks: [{ type: "link", attrs: { href: (u.pr + u.t).trim(), target: '_blank' } }], text: u.t, type: "text" } }

InlineTagTags
  = $(InlineTag InlineHalfTag+)
  / $(LightTag LightHalfTag+)
  / $(HighlightTag HighlightHalfTag+)

AttrChain
  = '|' ch: AttrChainItem+ { return ch }

InlineMediaChain
  = ch: InlineMediaChainItem* { return ch }

InlineMediaChainItem
  = '#' str: $((!BlockTag char)*) BlockTag {return { comment: str }}
  / '@'? p: MediaSizeTags ':' ' '* v: $( (!BlockTag [0-9])+) BlockTag { return { [p]: parseInt(v) } }
  / '@'? p: MediaSizeTags ':' ' '* v: $((!BlockTag char)*) BlockTag { return { type: "error", msg: p + ' must be a positive integer.', found: v }}
  / '@'? p: 'alignmentVertical' ':' ' '* v: InlineMediaAlignment BlockTag  { return { [p]: v } }
  / '@'? p: 'size' ':' ' '* v: InlineMediaSize BlockTag  { return { [p]: v } }

InlineMediaAlignment
  = 'top' / 'middle' / 'bottom' / 'baseline' / 'sub' / 'super' / 'text-bottom' / 'text-top'

InlineMediaSize
  = 'line-height' / 'font-height' / 'super' / 'sub' / 'explicit'


// ==This is a link==|link:https://www.apple.com/|
// ==503==|var:AHV Mindestbeitrag|
// ==let a = 3==|code|
// ==let a = 3==|code:javascript|

AttrChainItem
  = 'link:' str: $((!BlockTag char)*) BlockTag {return { type: 'link', attrs: { href: str.trim(), target: '_blank' } }}
  / 'extref:' str: $((!BlockTag char)*) rc: RefsChain BlockTag 'provider:' p: $((!BlockTag char)*) BlockTag {return { type: 'extref', attrs: { extref: str.trim(), references: rc, provider: p.trim() } }}
  / 'xref:' str: $((!BlockTag char)*) BlockTag '►' str2: $((!BlockTag char)*) BlockTag {return { type: 'xref', attrs: { xref: str.trim(), reference: str2.trim() } }}
  / 'xref:' str: $((!BlockTag char)*) BlockTag {return { type: 'xref', attrs: { xref: str.trim(), reference: '' } }}
  / '►' str: $((!BlockTag char)*) BlockTag {return { type: 'ref', attrs: { reference: str.trim() } }}
  / 'symbol:' str: $((!BlockTag char)*) BlockTag ch: MediaChain {const chain = Object.assign({}, ...ch); return { type: 'symbol', attrs: { src: str.trim(), ...chain } }}
  / 'footnote:' str: $((!BlockTag char)*) BlockTag {return { type: 'footnote', attrs: { content: bitmarkPlusString(str.trim()) } }}
  / 'footnote*:' str: $((!BlockTag char)*) BlockTag {return { type: 'footnote*', attrs: { content: bitmarkPlusString(str.trim()) } }}
  / 'var:' str: $((!BlockTag char)*) BlockTag {return { type: 'var', attrs: { name: str.trim() } }}
  / 'code' BlockTag {return { type: 'code', attrs: { language: "plain text" } }}
  / 'code:' lang: $((!BlockTag char)*) BlockTag {return { type: 'code', attrs: { language: lang.trim().toLowerCase() } }}
  / 'timer' BlockTag {return { type: 'timer', attrs: { name: "" } }}
  / 'timer:' str: $((!BlockTag char)*) BlockTag {return { type: 'timer', attrs: { name: str.trim() } }}
  / 'duration:' str: $('P' $((!BlockTag char)*)) BlockTag {return { type: 'duration', attrs: { duration: str } }}
  / 'color:' color: Color BlockTag {return { type: 'color', attrs: { color } }}
  / style: AlternativeStyleTags BlockTag {return { type: style }}
  / '#' str: $((!BlockTag char)*) BlockTag {return { type: "comment", comment: str }}
 // / p: $((!(BlockTag / ':') word)*) ':' ' '? v: $((!BlockTag char)*) BlockTag { return { [p]: v } }
 // / p: $((!BlockTag word)*) BlockTag {return { [p]: true } }

// glosary/index: ==term==|definition:term's definition|
// symbol (inline image): ==power symbol==|symbol:https://img.com/ps.svg| >> alt:power symbol, zoomDisable:true
// explanation:
// description:
// translation: ==Haus==|translation:house|lang:en|
// pronunciation:

RefsChain
  = (Ref)*

Ref
  = '|►' r: $((!BlockTag char)*) { return r.trim() }

AlternativeStyleTags
  = 'bold'
  / 'italic'
  / 'light'
  / 'highlight'
  / 'strike'
  / 'subscript'
  / 'superscript'
  / 'ins'
  / 'del'
  / 'underline'
  / 'doubleUnderline'
  / 'circle'
  / 'languageEmRed'
  / 'languageEmOrange'
  / 'languageEmYellow'
  / 'languageEmGreen'
  / 'languageEmBlue'
  / 'languageEmPurple'
  / 'languageEmPink'
  / 'languageEmBrown'
  / 'languageEmBlack'
  / 'languageEmWhite'
  / 'languageEmGray'
  / 'languageEm'
   / 'userUnderline'
  / 'userDoubleUnderline'
  / 'userStrike'
  / 'userCircle'
  / 'userHighlight'
  / 'notranslate'

Color
  = 'aqua'
  / 'black'
  / 'blue'
  / 'brown'
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
  / 'pink'
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
  // RAS 2025-05-22 - for bitmarkMinusMinus / bitmarkMinusMinusString
  // = first: PlainText? more: (StyledText / PlainText)*  { return first ? [first, ...more.flat()] : more.flat() }
  = first: PlainText? more: (StyledText / PlainText)*  { const cleaned_ = cleanEmptyTextNodes(first ? [first, ...more.flat()] : more.flat()); return cleaned_ }

PlainText
  = NL { return { "type": "hardBreak" } }
  / t: $(((TagTags? !StyledText char) / (TagTags !StyledText))+) { return { text: unbreakscape(t), type: "text" } } // remove breakscaping tags in body

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
  / BoldTag t: $((!BoldTag .)* ) BoldTag { return { marks: [{type: "bold"}], text: unbreakscape(t), type: "text" } }
  / ItalicTag t: $((!ItalicTag .)* ) ItalicTag { return { marks: [{type: "italic"}], text: unbreakscape(t), type: "text" } }
  / LightTag t: $((!LightTag .)* ) LightTag { return { marks: [{type: "light"}], text: unbreakscape(t), type: "text" } }
  / HighlightTag t: $((!HighlightTag .)* ) HighlightTag { return { marks: [{type: "highlight"}], text: unbreakscape(t), type: "text" } }

TagTags
  = $(LightTag LightHalfTag+)
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
