# PLAN-002 Bitmark CLI help

## Overview
Imporve the help to include information missing from the port for the old CLI.

## Context

Th CLI in this project was converter from an old OCLIF CLI. There is information missing in the help of the new CLI.

## Progress
- [x] <root> help updated to Commander ideal output
- [x] convert command help aligned with ideal output
- [x] convertText command help aligned with ideal output
- [x] breakscape command help aligned with ideal output
- [x] unbreakscape command help aligned with ideal output
- [x] info command help aligned with ideal output


### Key Enums & Types (from `src/index.ts`)
- `BitmarkVersion` - enum for bitmark version (2, 3)
- `BitmarkParserType` - enum for parser type ('peggy', 'antlr' deprecated)
- `Output` - enum for output format ('bitmark', 'json', 'ast')
- `BodyTextFormat` - enum for text format ('bitmark++', others)
- `CardSetVersion` - enum for card set version (1, 2)
- `InfoType` - enum for info type ('list', 'all', 'deprecated', 'bit')
- `InfoFormat` - enum for info format ('text', 'json')

### Legacy CLI Reference
From old oclif-based implementation (provided in user request):
- Used `@oclif/core` with `Command`, `Args`, `Flags`
- Commands: convert, convertText, breakscape, unbreakscape, info
- Each command had stdin fallback via `readStream(process.stdin)`
- File output used `fs-extra` with `ensureDirSync` + `writeFileSync`
- Included special handling for `antlr` parser (legacy `bitmark-grammar` package)

## Functional Requirements

### Command: <root>

#### Existing
```
Usage: bitmark-parser [options] [command]

Bitmark parser command line interface

Options:
  -h, --help                      display help for command

Commands:
  convert [options] [input]       Convert between bitmark formats
  convertText [options] [input]   Convert between bitmark text formats
  breakscape [options] [input]    Breakscape text
  unbreakscape [options] [input]  Unbreakscape text
  info [options] [info]           Display information about bitmark
  help                            Display help for bitmark-parser.
```

#### Ideal Output
```
Usage: bitmark-parser [options] [command]

Bitmark parser command line interface

Options:
  -v, --version                   Display version
  -h, --help                      Display help for command

Commands:
  convert [options] [input]       Convert between bitmark formats
  convertText [options] [input]   Convert between bitmark text formats
  breakscape [options] [input]    Breakscape text
  unbreakscape [options] [input]  Unbreakscape text
  info [options] [info]           Display information about bitmark
  version                         Display version
  help                            Display help for bitmark-parser
```

### Command: convert

#### Existing
```
Usage: bitmark-parser convert [options] [input]

Convert between bitmark formats

Arguments:
  input                         file to read, or bitmark or json string. If not specified, input will be from <stdin>

Options:
  -v, --version <version>       version of bitmark to use (default: latest)
  -f, --format <format>         output format. If not specified, bitmark is converted to JSON, and JSON / AST is converted to bitmark
  -w, --warnings                enable warnings in the output
  -a, --append                  append to the output file (default is to overwrite)
  -o, --output <file>           output file. If not specified, output will be to <stdout>
  -p, --pretty                  prettify the JSON output with indent
  --indent <indent>             prettify indent (default:2)
  --plainText                   output text as plain text rather than JSON (default: set by bitmark version)
  --excludeUnknownProperties    exclude unknown properties in the JSON output
  --explicitTextFormat          include bitmark text format in bitmark even if it is the default (bitmark++)
  --spacesAroundValues <value>  number of spaces around values in bitmark (default: 1)
  --cardSetVersion <version>    version of card set to use in bitmark (default: set by bitmark version)
  --parser <parser>             parser to use (default: "peggy")
  -h, --help                    display help for command
```
 #### OCLIF Original

