# PLAN-000: Implementation Overview - Advanced Bitmark Tables

**Spec**: SPEC-table-advanced.md
**Status**: Planning Complete
**Created**: 2025-10-20

## Executive Summary

This document provides an overview of the implementation plan for advanced bitmark tables with qualified card dividers, semantic sections (thead, tbody, tfoot), and cell-level properties (rowspan, colspan, scope, cell type).

## Implementation Goals

1. **Full HTML Table Support**: Map bitmark tables 1:1 with HTML table capabilities
2. **Backwards Compatibility**: Existing table JSON must parse and generate correctly
3. **Generic Card Qualifiers**: Implement qualifiers as a reusable parser feature
4. **Semantic Clarity**: Use standard HTML table terminology and structure
5. **Cell-Level Control**: Support cell properties via tags

## Implementation Plans

### PLAN-001: Model Layer Updates
**Dependencies**: None
**Effort**: Low (1-2 days)
**Risk**: Low

Define new TypeScript interfaces for enhanced table JSON structure:
- `TableSectionJson` - Contains rows for a section
- `TableRowJson` - Contains cells for a row
- `TableCellJson` - Cell content with optional properties
- Update `TableJson` to support both old and new formats
- Add `qualifier` field to `CardData` AST node
- Create utility functions for format detection and conversion

**Key Files**:
- `src/model/json/BitJson.ts`
- `src/model/ast/Nodes.ts`
- `src/model/json/TableUtils.ts` (NEW)

**Testing**: Type guards, conversion utilities, validation

---

### PLAN-002: Grammar Layer Updates
**Dependencies**: None
**Effort**: Medium (2-3 days)
**Risk**: High (backwards compatibility critical)

Extend Peggy grammar to support qualified card dividers:
- Define `Qualifier` rule (alphanumeric, not reserved)
- Update V2 card dividers to accept optional qualifiers
- Update cell dividers (`--`, `++`) to accept qualifiers
- Ensure V1 dividers remain unchanged
- Protect reserved qualifiers (footer, text)
- Enforce strict whitespace requirements

**Key Files**:
- `assets/grammar/bitmark/bit-grammar.pegjs`
- `src/generated/parser/bitmark/bitmark-peggy-parser.js` (generated)

**Testing**: Grammar unit tests, backwards compatibility verification

**Critical**: All existing tests must pass without modification.

---

### PLAN-003: Parser Layer Updates
**Dependencies**: PLAN-001 (Model), PLAN-002 (Grammar)
**Effort**: High (4-5 days)
**Risk**: Medium

Update CardContentProcessor to parse qualified dividers and cell properties:
- Replace `parseTable()` with section-aware implementation
- Implement `parseTableWithSections()` - route rows to sections
- Implement `parseTableRow()` - extract cells from card
- Implement `parseTableCell()` - extract content and properties
- Implement `extractCellProperties()` - parse property tags
- Add bit-specific qualifier validation
- Update JSON parser to handle both formats

**Key Files**:
- `src/parser/bitmark/peg/contentProcessors/CardContentProcessor.ts`
- `src/parser/bitmark/peg/validators/QualifierValidator.ts` (NEW)
- `src/parser/json/JsonParser.ts`
- `src/config/raw/bits.ts`

**Testing**: Section parsing, cell properties, validation, format conversion

---

### PLAN-004: Generator Layer Updates
**Dependencies**: PLAN-001 (Model), PLAN-003 (Parser)
**Effort**: Medium (3-4 days)
**Risk**: Medium

Update generators to output new format with qualified dividers:
- Implement `generateTable()` - handle format conversion
- Implement `generateTableSection()` - output sections with qualifiers
- Implement `generateTableRow()` - output rows with cell dividers
- Implement `generateTableCell()` - output content with property tags
- Implement `buildCellPropertyTags()` - omit default values
- Update JSON generator to always output new format
- Handle old JSON input (convert to new)

**Key Files**:
- `src/generator/bitmark/BitmarkGenerator.ts`
- `src/generator/bitmark/BitmarkStringGenerator.ts`
- `src/generator/bitmark/BitmarkFileGenerator.ts`
- `src/generator/json/JsonGenerator.ts`

**Testing**: Qualified divider output, cell property tags, optimization, round-trip

---

### PLAN-005: Validation and Testing
**Dependencies**: PLAN-001, PLAN-002, PLAN-003, PLAN-004
**Effort**: High (5-6 days)
**Risk**: Low (testing reduces risk)

Comprehensive validation and test suite:
- Implement `TableValidator` for structure and property validation
- Create unit tests for all layers (model, parser, generator)
- Create integration tests for complex scenarios
- Create round-trip tests (bitmark↔JSON)
- Verify backwards compatibility with existing tests
- Create edge case tests
- Performance benchmarking
- Achieve >95% code coverage

**Key Files**:
- `src/parser/bitmark/peg/validators/TableValidator.ts` (NEW)
- `test/unit/model/table-utils.test.ts` (NEW)
- `test/unit/parser/table-advanced.test.ts` (NEW)
- `test/unit/generator/table-advanced.test.ts` (NEW)
- `test/standard/table-advanced/` (NEW directory)
- `test/standard/table-advanced-roundtrip.test.ts` (NEW)
- `test/standard/table-backwards-compat.test.ts` (NEW)
- `test/performance/table-advanced.perf.ts` (NEW)

