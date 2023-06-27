/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, test } from '@jest/globals';
// import deepEqual from 'deep-equal';
import * as fs from 'fs-extra';
import path from 'path';
import { performance } from 'perf_hooks';

import { JsonFileGenerator } from '../../../../src/generator/json/JsonFileGenerator';
import { BitmarkParser } from '../../../../src/parser/bitmark/BitmarkParser';
// import { JsonParser } from '../../../../src/parser/json/JsonParser';
import { FileUtils } from '../../../../src/utils/FileUtils';
import { isDebugPerformance, isTestAgainstAntlrParser } from '../../../standard/config/config-test';
import { JsonCleanupUtils } from '../../../utils/JsonCleanupUtils';
import { deepDiffMapper } from '../../../utils/deepDiffMapper';

// Passed: 5, 7-9, 11, 14-28, 30, 32-33, 35, 37-39, 42, 46, 49-60, 62, 79, 85-94, 97-98, 110
//         116, 119-125, 132, 136-137, 139-146, 149-150, 169, 175, 181, 184, 186, 188, 191, 197, 200-205
//         207, 210, 216-217, 225-226, 228, 239, 241, 244, 261, 263-264, 274, 279, 285
// Failed:
// - 0: akad_2_aufgabenset_1 (.interview missing last ===)
// - 1: akad_2_aufgabenset_2 (.book, invalid coverImage tag (empty value))
// - 2: akad_2_aufgabenset_3 (.interview missing last ===)
// - 3: akad_2_aufgabenset_4 (.interview ANTLR parser does not handle ✓ in sampleSolution)
// - 4: akad_2_aufgabenset_5 (.multiple-choice has body text in the cardset - ANTLR parser adds this to the body, new parser does not)
// - 6: akad_mehrwertsteuer_gruppenbesteuerung (.book, invalid coverImage tag (empty value))
// - 10: axa_effektive_software_architekturen_k1 (wrong format in resource, ANTLR parser fails on unicode characters)
// - 12: effektive_software_architekturen_axa_version (wrong format in resource, ANTLR parser fails on unicode characters)
// - 13: effektive_software_architekturen_axa_version_v2 (wrong format in resource, ANTLR parser fails on unicode characters)
// - 29: berufsbildner_qualicarte (bullet, ANTLR parser error?)
// - 31: berufsbildner_quiz_bewertungsgespraech (bullet, ANTLR parser error - bits end up with errors, but single bits parse ok??)
// - 34: das_methodenbuch_teil_1 (extra title level that is not supported in book, strange control character fails in ANTLR)
// - 36: das_methodenbuch_teil_3 (excess resource in article - how best to handle?)
// - 40: zentrale_aufnahmepruefung_2019_mathe (.interview incorrect body ANTLR parser)
// - 41: zentrale_aufnahmepruefung_2020_fr (.interview incorrectly terminated with ====)
// - 43: bookboon_big_data (Fails on comment at end of line containing https://www.gartner.com/it/page.jsp?id=2194315 - not sure if this should be considered a comment or not?!)
// - 44: bookboon_learning_developement_staying_relevant (Fails on comment at end of line containing https://www.gartner.com/it/page.jsp?id=2194315 - not sure if this should be considered a comment or not?!)
// - 45: bookboon_learning_development_21 (Fails on ∑ unicode character in the ANTLR parser)
// - 47: bumbacher_1a_quiz (Fails because bitmark format is missing -- or ++)
// - 48: bumbacher_1a_survey (Not sure if .survey bit is still supported and if so how. Generates JSON with bullets)
// - 61: bumbacher_vier_facetten (Not sure if .self-assesment is still supported. Parses to 'bullets' and strange body)
// - 63: adjektive_gegenteil (.flashcard-1 Parses as body only in ANTLR parser - format looks OLD)
// - 64: anatomie_einfuehrung (.flashcard-1 Parses as body only in ANTLR parser - format looks OLD)
// - 65: baustoffkunde (.flashcard-1 Parses as body only in ANTLR parser - format looks OLD)
// - 66: bautechnik (.flashcard-1 Parses as body only in ANTLR parser - format looks OLD)
// - 67: business_english_1 (.flashcard-1 Parses as body only in ANTLR parser - format looks OLD)
// - 68: e-trading (.flashcard-1 Parses as body only in ANTLR parser - format looks OLD)
// - 69: einfuehrung_in_die_politische_philosophie (.flashcard-1 Parses as body only in ANTLR parser - format looks OLD)
// - 70: hermes_51_foundation (.flashcard-1 Parses as body only in ANTLR parser - format looks OLD)
// - 71: knobelaufgaben (.flashcard-1 Parses as body only in ANTLR parser - format looks OLD)
// - 72: laender_und_hauptstaedte (.flashcard-1 Parses as body only in ANTLR parser - format looks OLD)
// - 73: psychiatrie_geschichte (.flashcard-1 Parses as body only in ANTLR parser - format looks OLD)
// - 74: psychology (.flashcard-1 Parses as body only in ANTLR parser - format looks OLD)
// - 75: sozialstrukturanalyse (.flashcard-1 Parses as body only in ANTLR parser - format looks OLD)
// - 76: uebungsaufgaben_wi_bba (.flashcard-1 Parses as body only in ANTLR parser - format looks OLD)
// - 77: fage_band8 ([!instruction] at end of body line - parsers differ, not sure what is correct thing to do / The [%items] are incorrectly interpreted by the ANTLR parser as being at the top level)
// - 78: gesundheitsförderung_und_krankheitsprävention_für_die_haut (double :: in the bit declaration confuses the ANTLR parser / [!instruction] in the middle of the body results in one extra \n in the ANTLR parser - not sure what is the desired behaviour )
// - 80: compendio_change_management (Excess resources in ANTLR parser, success in new parser - what is best behaviour?)
// - 81: compendio_repetitionsfragen.txt (ANTLR parser interprets the [?hint] as a footer, but PEG parser interprets it as a hint, Square brackets confuse the ANTLR parser / .interview ANTLR parser loses the \n's from the body)
// - 82: marketing (ANTLR parser fails to parse body)
// - 83: quizzes_marketing_unternehmensfuehrung (.match-solution-grouped issues)
// - 84: unternehmensfuehrung ([!instruction] at end of body line - parsers differ, not sure what is correct thing to do)
// - 95: dike_buch_information_als_snippets (Fails on unescaped square brackets '[Umgruppierung, Leichte Umformulierung:]' in ANTLR parser)
// - 96: dw_et_a1.txt (Chaining is incorrectly handled by the ANTLR parser / This dividers are incorrect. ANTLR parser throws errors, PEG parser parses as body)
// - 99: eb_zuerich_et_a1.txt (?)
// - 100: eb_zuerich_et_a2.txt (ANTLR parse error in the [!instruction] / Angled brackets confuse the ANTLR parser)
// - 101: unit1 (There are invisible spaces at the end of the match keys, and the ANTLR parser does not strip them)
// - 102: unit2 (?)
// - 103: electrosuisse_sl_content
// - 104: electrosuisse_sl_design
// - 105: n15
// - 106: schulungsunterlagen
// - 107: web_content
// - 108: englisch_helfen_adjektiv
// - 109: englisch_hilfen-phrasal
// - 111: englisch_hilfen_adjektiv
// - 112: englisch_hilfen_artikel
// - 113: englisch_hilfen_complex_tests
// - 114: englisch_hilfen_complex_tests_2
// - 115: englisch_hilfen_fragen
// - 117: englisch_hilfen_hilfsverben
// - 118: englisch_hilfen_if_saetze
// - 126: englisch_hilfen_satz
// - 127: englisch_hilfen_substantiv
// - 128: englisch_hilfen_verb
// - 129: englisch_hilfen_zeitformen
// - 130: klett_beispiel_sprachen.txt
// - 131: f1rst_die_unternehmensformel
// - 133: f1rst_hypnotic_mind
// - 134: f1rst_lehrgang
// - 138: f1rst_lehrgang_29
// - 147: f1rst_lehrgang_probleme
// - 148: f1rst_lehrgang_start
// - 151: get_abstract_der_fuerst.txt
// - 154: global_citizen_program
// - 155: gmb_bitmark_article.txt
// - 156: gmb_bitmark_artikel.txt
// - 157: gmb_digitalisierung_des_lernens.txt
// - 158: gmb_digitization_of_learning.txt
// - 159: gmb_manual
// - 160: gmb_quizzes
// - 161: gmb_quizzes_for_design
// - 162: gmb_quizzes_v2
// - 163: gmb_release_notes
// - 164: gmb_test_book_utf8
// - 165: gmb_theme_book
// - 166: haufe_future_learning_und_new_work
// - 167: hep_uebungen
// - 168: hgf_bewertung_probekochen
// - 170: hgf_bildungsbericht_probekochen
// - 171: hgf_pauli_band_2
// - 172: hgf_pauli_band_3
// - 173: hgf_praxisauftrag
// - 176: ict_darstellung_von_daten
// - 177: ict_darstellung_von_daten_2
// - 178: ict_rechnen_mit_daten
// - 179: ict_sichere_passwoerter
// - 180: ielts_preparation_1
// - 182: ielts_preparation_3
// - 183: ielts_preparation_4
// - 185: interkantonale_lehrmittelzentrale_lehrmittel_in_einer_digitalen_welt
// - 187: email_templates
// - 189: learningpool_experience
// - 190: personalised_learning
// - 192: st_gallen_leher.txt
// - 193: st_gallen_schueler.txt
// - 194: lernen_will_mehr_betriebswirtschaft
// - 195: medium_artwork_personalization
// - 196: medium_biennales_are_ending_final
// - 198: medium_cybersecurity_guide
// - 199: medium_literally_literary_suicide_final
// - 206: medium_toxic_positivity
// - 209: 1111_grundlagen_des_gueter_u_erbrechts
// - 211: 1203_steuern_und_kapitalanlagen
// - 212: 1218_modul_steuern_einstiegsfragebogen
// - 213: 2002_wohneigentumsförderung
// - 214: 4213_bvg_basics
// - 215: 6108_gueter_u_erbrecht_pruefungstraining
// - 218: 1_navigation
// - 219: 2_seiteninhalte
// - 220: 3_orientierung
// - 221: 4_kommunikation
// - 222: 5_wissenstest
// - 223: bedienungsanleitung
// - 224: didaktischer_hintergrund
// - 227: netzwoche_wie_ein_passwort_nicht_nur_stark_sondern_auch_sicher_ist
// - 229: open_university_beginers_german_places_and_people.txt
// - 230: open_university_beginners_german_food_and_drink.txt
// - 231: open_university_exploring_economics_secret_life_of_tshirts.txt
// - 232: open_university_introducing_the_environment.txt
// - 233: open_university_introducing_virgils_aeneid.txt
// - 234: open_university_the_civil_rights_movement.txt
// - 235: the_art_of_art_history_final
// - 236: beltz_klientenzentrierte
// - 237: beltz_paedagogik
// - 238: eeo
// - 240: haufe_arbeitszeitmodelle_der_zukunft
// - 242: psychologie_heute
// - 243: dreieckspyramide
// - 245: parabeln
// - 246: rav.txt
// - 247: rolang_exercises_book_2022
// - 248: rolang_learn_romanian_book.txt
// - 249: rolang_learn_romanian_exercisesbook.txt
// - 250: schubert_erkundungen_b2
// - 251: schubert_erkundungen_b2_sl_design
// - 252: schubert_online_a1_begegnungen.txt
// - 253: schubert_online_a2_spektrum
// - 254: schubert_online_ab_b2
// - 255: schubert_online_b1_begegnungen.txt
// - 256: schubert_online_b1_spektrum.txt
// - 257: schubert_online_b2
// - 258: schubert_scorm.txt
// - 259: seneca_moral_letters
// - 260: book
// - 262: free_e_book
// - 265: sofatutor_achsensymmetrische_figuren
// - 266: sofatutor_beschreibungen_anfertigen_ueberblick.txt
// - 267: sofatutor_funktionsweise_des_bunsenbrenners.txt
// - 268: sofatutor_pronunciation–word_stress (1)
// - 269: sofatutor_saeugetiere_anpassung_an_den_lebensraum.txt
// - 270: sofatutor_toene_und_klaenge_in_der_musik
// - 271: sofatutor_unregelmaeßige_verben
// - 272: homeoffice_modul_1
// - 274: mercado
// - 275: uk_rezepte_1
// - 276: uk_rezepte_3
// - 277: uk_rezepte_4
// - 278: arbeitssicherheit
// - 280: farblehre
// - 281: informatik
// - 282: mathe
// - 283: wiss_aufgabensammlung_1472
// - 284: wiss_aufgabensammlung_business_engineering

