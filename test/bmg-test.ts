/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, test } from '@jest/globals';

import { Bmg } from '../src/bmg';

const bmgTests = (bmg: Bmg) => {
  describe('bmg', () => {
    describe('initialisation', () => {
      // // test1Checks
      // const test1Checks = (Enum: any) => {
      //   // Expected cases
      //   expect(Enum.thing).toBe('thing');
      //   expect(Enum.other).toBe('other');
      //   expect(Enum.something).toBe('somethingOther');
      //   expect(Enum[99]).toBe(1);
      //   expect(Enum.fromValue).toBeDefined();
      //   expect(Enum.fromKey).toBeDefined();
      //   expect(Enum.keyFromValue).toBeDefined();
      //   expect(Enum.setMetadata).toBeDefined();
      //   expect(Enum.getMetadata).toBeDefined();
      //   expect(Enum.values).toBeDefined();
      //   expect(Enum.keys).toBeDefined();
      //   expect(Enum.entries).toBeDefined();
      //   expect(Enum[Symbol.iterator]).toBeDefined();

      //   // Error cases
      //   expect(Enum[98]).toBe(undefined);
      //   expect(Enum['somethingOther']).toBe(undefined);
      // };

      test('hello world', async () => {
        bmg.helloWorld();
      });
    });
  });
};

export { bmgTests };