**Testing**: All of the above

---

## Implementation Timeline

### Phase 1: Foundation (Week 1)
- Days 1-2: **PLAN-001** - Model Layer
- Days 3-5: **PLAN-002** - Grammar Layer
- **Checkpoint**: Grammar compiles, existing tests pass

### Phase 2: Core Implementation (Week 2)
- Days 1-5: **PLAN-003** - Parser Layer
- **Checkpoint**: New format parsing works, old format converts

### Phase 3: Output (Week 3)
- Days 1-4: **PLAN-004** - Generator Layer
- **Checkpoint**: Round-trip tests pass

### Phase 4: Quality Assurance (Week 4)
- Days 1-5: **PLAN-005** - Validation and Testing
- **Checkpoint**: All tests pass, coverage >95%

### Phase 5: Integration and Release (Week 5)
- Days 1-2: Integration testing
- Days 3-4: Documentation updates
- Day 5: Release preparation

**Total Estimated Time**: 5 weeks (25 working days)

## Risk Assessment

### High Risk
- **Grammar backwards compatibility**: Any grammar changes could break existing bits
  - **Mitigation**: Extensive regression testing, careful parse order
  - **Validation**: All existing tests must pass unchanged

### Medium Risk
- **Parser complexity**: Section-aware parsing adds complexity
  - **Mitigation**: Modular design, comprehensive unit tests
  - **Validation**: Test each function independently

- **Generator optimization**: Omitting defaults requires careful logic
  - **Mitigation**: Clear rules, unit tests for each case
  - **Validation**: Round-trip tests verify correctness

### Low Risk
- **Model changes**: Pure data structure changes
  - **Mitigation**: TypeScript compilation catches errors
  - **Validation**: Type guards and utilities tested

## Success Criteria

### Functional Requirements
- [ ] Parse qualified dividers (thead, tbody, tfoot)
- [ ] Parse cell properties (@tableRowSpan, @tableColSpan, @tableScope, @tableCellType)
- [ ] Generate qualified dividers
- [ ] Generate cell property tags
- [ ] Convert old format to new format
- [ ] Support both formats in JSON parser
- [ ] Default values omitted in output
- [ ] Round-trip fidelity maintained

### Non-Functional Requirements
- [ ] All existing table tests pass unchanged
- [ ] Test coverage >95%
- [ ] Performance: <1s for 1000-row table
- [ ] Browser bundle size increase <10KB
- [ ] No breaking changes to public API
- [ ] Clear error messages for validation failures

### Documentation
- [ ] API documentation updated
- [ ] Migration guide for old format
- [ ] Examples for all new features
- [ ] Test suite documentation

## Rollout Strategy

### Stage 1: Internal Testing
- Deploy to development environment
- Run full test suite
- Manual testing of complex examples

### Stage 2: Beta Release
- Release as beta version
- Gather feedback from early adopters
- Monitor for issues

### Stage 3: Full Release
- Update documentation
- Release as stable version
- Announce new features

## Backwards Compatibility

### Guaranteed Compatibility
- All existing bitmark table syntax continues to work
- All existing JSON table format continues to work
- No changes to bits that don't use tables
- No changes to non-table card bits

### Migration Path
- Old format automatically converted to new format
- No action required from users
- Optional: users can update to new format manually

### Deprecation
- Old format supported indefinitely (no removal planned)
- New format recommended for new content
- Documentation marks old format as "legacy"

## Future Enhancements

### Potential Extensions
1. **Caption support**: Dedicated `[@caption]` rendering
2. **Column groups**: `<colgroup>` support with qualifiers
3. **Cell alignment**: `@tableAlign` property
4. **Custom qualifiers**: Per-bit extensible qualifiers
5. **Accessibility**: ARIA attributes support

### Other Bits
Qualified dividers can be extended to other card-based bits:
- Article sections: `section`, `aside`, `nav`
- Interview variations: `role`, `context`
- Custom bit sections

## Monitoring and Metrics

### Performance Metrics
- Parse time for various table sizes
- Generate time for various table sizes
- Memory usage
- Bundle size impact

### Quality Metrics
- Test coverage percentage
- Number of warnings per parse
- Error rate in production
- User feedback score

## References

- **Specification**: `/specs/SPEC-table-advanced.md`
- **Architecture**: `/specs/ARCHITECTURE.md`
- **Plans**:
  - `/plans/PLAN-001-model-layer-table-advanced.md`
  - `/plans/PLAN-002-grammar-layer-table-advanced.md`
  - `/plans/PLAN-003-parser-layer-table-advanced.md`
  - `/plans/PLAN-004-generator-layer-table-advanced.md`
  - `/plans/PLAN-005-validation-testing-table-advanced.md`

## Approval

- [ ] Technical lead review
- [ ] Architecture review
- [ ] Security review
- [ ] Final approval

---

**Next Steps**: Begin implementation with PLAN-001 (Model Layer Updates)
