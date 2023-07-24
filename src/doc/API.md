[@gmb/bitmark-parser-generator](../README.md)
================

A bitmark generator.

## API

### Simplified API
- [`BitmarkParserGenerator.convert(input, options)`](./classes/BitmarkParserGenerator.md)
- [`BitmarkParserGenerator.upgrade(input, options)`](./classes/BitmarkParserGenerator.md)
- [`BitmarkParserGenerator.createAst(input)`](./classes/BitmarkParserGenerator.md)

### AST builder
- [`Builder`](./classes/Builder.md)
- [`ResourceBuilder`](./classes/ResourceBuilder.md)

### Convert Bitmark markup or JSON to AST
- [`JsonParser.toAst(input)`](./classes/JsonParser.md)
- [`BitmarkParser.toAst(input)`](./classes/BitmarkParser.md)

### Generate JSON from AST
- [`JsonGenerator.generate(ast)`](./classes/JsonGenerator.md)
- [`JsonStringGenerator.generate(ast)`](./classes/JsonStringGenerator.md)

### Generate Bitmark markup from AST
- [`BitmarkGenerator.generate(ast)`](./classes/BitmarkGenerator.md)
- [`BitmarkStringGenerator.generate(ast)`](./classes/BitmarkStringGenerator.md)

### Writers which can be extended to write to new targets
- [`Writer`](./classes/Writer.md)
- [`StringWriter`](./classes/StringWriter.md)

### Ast
- [`Ast`](./classes/Ast.md)

## License

This open source software is licenced under the [ISC licence](https://opensource.org/license/isc-license-txt).
