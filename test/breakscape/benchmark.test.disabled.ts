/**
 * Benchmark test comparing the two Breakscape implementations:
 * - breakscape.ts (character-by-character implementation)
 * - breakscape-regex.ts (regex-based implementation)
 */

import { describe, expect, it } from 'vitest';

import { Breakscape as BreakscapeChar } from '../../src/breakscaping/BreakscapeLoop.ts';
import { Breakscape as BreakscapeRegex } from '../../src/breakscaping/BreakscapeRegex.ts';
import { BodyTextFormat } from '../../src/model/enum/BodyTextFormat.ts';
import { TextLocation } from '../../src/model/enum/TextLocation.ts';

// Test data sets for benchmarking
const TEST_DATA = {
  simple: '^',
  medium: 'This is about an [.article] with **bold** text and some _italic_ content.',
  complex: ':5__5:32]**fg^[.article]e!!--``test]^',
  longText: (
    'This is a much longer text with various bitmark elements that need breakscaping. ' +
    'It contains [.article] tags, **bold** text, _italic_ text, and various other ' +
    'special characters like ^ that need to be handled properly. We also have ' +
    'some ### headers and | code blocks that should be processed correctly. ' +
    '•12 This is a numbered list item •a This is a lettered list item ' +
    '[@ This is an instruction tag] [# This is a hash tag] ' +
    'The text continues with more content to test performance on longer strings.'
  ).repeat(10),
  arraySmall: ['^', '**bold**', '_italic_', '[.article]'],
  arrayLarge: Array(1000).fill(
    'This is about an [.article] with **bold** text and some _italic_ content.',
  ),
  specialChars: '^^^^***```___!!!===```^^^',
};

// Benchmark options to test
const BENCHMARK_OPTIONS = [
  { format: BodyTextFormat.bitmarkPlusPlus, location: TextLocation.body },
  { format: BodyTextFormat.bitmarkPlusPlus, location: TextLocation.tag },
  { format: BodyTextFormat.plainText, location: TextLocation.body },
  { format: BodyTextFormat.plainText, location: TextLocation.tag },
];

// Performance measurement utility
function measurePerformance<T>(
  name: string,
  fn: () => T,
  iterations: number = 1000,
): { result: T; avgTime: number; totalTime: number } {
  const start = globalThis.performance?.now() ?? Date.now();
  let result: T;

  for (let i = 0; i < iterations; i++) {
    result = fn();
  }

  const end = globalThis.performance?.now() ?? Date.now();
  const totalTime = end - start;
  const avgTime = totalTime / iterations;

  globalThis.console?.log(
    `${name}: ${avgTime.toFixed(4)}ms avg (${totalTime.toFixed(2)}ms total, ${iterations} iterations)`,
  );

  return { result: result!, avgTime, totalTime };
}

