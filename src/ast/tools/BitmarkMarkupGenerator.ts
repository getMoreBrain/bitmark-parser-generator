import { AstNodeType } from '../AstNodeType';
import { Ast, AstWalkCallbacks, NodeInfo } from '../Ast';
import { Bit, Bitmark, Choice, ItemLead, Response, SelectOption, Statement } from '../nodes/BitmarkNodes';
import { TextFormat } from '../types/TextFormat';

import { CodeWriter } from './writer/CodeWriter';
import { TextWriter } from './writer/TextWriter';

const DEFAULT_OPTIONS: BitmarkGeneratorOptions = {
  //
};

export interface BitmarkGeneratorOptions {
  explicitTextFormat?: boolean;
}

class BitmarkMarkupGenerator extends CodeWriter implements AstWalkCallbacks {
  private options: BitmarkGeneratorOptions;
  private printed = false;

  constructor(writer: TextWriter, options?: BitmarkGeneratorOptions) {
    super(writer);

    this.options = {
      ...DEFAULT_OPTIONS,
      ...options,
    };

    this.enter = this.enter.bind(this);
    this.between = this.between.bind(this);
    this.exit = this.exit.bind(this);
    this.leaf = this.leaf.bind(this);
  }

  public generate(bitmark: Bitmark): void {
    Ast.walk(bitmark, this);

    this.writeEndOfLine();
  }

  enter(node: NodeInfo, parent: NodeInfo | undefined, route: NodeInfo[]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gen = this as any;
    const funcName = `enter_${node.key}`;

    if (!this.printed) {
      this.printed = true;
    }

    if (typeof gen[funcName] === 'function') {
      gen[funcName](node, parent, route);
    }
  }

  between(node: NodeInfo, left: NodeInfo, right: NodeInfo, parent: NodeInfo | undefined, route: NodeInfo[]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gen = this as any;
    const funcName = `between_${node.key}`;

    if (typeof gen[funcName] === 'function') {
      gen[funcName](node, left, right, parent, route);
    }
  }

  exit(node: NodeInfo, parent: NodeInfo | undefined, route: NodeInfo[]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gen = this as any;
    const funcName = `exit_${node.key}`;

    if (typeof gen[funcName] === 'function') {
      gen[funcName](node, parent, route);
    }
  }

  leaf(node: NodeInfo, parent: NodeInfo | undefined, route: NodeInfo[]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gen = this as any;
    const funcName = `leaf_${node.key}`;

    if (typeof gen[funcName] === 'function') {
      gen[funcName](node, parent, route);
    }
  }

  //
  // NODE HANDLERS
  //

  //
  // Non-Terminal nodes (branches)
  //

  // bitmark

  // bitmark -> bits

  protected between_bits(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _parent: NodeInfo | undefined,
    _route: NodeInfo[],
  ): void {
    this.writeNL();
    this.writeNL();
    this.writeNL();
  }

  // bitmark -> bits -> bitValue

  protected enter_bitsValue(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const bit = node.value as Bit;

    this.writeOPD();
    this.writeString(bit.bitType);

    if (bit.textFormat) {
      const write = this.isWriteTextFormat(bit.textFormat);

      if (write) {
        this.writeColon();
        this.writeString(bit.textFormat);
      }
    }

    if (bit.resource?.type) {
      this.writeAmpersand();
      this.writeString(bit.resource?.type);
    }
    this.writeCL();
    this.writeNL();
  }

  protected between_bitsValue(
    _node: NodeInfo,
    left: NodeInfo,
    _right: NodeInfo,
    _parent: NodeInfo | undefined,
    _route: NodeInfo[],
  ): void {
    const noNl = left.key === AstNodeType.bitType || left.key === AstNodeType.textFormat;

    if (!noNl) {
      this.writeNL();
    }
  }

  // bitmark -> bits -> bitValue -> ids

  protected enter_ids(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    for (const id of node.value) {
      if (id) {
        this.writeOPA();
        this.writeString('id');
        this.writeColon();
        this.writeString(`${id}`);
        this.writeCL();
      }
    }
  }

  // bitmark -> bits -> bitValue -> ageRanges

  protected enter_ageRanges(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    for (const ageRange of node.value) {
      if (ageRange) {
        this.writeOPA();
        this.writeString('ageRange');
        this.writeColon();
        this.writeString(`${ageRange}`);
        this.writeCL();
      }
    }
  }

  // bitmark -> bits -> bitValue -> languages

  protected enter_languages(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    for (const lang of node.value) {
      if (lang) {
        this.writeOPA();
        this.writeString('language');
        this.writeColon();
        this.writeString(`${lang}`);
        this.writeCL();
      }
    }
  }

  // bitmark -> bits -> bitValue -> itemLead

  // bitmark -> bits -> bitValue -> body

  // bitmark -> bits -> bitValue -> body -> gap

  // bitmark -> bits -> bitValue -> body -> select

  // bitmark -> bits -> bitValue -> elements

  protected enter_elements(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeCardDivider();
    this.writeNL();
  }

