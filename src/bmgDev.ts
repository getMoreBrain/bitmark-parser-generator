/*

ISC License

Copyright ©2023 Get More Brain

*/

import fs from 'fs-extra';

import { BitmarkJson } from './ast/tools/BitmarkJson';
import { FileBitmapMarkupGenerator } from './ast/tools/FileBitmapMarkupGenerator';
import { testFiles } from './testFiles';

class Bmg {
  helloWorld(): void {
    console.log('Hello World\n\n');
  }

  async test(): Promise<void> {
    /* SUPPORTED FULLY */
    // const filename = testFiles.assign1; // OK
    const filename = testFiles.cloze; // OK
    // const filename = testFiles.cloze2; // OK
    // const filename = testFiles.cloze3; // OK
    // const filename = testFiles.cloze4; // OK
    // const filename = testFiles.cloze5; // OK
    // const filename = testFiles.cloze11; // OK
    // const filename = testFiles.cloze12; // OK
    // const filename = testFiles.clozeEmoji; // OK
    // const filename = testFiles.clozeEmoji2; // OK
    // const filename = testFiles.clozeig; // OK
    // const filename = testFiles.clozenmultx; // OK
    // const filename = testFiles.clozesg1; // OK
    // const filename = testFiles.multich_1; // OK
    // const filename = testFiles.multich_1_2; // OK
    // const filename = testFiles.multires_1; // OK
    // const filename = testFiles.multires_1_2; // OK
    // const filename = testFiles.multich1; // OK
    // const filename = testFiles.multich2; // OK
    // const filename = testFiles.multichtx1; // OK
    // const filename = testFiles.multichtx2; // OK
    // const filename = testFiles.multichtx3; // OK
    // const filename = testFiles.multires1; // OK
    // const filename = testFiles.multires2; // OK
    // const filename = testFiles.multitxt1; // OK
    // const filename = testFiles.multitxt3; // OK
    // const filename = testFiles.prepnote1; // OK
    // const filename = testFiles.seq1; // OK
    // const filename = testFiles.seq2; // OK
    // const filename = testFiles.truefalse2; // OK
    // const filename = testFiles.truefalse4; // OK
    // const filename = testFiles.corr1; // OK
    // const filename = testFiles.corr2; // OK
    // const filename = testFiles.corr3; // OK
    // const filename = testFiles.docup1; // OK
    // const filename = testFiles.essay1; // OK
    // const filename = testFiles.takepic1; // OK
    // const filename = testFiles.GMB_cloze_bitmarkMinueMinus; // OK
    // const filename = testFiles.GMB_cloze_emoticons; // OK
    // const filename = testFiles.GMB_essay; // OK
    // const filename = testFiles.GMB_bitmark_example; // OK

    /* ALMOST WORKING */
    // const filename = testFiles.cloze10; // ?? [.match]@example
    // const filename = testFiles.cloze13; // ?? [.match]@example
    // const filename = testFiles.truefalse1; // ?? Adds extra card (is this a problem?)

    /* NOT SUPPORTED */

    // const filename = './assets/example/article.json';
    // const filename = './assets/example/cloze-solution-grouped.json';

    /* NOTES */
    // - It is not easily possible to convert excess JSON properties to [@...] because it is hard to detect which
    //   properties are excess (depends on the bit). Not impossible, but problematic
    // - Sometimes 'reference' in the JSON comes from [►...] and sometimes from [@reference:...] (see essay7.json / bit-alias1.json)
    // - Cards '===' are not translated in4to JSON. Sometimes they exist, and sometimes not (see bot-action-true-false.json / multires-1.json)
    // - 'resource' vs 'excessResources[]'
    // - 'bitmark-grammer' project missing 'antlr4ts' dependency

    // const filename = testFiles.learningPath1; // ??
    // const filename = testFiles.learningPath3; // ??
    // const filename = testFiles.resourceAll; // ?? resources TODO
    // const filename = testFiles.utfgpun; // ?? resources TODO
    // const filename = testFiles.learningPath4; // ??
    // const filename = testFiles.learningPath5; // ??
    // const filename = testFiles.learningPath6; // ??
    // const filename = testFiles.learningPath7;
    // const filename = testFiles.book1; // ?? Has invalid text format 'text'? / properties / titles
    // const filename = testFiles.book2; // ??  properties / titles
    // const filename = testFiles.page1; // ??
    // const filename = testFiles.page2; // ??
    // const filename = testFiles.article1; // ?? &image excess resources
    // const filename = testFiles.article2; // ?? &image excess resources
    // const filename = testFiles.botinterview1; // ?? Has a gap with no solutions
    // const filename = testFiles.botinterview2; // ?? Card is not present in JSON / resources
    // const filename = testFiles.chat1; // ?? chat / initiator / partner / resources
    // const filename = testFiles.chat2; // ?? chat / initiator / partner / resources
    // const filename = testFiles.conversation1; // ?? chat / initiator / partner / resources
    // const filename = testFiles.essay2; // ?? resources TODO
    // const filename = testFiles.essay3; // ?? &image excess resources
    // const filename = testFiles.essay4; // ?? resources TODO
    // const filename = testFiles.essay5; // ?? &audio-link &video-link excess resources
    // const filename = testFiles.essay6; // ?? resources TODO
    // const filename = testFiles.essay7; // ?? resources TODO / @reference property
    // const filename = testFiles.essay8; // ?? resources TODO
    // const filename = testFiles.essay9; // ?? resources TODO
    // const filename = testFiles.flashcard1; // OK ?? or is JSON wrong
    // const filename = testFiles.flashcard2; // ?? &audio excess resources
    // const filename = testFiles.flashcard3; // ?? How @language property is handled
    // const filename = testFiles.flashcard4; // ?? How @lang @pos properties are handled
    // const filename = testFiles.flashcardSet; // ??
    // const filename = testFiles.interview1; // ?? Need to implement 'questions'
    // const filename = testFiles.interview2; // ?? Need to implement 'questions' / resources
    // const filename = testFiles.interview3; // ?? Need to implement 'questions' / resources
    // const filename = testFiles.interview4; // ?? Need to implement 'questions'
    // const filename = testFiles.interview100; // ?? Need to implement 'questions' / resources
    // const filename = testFiles.interview101; // ?? Need to implement 'questions' / resources
    // const filename = testFiles.interview102; // ?? Need to implement 'questions' / resources
    // const filename = testFiles.interview103; // ?? Need to implement 'questions'
    // const filename = testFiles.interview104; // ?? Need to implement 'questions'
    // const filename = testFiles.interview105; // ?? Need to implement 'questions'
    // const filename = testFiles.interview106; // ?? Need to implement 'questions' / resources
    // const filename = testFiles.interview107; // ?? Need to implement 'questions'
    // const filename = testFiles.interview108; // ?? Need to implement 'questions' / resources
    // const filename = testFiles.interview109; // ?? Need to implement 'questions'
    // const filename = testFiles.interview110; // ?? Need to implement 'questions'
    // const filename = testFiles.interviewImage1; // ?? Need to implement 'questions' / resources
    // const filename = testFiles.mark1; // Need to implement 'mark' / marks
    // const filename = testFiles.mark2; // Need to implement 'mark' / marks
    // const filename = testFiles.match1; // OK, except 'body' is generated in the JSON and it should not be
    // const filename = testFiles.match2; // Bitmark has errors
    // const filename = testFiles.match3; // JSON seems wrong
    // const filename = testFiles.match4; // Need to implement 'heading'
    // const filename = testFiles.match5; // Need to implement 'pairs' / 'heading' / resources, @example is attached to wrong pair in JSON
    // const filename = testFiles.matchsg1; // Need to implement 'heading' /  'body' is generated in the JSON and it should not be
    // const filename = testFiles.matchPict1; // Need to implement 'pairs'(keyImage) / 'heading'
    // const filename = testFiles.matchPict2; // Need to implement 'pairs'(keyImage) / 'heading'
    // const filename = testFiles.matchAudio1; // Need to implement 'pairs'(keyAudio) / 'heading'
    // const filename = testFiles.matchArticle1; // Need to implement 'pairs' / 'heading'
    // const filename = testFiles.matchMatrix1; // Need to implement 'matrix' / 'heading'
    // const filename = testFiles.matchMatrix3; // Need to implement 'matrix' / 'heading'
    // const filename = testFiles.multichtx4; // ?? resources TODO
    // const filename = testFiles.multitxt2; // item not in JSON, '@reference' property
    // const filename = testFiles.multitxt4; // ?? resources TODO
    // const filename = testFiles.rec1; // ??
    // const filename = testFiles.truefalse3; // ?? properties TODO
    // const filename = testFiles.truefalse5; // ?? resources TODO
    // const filename = testFiles.selfass1; // Need to implement 'bullet'
    // const filename = testFiles.selfass2;// Need to implement 'bullet' / 'points'
    // const filename = testFiles.rating1; // Need to implement 'bullet'
    // const filename = testFiles.survey1; // Need to implement 'bullet'
    // const filename = testFiles.surveyAnon1; // Need to implement 'bullet'
    // const filename = testFiles.highlighttext1; // Need to implement 'highlight' body bit
    // const filename = testFiles.highlighttext2; // Need to implement 'highlight' body bit
    // const filename = testFiles.bitAlias1; // Need to implement 'reference' / 'anchor'
    // const filename = testFiles.bitAlias2; // Need to implement 'reference' / 'anchor'
    // const filename = testFiles.sampleSoln; // Need to implement 'reference' / 'anchor'
    // const filename = testFiles.blocktags; // OK
    // const filename = testFiles.articleOnline; // ?? resources TODO
    // const filename = testFiles.appresource; // ?? resources TODO
    // const filename = testFiles.GMB_cloze; // ?? resources TODO
    // const filename = testFiles.GMB_cloze_attachment; // ?? resources TODO
    // const filename = testFiles.vocab1; // ?? lots
    // const filename = testFiles.vocab2; // ?? lots
    // const filename = testFiles.bookBits ;// ??  properties / titles
    // const filename = testFiles.code; // 'computerLangauge' property
    // const filename = testFiles.imageAudioVideo; // Lots of Resource bits
    // const filename = testFiles.botActionResponse; // Invalid empty text node
    // const filename = testFiles.botActionTrueFalse; // Responses have 'feedback' and card dividers and @reaction properties
    // const filename = testFiles.botActionRatingNumber; // Responses.response is a number, not a string
    // const filename = testFiles.vendorAmchart; // [.vendor-amcharts-5-chart] is unknown bit, for testing

    // Read in the test file
    const json = await fs.readJson(filename);

    // Convert the bitmark JSON to bitmark AST
    const bitmarkAst = BitmarkJson.toAst(json);

    // Generate markup code from AST
    const generator = new FileBitmapMarkupGenerator(
      './bitmark.txt',
      {
        flags: 'w',
      },
      {
        explicitTextFormat: false,
      },
    );

    generator.generate(bitmarkAst);
  }
}

const bmg = new Bmg();
bmg.helloWorld();

bmg.test().then(() => {
  console.log('END');
});

export { bmg };
export type { Bmg };