describe('Breakscape Performance Benchmark', () => {
  const charImpl = new BreakscapeChar();
  const regexImpl = new BreakscapeRegex();

  describe('Correctness Verification', () => {
    // First verify both implementations produce the same results
    BENCHMARK_OPTIONS.forEach((options) => {
      describe(`Format: ${options.format}, Location: ${options.location}`, () => {
        Object.entries(TEST_DATA).forEach(([testName, testData]) => {
          it(`should produce identical results for ${testName}`, () => {
            let charResult: string | string[];
            let regexResult: string | string[];

            if (Array.isArray(testData)) {
              charResult = charImpl.breakscape(testData, options);
              regexResult = regexImpl.breakscape(testData, options);
            } else {
              charResult = charImpl.breakscape(testData, options);
              regexResult = regexImpl.breakscape(testData, options);
            }

            expect(charResult).toEqual(regexResult);

            // Test unbreakscape too
            let charUnbreakscape: string | string[];
            let regexUnbreakscape: string | string[];

            if (Array.isArray(charResult)) {
              charUnbreakscape = charImpl.unbreakscape(charResult, options);
              regexUnbreakscape = regexImpl.unbreakscape(regexResult as string[], options);
            } else {
              charUnbreakscape = charImpl.unbreakscape(charResult, options);
              regexUnbreakscape = regexImpl.unbreakscape(regexResult as string, options);
            }

            expect(charUnbreakscape).toEqual(regexUnbreakscape);
          });
        });
      });
    });
  });

  describe('Performance Comparison', () => {
    const ITERATIONS = {
      simple: 10000,
      medium: 5000,
      complex: 5000,
      longText: 1000,
      arraySmall: 5000,
      arrayLarge: 100,
      specialChars: 10000,
    };

    BENCHMARK_OPTIONS.forEach((options) => {
      describe(`Format: ${options.format}, Location: ${options.location}`, () => {
        describe('breakscape() performance', () => {
          Object.entries(TEST_DATA).forEach(([testName, testData]) => {
            it(`should benchmark ${testName} breakscape`, () => {
              const iterations = ITERATIONS[testName as keyof typeof ITERATIONS];

              globalThis.console?.log(
                `\\n--- Benchmarking ${testName} breakscape (${iterations} iterations) ---`,
              );

              const charResult = measurePerformance(
                'Character Implementation',
                () => {
                  if (Array.isArray(testData)) {
                    return charImpl.breakscape(testData, options);
                  } else {
                    return charImpl.breakscape(testData, options);
                  }
                },
                iterations,
              );

              const regexResult = measurePerformance(
                'Regex Implementation     ',
                () => {
                  if (Array.isArray(testData)) {
                    return regexImpl.breakscape(testData, options);
                  } else {
                    return regexImpl.breakscape(testData, options);
                  }
                },
                iterations,
              );

              // Verify results are identical
              expect(charResult.result).toEqual(regexResult.result);

              // Log performance comparison
              const ratio = regexResult.avgTime / charResult.avgTime;
              globalThis.console?.log(
                `Regex is ${ratio.toFixed(2)}x ${ratio > 1 ? 'slower' : 'faster'} than character implementation`,
              );
            });
          });
        });

        describe('unbreakscape() performance', () => {
          Object.entries(TEST_DATA).forEach(([testName, testData]) => {
            it(`should benchmark ${testName} unbreakscape`, () => {
              const iterations = ITERATIONS[testName as keyof typeof ITERATIONS];

              // First breakscape the data
              let breakscapedData: string | string[];
              if (Array.isArray(testData)) {
                breakscapedData = charImpl.breakscape(testData, options);
              } else {
                breakscapedData = charImpl.breakscape(testData, options);
              }

              globalThis.console?.log(
                `\\n--- Benchmarking ${testName} unbreakscape (${iterations} iterations) ---`,
              );

              const charResult = measurePerformance(
                'Character Implementation',
                () => {
                  if (Array.isArray(breakscapedData)) {
                    return charImpl.unbreakscape(breakscapedData, options);
                  } else {
                    return charImpl.unbreakscape(breakscapedData, options);
                  }
                },
                iterations,
              );

              const regexResult = measurePerformance(
                'Regex Implementation     ',
                () => {
                  if (Array.isArray(breakscapedData)) {
                    return regexImpl.unbreakscape(breakscapedData, options);
                  } else {
                    return regexImpl.unbreakscape(breakscapedData, options);
                  }
                },
                iterations,
              );

              // Verify results are identical
              expect(charResult.result).toEqual(regexResult.result);

              // Log performance comparison
              const ratio = regexResult.avgTime / charResult.avgTime;
              globalThis.console?.log(
                `Regex is ${ratio.toFixed(2)}x ${ratio > 1 ? 'slower' : 'faster'} than character implementation`,
              );
            });
          });
        });
      });
    });
  });

  describe('Edge Cases Performance', () => {
    const edgeCases = {
      empty: '',
      singleChar: '^',
      noSpecialChars: 'Just normal text without any special characters',
      allSpecialChars: '^^^^^*****`````_____!!!!!=====[[[[[]]]]]*^*^*^*^',
      mixedContent: 'Normal text with [.some] **special** chars ^ and more text',
    };

    Object.entries(edgeCases).forEach(([caseName, testData]) => {
      it(`should handle ${caseName} case efficiently`, () => {
        globalThis.console?.log(`\\n--- Edge case: ${caseName} ---`);

        const charResult = measurePerformance(
          'Character Implementation',
          () =>
            charImpl.breakscape(testData, {
              format: BodyTextFormat.bitmarkPlusPlus,
              location: TextLocation.body,
            }),
          5000,
        );

        const regexResult = measurePerformance(
          'Regex Implementation     ',
          () =>
            regexImpl.breakscape(testData, {
              format: BodyTextFormat.bitmarkPlusPlus,
              location: TextLocation.body,
            }),
          5000,
        );

        expect(charResult.result).toEqual(regexResult.result);
      });
    });
  });
});
