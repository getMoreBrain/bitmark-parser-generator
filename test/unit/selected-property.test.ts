import { describe, expect, it } from 'vitest';

import { BitmarkParserGenerator } from '../../src/BitmarkParserGenerator.ts';

describe('selected property tests', () => {
  const bpg = new BitmarkParserGenerator();

  it('should handle selected property when parsing from JSON with selected=true', () => {
    const jsonInput = JSON.stringify([
      {
        bit: {
          type: 'image',
          format: 'bitmark++',
          bitLevel: 1,
          id: ['test-selected-true'],
          resource: {
            type: 'image',
            image: {
              format: 'png',
              provider: 'example.com',
              src: 'https://example.com/test-image.png',
              width: null,
              height: null,
              alt: '',
              zoomDisabled: false,
              license: '',
              copyright: '',
              showInIndex: false,
              caption: [],
              selected: true,
            },
          },
          body: [],
        },
      },
    ]);

    const result = bpg.convert(jsonInput, { outputFormat: 'json' }) as unknown[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resultBit = result[0] as any;
    expect(resultBit.bit.resource.image.selected).toBe(true);
  });

  it('should handle selected property when parsing from JSON with selected=false', () => {
    const jsonInput = JSON.stringify([
      {
        bit: {
          type: 'video',
          format: 'bitmark++',
          bitLevel: 1,
          id: ['test-selected-false'],
          resource: {
            type: 'video',
            video: {
              format: 'mp4',
              provider: 'example.com',
              src: 'https://example.com/test-video.mp4',
              width: null,
              height: null,
              license: '',
              copyright: '',
              showInIndex: false,
              caption: [],
              selected: false,
            },
          },
          body: [],
        },
      },
    ]);

    const result = bpg.convert(jsonInput, { outputFormat: 'json' }) as unknown[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resultBit = result[0] as any;
    expect(resultBit.bit.resource.video.selected).toBe(false);
  });

  it('should default selected to false when not specified', () => {
    const jsonInput = JSON.stringify([
      {
        bit: {
          type: 'audio',
          format: 'bitmark++',
          bitLevel: 1,
          id: ['test-selected-default'],
          resource: {
            type: 'audio',
            audio: {
              format: 'mp3',
              provider: 'example.com',
              src: 'https://example.com/test-audio.mp3',
              license: '',
              copyright: '',
              showInIndex: false,
              caption: [],
            },
          },
          body: [],
        },
      },
    ]);

    const result = bpg.convert(jsonInput, { outputFormat: 'json' }) as unknown[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resultBit = result[0] as any;
    expect(resultBit.bit.resource.audio.selected).toBe(false);
  });

  it('should preserve selected property when converting JSON to Bitmark and back to JSON', () => {
    const jsonInput = JSON.stringify([
      {
        bit: {
          type: 'image',
          format: 'bitmark++',
          bitLevel: 1,
          id: ['test-roundtrip'],
          resource: {
            type: 'image',
            image: {
              format: 'png',
              provider: 'example.com',
              src: 'https://example.com/test-image.png',
              width: null,
              height: null,
              alt: '',
              zoomDisabled: false,
              license: '',
              copyright: '',
              showInIndex: false,
              caption: [],
              selected: true,
            },
          },
          body: [],
        },
      },
    ]);

    // Convert JSON to Bitmark
    const bitmark = bpg.convert(jsonInput, { outputFormat: 'bitmark' }) as string;

    // Convert Bitmark back to JSON
    const result = bpg.convert(bitmark, { outputFormat: 'json' }) as unknown[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resultBit = result[0] as any;

    expect(resultBit.bit.resource.image.selected).toBe(true);
  });
});
