import { TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';

import { Article } from '../../json/article';
import { bitmarkUtils } from '../../../utils/bitmarkUtils';

Generator.generateFromModel({ outputFile: './output.txt' }, (writer: TextWriter, model: unknown) => {
  console.log('generateFromModel');

  const bitWrappers = bitmarkUtils.preprocessJson(model);

  for (const bitWrapper of bitWrappers) {
    const { bit, bitmark } = bitWrapper;

    writer.writeLine(`${bitmark ?? ''}`);
    writer.writeLine();

    const { type, body, format, id } = bit;

    // Type
    writer.writeLine(`[.${type}]`);

    // Id
    if (id) {
      const writeId = (id: string | number): void => {
        writer.writeLine(`[@id:${id}]`);
      };
      if (Array.isArray(id)) {
        for (const i of id) {
          writeId(i);
        }
      } else {
        writeId(id);
      }
    }

    // Body
    if (body) {
      writer.writeLine(`${body}`);
    }
  }

  // // List GET paths
  // writer.writeLine();
  // writer.writeLine('Paths:');
  // for (const path in model.paths) {
  //   const value = model.paths[path];
  //   if ('get' in value) {
  //     const get = value['get'];
  //     writer.writeLineIndented(`GET '${path}' (${get.produces})`);
  //     writer.writeLineIndented(get.description);
  //   }
  // }
  // // List definitions
  // writer.writeLine();
  // writer.writeLine('Definitions:');
  // for (const definition in model.definitions) {
  //   const value = model.definitions[definition];
  //   writer.writeLineIndented(`${definition} (${value.type})`);
  //   if ('properties' in value) {
  //     const properties = value['properties'];
  //     for (const prop in properties) {
  //       writer.writeLineIndented(`- ${prop} (${properties[prop].type})`);
  //     }
  //   }
  // }
});
