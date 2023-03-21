/*

ISC License

Copyright ©2023 Get More Brain

*/

import { BitmarkParser } from 'bitmark-grammar/src';
import fs from 'fs-extra';
import path from 'path';

const BASE = 'assets/test/books';
const BASE_DIR = path.resolve(__dirname, '..', BASE);
const BITS_DIR = path.resolve(BASE_DIR, 'bits');
const JSON_OUTPUT_DIR = path.resolve(BASE_DIR, 'json');

class BmgConvertToJson {
  async test(): Promise<void> {
    const files = fs.readdirSync(BITS_DIR, {
      withFileTypes: true,
    });

    let i = 0;
    for (const file of files) {
      if (file.isFile() && path.extname(file.name) === '.bit') {
        let id = 'unknown';

        try {
          const markupFile = path.resolve(BITS_DIR, file.name);
          id = path.basename(file.name);

          console.log(`Parsing file: ${markupFile}`);

          // Read in the test file
          let markup = fs.readFileSync(markupFile, 'utf8');

          markup = `[.interview&article]
[%B2b]
[@reference:Das sind die gefährlichsten Städte Deutschlands. DIE WELT online, 2.6.2014 (Manuel Bewarder/Martin Lutz)
In: https://www.welt.de/politik/]
[!Textarbeit und Wortschatz
Beantworten Sie die folgenden Fragen.]
[&article:
  **Die gefährlichsten Städte Deutschlands**

  Weltweit haben sich die Menschen in Berlin verliebt. Die Hauptstadt an der Spree gilt als cool und äußerst attraktiv – auch für Verbrecher. Der Stadtstaat Berlin führt nämlich die Kriminalitätsrangliste der Bundesländer an. Im Großstadtvergleich sind nur Frankfurt/Main und Köln unsicherer. Das geht aus der neuen Polizeilichen Kriminalstatistik
  (PKS) hervor.

  Die Kriminalität in Deutschland bleibt laut Statistik auf einem hohen Niveau. Vor allem Eigentumsdelikte wie Wohnungseinbrüche, Auto- und Taschendiebstähle nehmen deutlich zu.

  Vergleicht man die Bundesländer miteinander, schneiden die Stadtstaaten wie Berlin, Hamburg und Bremen schlecht ab. Das ist kein überraschendes Ergebnis, sondern vielmehr seit Jahren bestehende Kriminalitätsverteilung. In Städten lebt es sich gefährlicher als auf dem Land. Vergleicht man die Städte mit mehr als 200 000 Einwohnern miteinander, liegt Berlin auf Platz drei der Verbrecherhochburgen. Die gefährlichste Stadt ist wie schon in den Vorjahren Frankfurt mit 16 000 Verbrechen je 100 000 Einwohner. In München wurden im vorigen Jahr nur knapp 7 400 Straftaten gezählt, das ist weniger als die Hälfte.

  Besonders besorgniserregend ist der bundesweite Trend zu mehr Eigentumsdelikten. Diebstähle machen inzwischen einen Anteil von 40 Prozent an den Gesamtfällen aus. Deutlich angezogen haben Taschendiebstahl und Wohnungseinbruchsdiebstahl. Alarmierend ist dabei, dass es im letzten Jahr einerseits deutlich mehr Diebstähle als in den vergangenen 15 Jahren gab und dass andererseits die Aufklärungsquote ihren schlechtesten Wert seit Mitte der 1990er-Jahre erreichte. Mehr als 80 Prozent der Diebe bleiben unerkannt.

  Die Polizeistatistik beleuchtet aber nicht nur die Deliktfelder, sondern auch die Täter. Bemerkenswert ist dabei die Tatsache, dass die sogenannten „grauen Ganoven“ ein Problem geworden sind. Der demografische Wandel spiegelt sich auch in der Kriminalstatistik wider. Mit der alternden Gesellschaft wächst die Zahl der älteren Straftäter. Fachleute sprechen von „Ü-60-Gangstern“, also rüstigen Senioren, die über 60 Jahre alt sind. Die Altersgruppe stellt inzwischen 7,4 Prozent aller Tatverdächtigen, also gut 150 000 Personen. Davon waren fast 48 000 zwischen 70 und 80 Jahre alt.
]
===
[%1]Was hat Sie an den Ergebnissen der Kriminalstatistik überrascht? Was haben Sie erwartet?[@shortAnswer]
===
[%2]Welche Stadt gilt als die gefährlichste in Ihrem Heimatland? Recherchieren Sie im Internet.[@shortAnswer]
===
[%3]Welche Tendenzen gibt es in Ihrem Heimatland bezüglich der Delikte und Tätergruppen?[@shortAnswer]
===
`;

          // Preprocess and log
          console.log('\n');

          // Generate JSON from generated bitmark markup using the parser
          // const newJson = bitmarkGrammer.parse(markupFile);
          const parser = new BitmarkParser(markup, {
            trace: false,
            debug: false,
            need_error_report: false,
          });

          let newJson = [];
          try {
            const newJsonStr = parser.parse();
            newJson = JSON.parse(newJsonStr);
          } catch {
            throw new Error('Failed to parse bitmark-grammer output');
          }

          // Write the new JSON
          fs.ensureDirSync(JSON_OUTPUT_DIR);
          const fileNewJson = path.resolve(JSON_OUTPUT_DIR, `${id}.json`);
          fs.writeFileSync(fileNewJson, JSON.stringify(newJson, null, 2), {
            encoding: 'utf8',
          });

          i++;
          if (i > 0) break;
        } catch (e) {
          console.log(`Failed to convert: ${id}`);
        }
      }
    }
  }
}

const bmgConvertToJson = new BmgConvertToJson();

bmgConvertToJson.test().then(() => {
  // Done
});

export { bmgConvertToJson };
export type { BmgConvertToJson };