// const SINGLE_FILE_START = 0;
// const SINGLE_FILE_COUNT = 1;

const SINGLE_FILE_START = 0;
const SINGLE_FILE_COUNT = 1000;

const TEST_AGAINST_ANTLR_PARSER = isTestAgainstAntlrParser();
const DEBUG_PERFORMANCE = isDebugPerformance();

const TEST_INPUT_DIR = path.resolve(__dirname, '../../../../assets/test/books/bits');
const JSON_INPUT_DIR = path.resolve(__dirname, 'json');
const TEST_OUTPUT_DIR = path.resolve(__dirname, 'results/output');

// const jsonParser = new JsonParser();
const bitmarkParser = new BitmarkParser();

/**
 * Get the list of files in the TEST_INPUT_DIR (bitmark files)
 * @returns
 */
function getTestFilenames(): string[] {
  const files = FileUtils.getFilenamesSync(TEST_INPUT_DIR, {
    // match: new RegExp('.+.json'),
    recursive: true,
  });

  return files;
}

describe('bitmark-parser', () => {
  describe('Markup => JSON: Books', () => {
    // Ensure required folders
    fs.ensureDirSync(TEST_OUTPUT_DIR);

    let allTestFiles = getTestFilenames();

    if (Number.isInteger(SINGLE_FILE_START)) {
      allTestFiles = allTestFiles.slice(SINGLE_FILE_START, SINGLE_FILE_START + SINGLE_FILE_COUNT);
    }

    console.info(`Tests found: ${allTestFiles.length}`);

    // describe.each(allTestFiles)('Test file: %s', (testFile: string) => {
    //   test('JSON ==> Markup ==> JSON', async () => {

    allTestFiles.forEach((testFile: string) => {
      performance.clearMarks();
      performance.clearMeasures();

      const partFolderAndFile = testFile.replace(TEST_INPUT_DIR, '');
      const partFolder = path.dirname(partFolderAndFile);
      const fullFolder = path.join(TEST_OUTPUT_DIR, partFolder);
      const fullJsonInputFolder = path.join(JSON_INPUT_DIR, partFolder);
      const fileId = testFile.replace(TEST_INPUT_DIR + '/', '');
      const id = path.basename(partFolderAndFile, '.bit');

      // console.log('partFolderAndFile', partFolderAndFile);
      // console.log('partFolder', partFolder);
      // console.log('fullFolder', fullFolder);
      // console.log('id', id);

      test(`${id}`, async () => {
        fs.ensureDirSync(fullFolder);

        // Calculate the filenames
        const testJsonFile = path.resolve(fullJsonInputFolder, `${id}.json`);
        const originalMarkupFile = path.resolve(fullFolder, `${id}.bit`);
        const originalJsonFile = path.resolve(fullFolder, `${id}.json`);
        const generatedJsonFile = path.resolve(fullFolder, `${id}.gen.json`);
        const generatedAstFile = path.resolve(fullFolder, `${id}.ast.json`);
        const jsonDiffFile = path.resolve(fullFolder, `${id}.diff.json`);

        const jsonOptions = {
          textAsPlainText: true, // For testing the parser, use plain text rather than JSON for text
          prettify: true, // For testing the output is easier to read if it is prettified
          includeExtraProperties: true, // Include extra properties in the JSON when testing
        };

        // Copy the original test markup file to the output folder
        fs.copySync(testFile, originalMarkupFile);

        // Read in the test markup file
        const originalMarkup = fs.readFileSync(originalMarkupFile, 'utf8');

        let originalJson: unknown;

        if (TEST_AGAINST_ANTLR_PARSER) {
          // Generate JSON from generated bitmark markup using the ANTLR parser
          performance.mark('ANTLR:Start');
          originalJson = bitmarkParser.parseUsingAntlr(originalMarkup);

          // Write the new JSON
          fs.writeFileSync(originalJsonFile, JSON.stringify(originalJson, null, 2), {
            encoding: 'utf8',
          });

          performance.mark('ANTLR:End');
        } else {
          // TEST AGAINST JSON FILES

          // Copy the original expected JSON file to the output folder
          fs.copySync(testJsonFile, originalJsonFile);

          // Read in the test expected JSON file
          originalJson = fs.readJsonSync(originalJsonFile, 'utf8');
        }

        // Remove uninteresting JSON items
        JsonCleanupUtils.cleanupBitJson(originalJson, { removeParser: true, removeErrors: true });

        // // Write original bitmark (and JSON?)
        // writeTestJsonAndBitmark(originalJson, fullFolder, id);

        // Convert the Bitmark markup to bitmark AST
        performance.mark('PEG:Start');
        const bitmarkAst = bitmarkParser.toAst(originalMarkup);

        // Write the new AST
        fs.writeFileSync(generatedAstFile, JSON.stringify(bitmarkAst, null, 2), {
          encoding: 'utf8',
        });

        // Generate JSON from AST
        const generator = new JsonFileGenerator(generatedJsonFile, {
          jsonOptions,
        });

        await generator.generate(bitmarkAst);

        performance.mark('PEG:End');

        const newJson = fs.readJsonSync(generatedJsonFile, 'utf8');

        // Remove uninteresting JSON items
        JsonCleanupUtils.cleanupBitJson(originalJson, { removeMarkup: true });
        JsonCleanupUtils.cleanupBitJson(newJson, { removeMarkup: true, removeParser: true, removeErrors: true });

        // Compare old and new JSONs
        const diffMap = deepDiffMapper.map(originalJson, newJson, {
          ignoreUnchanged: true,
        });

        // Write the diff Map JSON
        fs.writeFileSync(jsonDiffFile, JSON.stringify(diffMap, null, 2), {
          encoding: 'utf8',
        });

        // Print performance information
        if (DEBUG_PERFORMANCE) {
          const pegTimeSecs = Math.round(performance.measure('PEG', 'PEG:Start', 'PEG:End').duration) / 1000;
          if (TEST_AGAINST_ANTLR_PARSER) {
            const antlrTimeSecs = Math.round(performance.measure('ANTLR', 'ANTLR:Start', 'ANTLR:End').duration) / 1000;
            const speedUp = Math.round((antlrTimeSecs / pegTimeSecs) * 100) / 100;
            console.log(`'${fileId}' timing; ANTLR: ${antlrTimeSecs} s, PEG: ${pegTimeSecs} s, speedup: x${speedUp}`);
          } else {
            console.log(`'${fileId}' timing; PEG: ${pegTimeSecs} s`);
          }
        }

        expect(newJson).toEqual(originalJson);

        // If we get to here, we can delete the diff file as there were no important differences
        fs.removeSync(jsonDiffFile);

        // const equal = deepEqual(newJson, json, { strict: true });
        // expect(equal).toEqual(true);
      });
    });
  });
});