```
Convert between bitmark formats

USAGE
  $ bitmark-parser convert [INPUT] [-v 2|3] [-f bitmark|json|ast] [-w] [--indent INDENT -p] [--plainText] [--excludeUnknownProperties] [--explicitTextFormat] [--spacesAroundValues <value>] [--cardSetVersion 1|2] [-a -o FILE] [--parser peggy|antlr]

ARGUMENTS
  [INPUT]  file to read, or bitmark or json string. If not specified, input will be from <stdin>

FLAGS
  -f, --format=<option>   output format. If not specified, bitmark is converted to JSON, and JSON / AST is converted to bitmark
                          <options: bitmark|json|ast>
  -v, --version=<option>  version of bitmark to use (default: latest)
                          <options: 2|3>
  -w, --warnings          enable warnings in the output

FILE OUTPUT FLAGS
  -a, --append       append to the output file (default is to overwrite)
  -o, --output=FILE  output file. If not specified, output will be to <stdout>

JSON FORMATTING FLAGS
  -p, --pretty                    prettify the JSON output with indent
      --excludeUnknownProperties  exclude unknown properties in the JSON output
      --indent=INDENT             prettify indent (default:2)
      --plainText                 output text as plain text rather than JSON (default: set by bitmark version)

BITMARK FORMATTING FLAGS
  --cardSetVersion=<option>     version of card set to use in bitmark (default: set by bitmark version)
                                <options: 1|2>
  --explicitTextFormat          include bitmark text format in bitmark even if it is the default (bitmark++)
  --spacesAroundValues=<value>  number of spaces around values in bitmark (default: 1)

PARSER OPTIONS FLAGS
  --parser=<option>  [default: peggy] parser to use
                     <options: peggy|antlr>

DESCRIPTION
  Convert between bitmark formats

EXAMPLES
  $ bitmark-parser convert '[.article] Hello World'

  $ bitmark-parser convert '[{"bitmark": "[.article] Hello World","bit": { "type": "article", "format": "bitmark++", "body": "Hello World" }}]'

  $ bitmark-parser convert input.json -o output.bitmark

  $ bitmark-parser convert input.bitmark -o output.json

  $ bitmark-parser convert -f ast input.json -o output.ast.json
```

#### Ideal Output
```
Usage: bitmark-parser convert [options] [input]

Convert between bitmark formats

Arguments:
  input                          file to read, or bitmark or json string. If not specified, input will be from <stdin>

Options:
  -v, --version <version>        version of bitmark to use (choices: 2|3; default: latest)
  -f, --format <format>          output format (choices: bitmark|json|ast; default: inferred from input)
  -w, --warnings                 enable warnings in the output
  -a, --append                   append to the output file (default: overwrite)
  -o, --output <file>            output file. If not specified, output will be to <stdout>
  -p, --pretty                   prettify the JSON output with indent
      --indent <indent>          prettify indent (default: 2 when --pretty is set)
      --plainText                output text as plain text rather than JSON (default: set by bitmark version)
      --excludeUnknownProperties exclude unknown properties in the JSON output
      --explicitTextFormat       include bitmark text format in bitmark even if it is the default (bitmark++)
      --spacesAroundValues <n>   number of spaces around values in bitmark (default: 1)
      --cardSetVersion <version> version of card set to use in bitmark (choices: 1|2; default: set by bitmark version)
      --parser <parser>          parser to use (choices: peggy|antlr; default: peggy)
  -h, --help                     display help for command

Examples:
  $ bitmark-parser convert '[.article] Hello World'

  $ bitmark-parser convert '[{"bitmark": "[.article] Hello World","bit": { "type": "article", "format": "bitmark++", "body": "Hello World" }}]'

  $ bitmark-parser convert input.json -o output.bitmark

  $ bitmark-parser convert input.bitmark -o output.json

  $ bitmark-parser convert -f ast input.json -o output.ast.json
```

**Implementation notes**:
- Input detection: Check if file exists → read file; else treat as literal string; else read stdin
- Parser option `antlr` requires fallback to legacy `bitmark-grammar` package's `parse()` function
- Map Commander flags to `ConvertOptions` interface for `BitmarkParserGenerator.convert()`
- Output: stdout if no `-o`, else write to file with append/overwrite

### Command: convertText

#### Existing
```
Usage: bitmark-parser convertText [options] [input]

Convert between bitmark text formats

Arguments:
  input                      file to read, or text or json string. If not specified, input will be from <stdin>

Options:
  -f, --textFormat <format>  conversion format (default: "bitmark++")
  -a, --append               append to the output file (default is to overwrite)
  -o, --output <file>        output file. If not specified, output will be to <stdout>
  -p, --pretty               prettify the JSON output with indent
  --indent <indent>          prettify indent (default:2)
  -h, --help                 display help for command
```

 #### OCLIF Original