  protected between_elements(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _parent: NodeInfo | undefined,
    _route: NodeInfo[],
  ): void {
    this.writeNL();
    this.writeElementDivider();
    this.writeNL();
  }

  protected exit_elements(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeNL();
    this.writeCardDivider();
  }

  // bitmark -> bits -> bitValue -> body -> gap -> solutions

  // bitmark -> bits -> bitValue -> body -> select

  // bitmark -> bits -> bitValue -> body -> select -> options

  // bitmark -> bits -> bitValue -> body -> select -> options -> optionsValue

  protected enter_optionsValue(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const optionsNode = node.value as SelectOption;
    if (optionsNode.isCorrect) {
      this.writeOPP();
    } else {
      this.writeOPM();
    }
    this.write(optionsNode.text);
    this.writeCL();
  }

  // bitmark -> bits -> bitValue -> statements

  protected enter_statements(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeCardDivider();
    this.writeNL();
  }

  protected between_statements(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _parent: NodeInfo | undefined,
    _route: NodeInfo[],
  ): void {
    this.writeNL();
    this.writeCardDivider();
    this.writeNL();
  }

  protected exit_statements(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeNL();
    this.writeCardDivider();
  }

  // bitmark -> bits -> bitValue -> statements -> statementsValue

  protected enter_statementsValue(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const statement = node.value as Statement;
    if (statement.isCorrect) {
      this.writeOPP();
    } else {
      this.writeOPM();
    }
    this.write(statement.text);
    this.writeCL();
  }

  // bitmark -> bits -> bitValue -> choices

  protected between_choices(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _parent: NodeInfo | undefined,
    _route: NodeInfo[],
  ): void {
    this.writeNL();
  }

  // bitmark -> bits -> bitValue -> choices -> choicesValue

  protected enter_choicesValue(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const choice = node.value as Choice;
    if (choice.isCorrect) {
      this.writeOPP();
    } else {
      this.writeOPM();
    }
    this.write(choice.text);
    this.writeCL();
  }

  // bitmark -> bits -> bitValue -> responses

  protected between_responses(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _parent: NodeInfo | undefined,
    _route: NodeInfo[],
  ): void {
    this.writeNL();
  }

  // bitmark -> bits -> bitValue -> responses -> responsesValue

  protected enter_responsesValue(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const response = node.value as Response;
    if (response.isCorrect) {
      this.writeOPP();
    } else {
      this.writeOPM();
    }
    this.write(response.text);
    this.writeCL();
  }

  // // quizzes

  // protected enter_quizzes(_node: Quizzes, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   this.writeCardDivider();
  //   this.writeNL();
  // }

  // protected between_quizzes(
  //   _node: Quizzes,
  //   _left: NodeInfo,
  //   _right: NodeInfo,
  //   _parent: NodeInfo | undefined,
  //   _route: NodeInfo[],
  // ): void {
  //   this.writeNL();
  //   this.writeCardDivider();
  //   this.writeNL();
  // }

  // protected exit_quizzes(_node: Quizzes, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   this.writeNL();
  //   this.writeCardDivider();
  // }

  // // quiz

  // protected enter_quiz(_node: Quiz, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   //
  // }

  // protected between_quiz(_node: Quiz, _left: NodeInfo, _right: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   this.writeNL();
  // }

  // protected exit_quiz(_node: Quiz, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   //
  // }

  // bitmark -> bits -> bitValue -> pairs

  protected enter_pairs(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeNL();
    this.writeCardDivider();
    this.writeNL();
  }

  protected between_pairs(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _parent: NodeInfo | undefined,
    _route: NodeInfo[],
  ): void {
    this.writeNL();
    this.writeCardDivider();
    this.writeNL();
  }

  protected exit_pairs(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeNL();
    this.writeCardDivider();
    this.writeNL();
  }

  // bitmark -> bits -> bitValue -> pairs -> pairsValue

  // bitmark -> bits -> bitValue -> pairs -> pairsValue -> values

  protected enter_values(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeNL();
    this.writePairKeyValueDivider();
    this.writeNL();
  }

  protected between_values(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _parent: NodeInfo | undefined,
    _route: NodeInfo[],
  ): void {
    this.writeNL();
    this.writeElementDivider();
    this.writeNL();
  }

  //
  // Terminal nodes (leaves)
  //

  // bitmark -> bits -> bitValue -> bitType

  // bitmark -> bits -> bitValue -> textFormat

  //  * -> itemLead --> item

