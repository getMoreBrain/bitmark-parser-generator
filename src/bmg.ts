/*

ISC License

Copyright ©2023 Get More Brain

*/

import fs from 'fs-extra';

import { BitmarkJson } from './ast/tools/BitmarkJson';
import { StreamBitmapMarkupGenerator } from './ast/tools/StreamBitmapMarkupGenerator';
import { testFiles } from './testFiles';

class Bmg {
  helloWorld(): void {
    console.log('Hello World\n\n');
  }

  async test(): Promise<void> {
    // const filename = './assets/example/article.json';
    // const filename = './assets/example/cloze-solution-grouped.json';

    // const filename = testFiles.learningPath1;
    // const filename = testFiles.learningPath3;
    // const filename = testFiles.resourceAll; // ?? resources TODO
    // const filename = testFiles.utfgpun;
    // const filename = testFiles.learningPath4;
    // const filename = testFiles.learningPath5;
    // const filename = testFiles.learningPath6;
    // const filename = testFiles.learningPath7;
    // const filename = testFiles.book1;
    // const filename = testFiles.book2;
    // const filename = testFiles.page1;
    // const filename = testFiles.page2;
    // const filename = testFiles.article1; // ?? &image excess resources
    // const filename = testFiles.article2; // ?? &image excess resources
    // const filename = testFiles.assign1; // COMPLETED
    // const filename = testFiles.botinterview1;
    // const filename = testFiles.botinterview2;
    // const filename = testFiles.chat1;
    // const filename = testFiles.chat2;
    // const filename = testFiles.conversation1;
    // const filename = testFiles.cloze; // COMPLETED
    // const filename = testFiles.cloze2; // COMPLETED
    // const filename = testFiles.cloze3; // COMPLETED
    // const filename = testFiles.cloze4; // COMPLETED
    // const filename = testFiles.cloze5; // COMPLETED
    // const filename = testFiles.cloze10; // ?? @example
    // const filename = testFiles.cloze11; // COMPLETED
    // const filename = testFiles.cloze12; // COMPLETED
    // const filename = testFiles.cloze13; // ?? @example
    // const filename = testFiles.clozeEmoji; // COMPLETED
    // const filename = testFiles.clozeEmoji2; // COMPLETED
    // const filename = testFiles.clozeig; // COMPLETED
    // const filename = testFiles.clozenmultx;
    // const filename = testFiles.clozesg1;
    // const filename = testFiles.corr1;
    // const filename = testFiles.corr2;
    // const filename = testFiles.corr3;
    // const filename = testFiles.docup1;
    // const filename = testFiles.essay1;
    // const filename = testFiles.essay2;
    // const filename = testFiles.essay3;
    // const filename = testFiles.essay4;
    // const filename = testFiles.essay5;
    // const filename = testFiles.essay6;
    // const filename = testFiles.essay7;
    // const filename = testFiles.essay8;
    // const filename = testFiles.essay9;
    // const filename = testFiles.flashcard1;
    // const filename = testFiles.flashcard2;
    // const filename = testFiles.flashcard3;
    // const filename = testFiles.flashcard4;
    // const filename = testFiles.flashcardSet;
    // const filename = testFiles.interview1;
    // const filename = testFiles.interview2;
    // const filename = testFiles.interview3;
    // const filename = testFiles.interview4;
    // const filename = testFiles.interview100;
    // const filename = testFiles.interview101;
    // const filename = testFiles.interview102;
    // const filename = testFiles.interview103;
    // const filename = testFiles.interview104;
    // const filename = testFiles.interview105;
    // const filename = testFiles.interview106;
    // const filename = testFiles.interview107;
    // const filename = testFiles.interview108;
    // const filename = testFiles.interview109;
    // const filename = testFiles.interview110;
    // const filename = testFiles.interviewImage1;
    // const filename = testFiles.mark1;
    // const filename = testFiles.mark2;
    // const filename = testFiles.match1;
    // const filename = testFiles.match2;
    // const filename = testFiles.match3;
    // const filename = testFiles.match4;
    // const filename = testFiles.match5;
    // const filename = testFiles.matchsg1;
    // const filename = testFiles.matchPict1;
    // const filename = testFiles.matchPict2;
    // const filename = testFiles.matchAudio1;
    // const filename = testFiles.matchArticle1;
    // const filename = testFiles.matchMatrix1;
    // const filename = testFiles.matchMatrix3;
    // const filename = testFiles.multich_1; // COMPLETED
    // const filename = testFiles.multich_1_2; // COMPLETED
    // const filename = testFiles.multires_1; // COMPLETED
    // const filename = testFiles.multires_1_2; // COMPLETED
    // const filename = testFiles.multich1; // COMPLETED
    // const filename = testFiles.multich2; // COMPLETED
    const filename = testFiles.multichtx1;
    // const filename = testFiles.multichtx2;
    // const filename = testFiles.multichtx3;
    // const filename = testFiles.multichtx4;
    // const filename = testFiles.multires1;
    // const filename = testFiles.multires2;
    // const filename = testFiles.multitxt1;
    // const filename = testFiles.multitxt2;
    // const filename = testFiles.multitxt3;
    // const filename = testFiles.multitxt4;
    // const filename = testFiles.prepnote1;
    // const filename = testFiles.rec1;
    // const filename = testFiles.seq1;
    // const filename = testFiles.seq2;
    // const filename = testFiles.takepic1;
    // const filename = testFiles.truefalse1;
    // const filename = testFiles.truefalse2;
    // const filename = testFiles.truefalse3;
    // const filename = testFiles.truefalse4;
    // const filename = testFiles.truefalse5;
    // const filename = testFiles.selfass1;
    // const filename = testFiles.selfass2;
    // const filename = testFiles.rating1;
    // const filename = testFiles.survey1;
    // const filename = testFiles.surveyAnon1;
    // const filename = testFiles.highlighttext1;
    // const filename = testFiles.highlighttext2;
    // const filename = testFiles.bitAlias1;
    // const filename = testFiles.sampleSoln;
    // const filename = testFiles.bitAlias2;
    // const filename = testFiles.blocktags;
    // const filename = testFiles.articleOnline;
    // const filename = testFiles.appresource;
    // const filename = testFiles.GMB_cloze;
    // const filename = testFiles.GMB_cloze_attachment;
    // const filename = testFiles.GMB_cloze_bitmarkMinueMinus;
    // const filename = testFiles.GMB_cloze_emoticons;
    // const filename = testFiles.GMB_essay;
    // const filename = testFiles.GMB_bitmark_example;
    // const filename = testFiles.vocab1;
    // const filename = testFiles.vocab2;
    // const filename = testFiles.bookBits;
    // const filename = testFiles.code;
    // const filename = testFiles.imageAudioVideo;
    // const filename = testFiles.botActionResponse;
    // const filename = testFiles.botActionTrueFalse;
    // const filename = testFiles.botActionRatingNumber;
    // const filename = testFiles.vendorAmchart;
    const json = await fs.readJson(filename);

    // Convert the bitmark JSON to bitmark AST
    const bitmarkAst = BitmarkJson.toAst(json);

    // Generate markup code from AST
    const generator = new StreamBitmapMarkupGenerator(
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