```
Convert between bitmark text formats

USAGE
  $ bitmark-parser convertText [INPUT] [-f bitmark++] [--indent INDENT -p] [-a -o FILE]

ARGUMENTS
  [INPUT]  file to read, or text or json string. If not specified, input will be from <stdin>

FLAGS
  -f, --textFormat=<option>  [default: bitmark++] conversion format
                             <options: bitmark++>

FILE OUTPUT FLAGS
  -a, --append       append to the output file (default is to overwrite)
  -o, --output=FILE  output file. If not specified, output will be to <stdout>

JSON FORMATTING FLAGS
  -p, --pretty         prettify the JSON output with indent
      --indent=INDENT  prettify indent (default:2)

DESCRIPTION
  Convert between bitmark text formats

EXAMPLES
  $ bitmark-parser convertText 'Hello World'

  $ bitmark-parser convertText '[{"type":"paragraph","content":[{"text":"Hello World","type":"text"}],"attrs":{}}]'

  $ bitmark-parser convertText input.json -o output.txt

  $ bitmark-parser convertText input.txt -o output.json
```

#### Ideal Output
```
Usage: bitmark-parser convertText [options] [input]

Convert between bitmark text formats

Arguments:
  input                         file to read, or text or json string. If not specified, input will be from <stdin>

Options:
  -f, --textFormat <format>     conversion format (choices: bitmark++|text|latex|json|xml; default: bitmark++)
  -a, --append                  append to the output file (default: overwrite)
  -o, --output <file>           output file. If not specified, output will be to <stdout>
  -p, --pretty                  prettify the JSON output with indent
      --indent <indent>         prettify indent (default: 2 when --pretty is set)
  -h, --help                    display help for command

Examples:
  $ bitmark-parser convertText 'Hello World'

  $ bitmark-parser convertText '[{"type":"paragraph","content":[{"text":"Hello World","type":"text"}],"attrs":{}}]'

  $ bitmark-parser convertText input.json -o output.txt

  $ bitmark-parser convertText input.txt -o output.json
```

**Implementation notes**:
- Delegates to `BitmarkParserGenerator.convertText(input, options)`
- Simpler than convert—only text format and JSON output options

### Command: breakscape

#### Existing
```
Usage: bitmark-parser breakscape [options] [input]

Breakscape text

Arguments:
  input                file to read, or text. If not specified, input will be from <stdin>

Options:
  -a, --append         append to the output file (default is to overwrite)
  -o, --output <file>  output file. If not specified, output will be to <stdout>
  -h, --help           display help for command
```

 #### OCLIF Original
```
Breakscape text

USAGE
  $ bitmark-parser breakscape [INPUT] [-a -o FILE]

ARGUMENTS
  [INPUT]  file to read, or text. If not specified, input will be from <stdin>

FILE OUTPUT FLAGS
  -a, --append       append to the output file (default is to overwrite)
  -o, --output=FILE  output file. If not specified, output will be to <stdout>

DESCRIPTION
  Breakscape text

EXAMPLES
  $ bitmark-parser breakscape '[.article] Hello World'

  $ bitmark-parser breakscape input.txt -o output.txt
```

#### Ideal Output
```
Usage: bitmark-parser breakscape [options] [input]

Breakscape text

Arguments:
  input                file to read, or text. If not specified, input will be from <stdin>

Options:
  -a, --append         append to the output file (default: overwrite)
  -o, --output <file>  output file. If not specified, output will be to <stdout>
  -h, --help           display help for command

Examples:
  $ bitmark-parser breakscape '[.article] Hello World'

  $ bitmark-parser breakscape input.txt -o output.txt
```

**Implementation notes**:
- Delegates to `BitmarkParserGenerator.breakscapeText(input, options)`
- Returns string, outputs to stdout or file

### Command: unbreakscape

#### Existing
```
Usage: bitmark-parser unbreakscape [options] [input]

Unbreakscape text

Arguments:
  input                file to read, or text. If not specified, input will be from <stdin>

Options:
  -a, --append         append to the output file (default is to overwrite)
  -o, --output <file>  output file. If not specified, output will be to <stdout>
  -h, --help           display help for command
```

 #### OCLIF Original