  protected leaf_item(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value != null) {
      this.writeOPC();
      this.writeString(node.value);
      this.writeCL();
    }
  }

  //  * -> itemLead --> lead

  protected leaf_lead(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeOPC();
      this.writeString(node.value);
      this.writeCL();
    }
  }

  //  * -> hint

  protected leaf_hint(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeOPQ();
      this.writeString(node.value);
      this.writeCL();
    }
  }

  // bitmark -> bits -> bitValue ->  * -> instruction

  protected leaf_instruction(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeOPB();
      this.writeString(node.value);
      this.writeCL();
    }
  }

  // bitmark -> bits -> bitValue ->  * -> example

  protected leaf_example(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const example = node.value;

    if (example) {
      this.writeOPA();
      this.writeString('example');

      if (example !== true && example !== '') {
        this.writeColon();
        this.writeString(example as string);
      }

      this.writeCL();
    }
  }

  // bitmark -> bits -> body -> bodyText

  protected leaf_bodyText(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeString(node.value);
    }
  }

  // bitmark -> bits -> bitValue -> elements -> elementsValue

  protected leaf_elementsValue(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeString(node.value);
    }
  }

  // bitmark -> bits -> body -> solutions -> solution
  // ? -> solutions -> solution

  protected leaf_solutionsValue(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeOPU();
      this.writeString(node.value);
      this.writeCL();
    }
  }

  // bitmark -> bits -> body -> options -> prefix

  protected leaf_prefix(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeOPPRE();
      this.writeString(node.value);
      this.writeCL();
    }
  }

  // bitmark -> bits -> body -> options -> postfix

  protected leaf_postfix(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeOPPOST();
      this.writeString(node.value);
      this.writeCL();
    }
  }

  // bitmark -> bits -> bitValue ->  * -> isCaseSensitive

  // bitmark -> bits -> bitValue ->  * -> isLongAnswer

  // bitmark -> bits -> bitValue ->  * -> isCorrect

  // bitmark -> bits -> bitValue -> pairs -> pairsValue -> key

  protected leaf_key(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeString(node.value);
    }
  }

  // bitmark -> bits -> bitValue -> pairs -> pairsValue -> values -> valuesValue

  protected leaf_valuesValue(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeString(node.value);
    }
  }

  // // bitmark -> bits -> bitValue -> statements -> text

  // protected leaf_text(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   if (node.value) {
  //     this.writeString(node.value);
  //   }
  // }

  // // // propertyKey

  // // protected leaf_propertyKey(node: PropertyKey, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  // //   if (node.value) {
  // //     //
  // //   }
  // // }

  // // // propertyValue

  // // protected leaf_propertyValue(node: PropertyValue, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  // //   if (node.value) {
  // //     //
  // //   }
  // // }

  // // resource

  // protected leaf_resource(node: Resource, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   const resource = node.value;
  //   if (resource) {
  //     this.writeOPAMP();
  //     this.writeString(resource.type);
  //     this.writeColon();

  //     switch (resource.type) {
  //       case ResourceType.articleOnline: {
  //         const articleOnline = resource.articleOnline as ArticleOnlineResource;
  //         this.writeString(articleOnline.url);
  //         break;
  //       }
  //       case ResourceType.app:
  //         this.writeString(resource.app);
  //         break;
  //     }

  //     this.writeCL();
  //   }
  // }
  // END NODE HANDLERS

  //
  // WRITE FUNCTIONS
  //

  protected writeString(s?: string): void {
    if (s != null) this.write(`${s}`);
  }

  protected writeOPBUL(): void {
    this.write('[•');
  }

  protected writeOPESC(): void {
    this.write('[^');
  }

  protected writeOPRANGLE(): void {
    this.write('[►');
  }

  protected writeOPDANGLE(): void {
    this.write('[▼');
  }

  protected writeOPD(): void {
    this.write('[.');
  }

  protected writeOPU(): void {
    this.write('[_');
  }

  protected writeOPB(): void {
    this.write('[!');
  }

  protected writeOPQ(): void {
    this.write('[?');
  }

  protected writeOPA(): void {
    this.write('[@');
  }

  protected writeOPP(): void {
    this.write('[+');
  }

  protected writeOPM(): void {
    this.write('[-');
  }

  protected writeOPS(): void {
    this.write('[\\');
  }

  protected writeOPR(): void {
    this.write('[*');
  }

  protected writeOPC(): void {
    this.write('[%');
  }

  protected writeOPAMP(): void {
    this.write('[&');
  }

  protected writeOPPRE(): void {
    this.write("['");
  }

  protected writeOPPOST(): void {
    this.write('['); // TODO - not sure what symbol is for postfix
  }

  protected writeOP(): void {
    this.write('[');
  }

  protected writeCL(): void {
    this.write(']');
  }

  protected writeAmpersand(): void {
    this.write('&');
  }

  protected writeColon(): void {
    this.write(':');
  }

  // protected writeDoubleColon(): void {
  //   this.write('::');
  // }

  protected writeCardDivider(): void {
    this.write('===');
  }

  protected writeElementDivider(): void {
    this.write('--');
  }

  protected writePairKeyValueDivider(): void {
    this.write('==');
  }

  protected writeNL(): void {
    this.write('\n');
  }

  protected isWriteTextFormat(bitValue: string): boolean {
    const isMinusMinus = TextFormat.fromValue(bitValue) === TextFormat.bitmarkMinusMinus;
    const writeFormat = !isMinusMinus || this.options.explicitTextFormat;
    return !!writeFormat;
  }
}

export { BitmarkMarkupGenerator };