```
Unbreakscape text

USAGE
  $ bitmark-parser unbreakscape [INPUT] [-a -o FILE]

ARGUMENTS
  [INPUT]  file to read, or text. If not specified, input will be from <stdin>

FILE OUTPUT FLAGS
  -a, --append       append to the output file (default is to overwrite)
  -o, --output=FILE  output file. If not specified, output will be to <stdout>

DESCRIPTION
  Unbreakscape text

EXAMPLES
  $ bitmark-parser unbreakscape '[^.article] Hello World'

  $ bitmark-parser unbreakscape input.txt -o output.txt
```

#### Ideal Output
```
Usage: bitmark-parser unbreakscape [options] [input]

Unbreakscape text

Arguments:
  input                file to read, or text. If not specified, input will be from <stdin>

Options:
  -a, --append         append to the output file (default: overwrite)
  -o, --output <file>  output file. If not specified, output will be to <stdout>
  -h, --help           display help for command

Examples:
  $ bitmark-parser unbreakscape '[^.article] Hello World'

  $ bitmark-parser unbreakscape input.txt -o output.txt
```

**Implementation notes**:
- Delegates to `BitmarkParserGenerator.unbreakscapeText(input, options)`
- Returns string, outputs to stdout or file

### Command: info

#### Existing
```
Usage: bitmark-parser info [options] [info]

Display information about bitmark

Arguments:
  info                   information to return. If not specified, a list of bits will be returned (default: "list")

Options:
  -f, --format <format>  output format. If not specified, the ouput will be text (default: "text")
  --all                  output all bits including deprecated
  --bit <value>          bit to filter. If not specified, all bits will be returned
  --deprecated           output deprecated bits
  -a, --append           append to the output file (default is to overwrite)
  -o, --output <file>    output file. If not specified, output will be to <stdout>
  -p, --pretty           prettify the JSON output with indent
  --indent <indent>      prettify indent (default:2)
  -h, --help             display help for command
```

#### OCLIF Original
```
Display information about bitmark

USAGE
  $ bitmark-parser info [INFO] [-f text|json] [--bit <value> | --all | --deprecated] [--indent INDENT -p] [-a -o FILE]

ARGUMENTS
  [INFO]  (list|bit) [default: list] information to return. If not specified, a list of bits will be returned

FLAGS
  -f, --format=<option>  [default: text] output format. If not specified, the ouput will be text
                         <options: text|json>
      --all              output all bits including deprecated
      --bit=<value>      bit to filter. If not specified, all bits will be returned
      --deprecated       output deprecated bits

FILE OUTPUT FLAGS
  -a, --append       append to the output file (default is to overwrite)
  -o, --output=FILE  output file. If not specified, output will be to <stdout>

JSON FORMATTING FLAGS
  -p, --pretty         prettify the JSON output with indent
      --indent=INDENT  prettify indent (default:2)

DESCRIPTION
  Display information about bitmark

EXAMPLES
  $ bitmark-parser info

  $ bitmark-parser info --all

  $ bitmark-parser info list --deprecated

  $ bitmark-parser info bit --bit=cloze

  $ bitmark-parser info -f json -p bit --bit=still-image-film
```

#### Ideal Output
```
Usage: bitmark-parser info [options] [info]

Display information about bitmark

Arguments:
  info                       information to return (choices: list|bit|all|deprecated; default: list)

Options:
  -f, --format <format>      output format (choices: text|json; default: text)
      --all                  output all bits including deprecated
      --bit <value>          bit to filter. If not specified, all bits will be returned
      --deprecated           output deprecated bits
  -a, --append               append to the output file (default: overwrite)
  -o, --output <file>        output file. If not specified, output will be to <stdout>
  -p, --pretty               prettify the JSON output with indent
      --indent <indent>      prettify indent (default: 2 when --pretty is set)
  -h, --help                 display help for command

Examples:
  $ bitmark-parser info

  $ bitmark-parser info --all

  $ bitmark-parser info list --deprecated

  $ bitmark-parser info bit --bit=cloze

  $ bitmark-parser info -f json -p bit --bit=still-image-film
```

**Implementation notes**:
- Maps `[INFO]` arg to `InfoType` enum (default 'list')
- Flags `--all` / `--deprecated` modify type selection
- Delegates to `BitmarkParserGenerator.info(options)`
- Output already returns string (text) or stringified JSON

