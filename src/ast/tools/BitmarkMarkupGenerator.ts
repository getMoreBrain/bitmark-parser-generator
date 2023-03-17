import { AstNodeType } from '../AstNodeType';
import { Ast, AstWalkCallbacks, NodeInfo } from '../Ast';
import { TextFormat } from '../types/TextFormat';
import { ArticleOnlineResource } from '../types/resources/ArticleOnlineResource';
import { ResourceType } from '../types/resources/ResouceType';

import { CodeWriter } from './writer/CodeWriter';
import { TextWriter } from './writer/TextWriter';

import {
  Bit,
  Bitmark,
  Body,
  BodyText,
  Choice,
  Example,
  Gap,
  Hint,
  Instruction,
  IsCaseSensitive,
  IsCorrect,
  Item,
  ItemLead,
  Lead,
  Node,
  Pair,
  PairKey,
  PairValue,
  Postfix,
  Prefix,
  Quiz,
  Response,
  Select,
  SelectOption,
  Solution,
  Statement,
} from '../nodes/BitmarkNodes';

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

  protected enter_bitmark(_node: NodeInfo, _parent: Node | undefined, _route: NodeInfo[]): void {
    //
  }

  protected between_bitmark(
    _node: NodeInfo,
    _left: Node,
    _right: Node,
    _parent: Node | undefined,
    _route: NodeInfo[],
  ): void {
    this.writeNL();
    this.writeNL();
    this.writeNL();
  }

  protected exit_bitmark(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    //
  }

  // bitmark -> bit

  protected enter_bitsValue(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const bit = node.value as Bit;

    this.writeOPD();
    this.writeString(bit.type);

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

  protected between_bitmark_bits_(
    _node: NodeInfo,
    left: NodeInfo,
    _right: NodeInfo,
    _parent: NodeInfo | undefined,
    _route: NodeInfo[],
  ): void {
    const noNl =
      left.key === AstNodeType.bitType ||
      left.key === AstNodeType.textFormat ||
      left.key === AstNodeType.attachmentType;

    if (!noNl) {
      this.writeNL();
    }
  }

  protected exit_bitsValue(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    //
  }

  // // properties

  // protected enter_properties(_node: Properties, _parent: Node | undefined, _route: NodeInfo[]): void {
  //   //
  // }

  // protected between_properties(
  //   _node: Properties,
  //   _left: Node,
  //   _right: Node,
  //   _parent: Node | undefined,
  //   _route: NodeInfo[],
  // ): void {
  //   //
  // }

  // protected exit_properties(_node: PropertyValues, _parent: Node | undefined, _route: NodeInfo[]): void {
  //   //
  // }

  // // propertyValues

  // protected enter_propertyValues(_node: PropertyValues, _parent: Node | undefined, _route: NodeInfo[]): void {
  //   //
  // }

  // protected between_propertyValues(
  //   _node: Properties,
  //   _left: Node,
  //   _right: Node,
  //   _parent: Node | undefined,
  //   _route: NodeInfo[],
  // ): void {
  //   //
  // }

  // protected exit_propertyValues(_node: PropertyValues, _parent: Node | undefined, _route: NodeInfo[]): void {
  //   //
  // }

  //  bitmark -> bit -> itemLead

  protected enter_itemLead(_node: ItemLead, _parent: Node | undefined, _route: NodeInfo[]): void {
    //
  }

  protected between_itemLead(
    _node: ItemLead,
    _left: Node,
    _right: Node,
    _parent: Node | undefined,
    _route: NodeInfo[],
  ): void {
    //
  }

  protected exit_itemLead(_node: ItemLead, _parent: Node | undefined, _route: NodeInfo[]): void {
    //
  }

  // // body

  // protected enter_body(_node: Body, _parent: Node | undefined, _route: NodeInfo[]): void {
  //   //
  // }

  // protected between_body(_node: Body, _left: Node, _right: Node, _parent: Node | undefined, _route: NodeInfo[]): void {
  //   //
  // }

  // protected exit_ibody(_node: Body, _parent: Node | undefined, _route: NodeInfo[]): void {
  //   //
  // }

  // // gap

  // protected enter_gap(_node: Gap, _parent: Node | undefined, _route: NodeInfo[]): void {
  //   //
  // }

  // protected between_gap(_node: Gap, _left: Node, _right: Node, _parent: Node | undefined, _route: NodeInfo[]): void {
  //   //
  // }

  // protected exit_gap(_node: Gap, _parent: Node | undefined, _route: NodeInfo[]): void {
  //   //
  // }

  // // select

  // protected enter_select(_node: Select, _parent: Node | undefined, _route: NodeInfo[]): void {
  //   //
  // }

  // protected between_select(
  //   _node: Select,
  //   _left: Node,
  //   _right: Node,
  //   _parent: Node | undefined,
  //   _route: NodeInfo[],
  // ): void {
  //   //
  // }

  // protected exit_select(_node: Select, _parent: Node | undefined, _route: NodeInfo[]): void {
  //   //
  // }

  // // elements

  // protected enter_elements(_node: Elements, _parent: Node | undefined, _route: NodeInfo[]): void {
  //   this.writeCardDivider();
  //   this.writeNL();
  // }

  // protected between_elements(
  //   _node: Elements,
  //   _left: Node,
  //   _right: Node,
  //   _parent: Node | undefined,
  //   _route: NodeInfo[],
  // ): void {
  //   this.writeNL();
  //   this.writeElementDivider();
  //   this.writeNL();
  // }

  // protected exit_elements(_node: Elements, _parent: Node | undefined, _route: NodeInfo[]): void {
  //   this.writeNL();
  //   this.writeCardDivider();
  // }

  // // solutions

  // protected enter_solutions(_node: Solutions, _parent: Node | undefined, _route: NodeInfo[]): void {
  //   //
  // }

  // protected between_solutions(
  //   _node: Solutions,
  //   _left: Node,
  //   _right: Node,
  //   _parent: Node | undefined,
  //   _route: NodeInfo[],
  // ): void {
  //   //
  // }

  // protected exit_solutions(_node: Solutions, _parent: Node | undefined, _route: NodeInfo[]): void {
  //   //
  // }

  // // selectOptions

  // protected enter_selectOptions(_node: SelectOptions, _parent: Node | undefined, _route: NodeInfo[]): void {
  //   //
  // }

  // protected between_selectOptions(
  //   _node: SelectOptions,
  //   _left: Node,
  //   _right: Node,
  //   _parent: Node | undefined,
  //   _route: NodeInfo[],
  // ): void {
  //   //
  // }

  // protected exit_selectOptions(_node: SelectOptions, _parent: Node | undefined, _route: NodeInfo[]): void {
  //   //
  // }

  // // selectOption

  // protected enter_selectOption(node: SelectOption, _parent: Node | undefined, _route: NodeInfo[]): void {
  //   if (node.isCorrect.value) {
  //     this.writeOPP();
  //   } else {
  //     this.writeOPM();
  //   }
  //   this.write(node.text.value);
  //   this.writeCL();
  // }

  // protected between_selectOption(
  //   _node: SelectOption,
  //   _left: Node,
  //   _right: Node,
  //   _parent: Node | undefined,
  //   _route: NodeInfo[],
  // ): void {
  //   //
  // }

  // protected exit_selectOption(_node: SelectOption, _parent: Node | undefined, _route: NodeInfo[]): void {
  //   //
  // }

  // // statements

  // protected enter_statements(_node: Statements, _parent: Node | undefined, _route: NodeInfo[]): void {
  //   this.writeCardDivider();
  //   this.writeNL();
  // }

  // protected between_statements(
  //   _node: Statements,
  //   _left: Node,
  //   _right: Node,
  //   _parent: Node | undefined,
  //   _route: NodeInfo[],
  // ): void {
  //   this.writeNL();
  //   this.writeCardDivider();
  //   this.writeNL();
  // }

  // protected exit_statements(_node: Statements, _parent: Node | undefined, _route: NodeInfo[]): void {
  //   this.writeNL();
  //   this.writeCardDivider();
  // }

  // // statement

  // protected enter_statement(node: Statement, _parent: Node | undefined, _route: NodeInfo[]): void {
  //   if (node.isCorrect.value) {
  //     this.writeOPP();
  //   } else {
  //     this.writeOPM();
  //   }
  //   this.write(node.text.value);
  //   this.writeCL();
  // }

  // protected between_statement(
  //   _node: Statement,
  //   _left: Node,
  //   _right: Node,
  //   _parent: Node | undefined,
  //   _route: NodeInfo[],
  // ): void {
  //   //
  // }

  // protected exit_statement(_node: Statement, _parent: Node | undefined, _route: NodeInfo[]): void {
  //   //
  // }

  // // choices

  // protected enter_choices(_node: Choices, _parent: Node | undefined, _route: NodeInfo[]): void {
  //   //
  // }

  // protected between_choices(
  //   _node: Choices,
  //   _left: Node,
  //   _right: Node,
  //   _parent: Node | undefined,
  //   _route: NodeInfo[],
  // ): void {
  //   this.writeNL();
  // }

  // protected exit_choices(_node: Choices, _parent: Node | undefined, _route: NodeInfo[]): void {
  //   //
  // }

  // // choice

  // protected enter_choice(node: Choice, _parent: Node | undefined, _route: NodeInfo[]): void {
  //   if (node.isCorrect.value) {
  //     this.writeOPP();
  //   } else {
  //     this.writeOPM();
  //   }
  //   this.write(node.text.value);
  //   this.writeCL();
  // }

  // protected between_choice(
  //   _node: Choice,
  //   _left: Node,
  //   _right: Node,
  //   _parent: Node | undefined,
  //   _route: NodeInfo[],
  // ): void {
  //   //
  // }

  // protected exit_choice(_node: Choice, _parent: Node | undefined, _route: NodeInfo[]): void {
  //   //
  // }

  // // responses

  // protected enter_responses(_node: Responses, _parent: Node | undefined, _route: NodeInfo[]): void {
  //   //
  // }

  // protected between_responses(
  //   _node: Responses,
  //   _left: Node,
  //   _right: Node,
  //   _parent: Node | undefined,
  //   _route: NodeInfo[],
  // ): void {
  //   this.writeNL();
  // }

  // protected exit_responses(_node: Responses, _parent: Node | undefined, _route: NodeInfo[]): void {
  //   //
  // }

  // // response

  // protected enter_response(node: Response, _parent: Node | undefined, _route: NodeInfo[]): void {
  //   if (node.isCorrect.value) {
  //     this.writeOPP();
  //   } else {
  //     this.writeOPM();
  //   }
  //   this.write(node.text.value);
  //   this.writeCL();
  // }

  // protected between_response(
  //   _node: Response,
  //   _left: Node,
  //   _right: Node,
  //   _parent: Node | undefined,
  //   _route: NodeInfo[],
  // ): void {
  //   //
  // }

  // protected exit_response(_node: Response, _parent: Node | undefined, _route: NodeInfo[]): void {
  //   //
  // }

  // // quizzes

  // protected enter_quizzes(_node: Quizzes, _parent: Node | undefined, _route: NodeInfo[]): void {
  //   this.writeCardDivider();
  //   this.writeNL();
  // }

  // protected between_quizzes(
  //   _node: Quizzes,
  //   _left: Node,
  //   _right: Node,
  //   _parent: Node | undefined,
  //   _route: NodeInfo[],
  // ): void {
  //   this.writeNL();
  //   this.writeCardDivider();
  //   this.writeNL();
  // }

  // protected exit_quizzes(_node: Quizzes, _parent: Node | undefined, _route: NodeInfo[]): void {
  //   this.writeNL();
  //   this.writeCardDivider();
  // }

  // // quiz

  // protected enter_quiz(_node: Quiz, _parent: Node | undefined, _route: NodeInfo[]): void {
  //   //
  // }

  // protected between_quiz(_node: Quiz, _left: Node, _right: Node, _parent: Node | undefined, _route: NodeInfo[]): void {
  //   this.writeNL();
  // }

  // protected exit_quiz(_node: Quiz, _parent: Node | undefined, _route: NodeInfo[]): void {
  //   //
  // }

  // // pairs

  // protected enter_pairs(_node: Pairs, _parent: Node | undefined, _route: NodeInfo[]): void {
  //   this.writeNL();
  //   this.writeCardDivider();
  //   this.writeNL();
  // }

  // protected between_pairs(
  //   _node: Pairs,
  //   _left: Node,
  //   _right: Node,
  //   _parent: Node | undefined,
  //   _route: NodeInfo[],
  // ): void {
  //   this.writeNL();
  //   this.writeCardDivider();
  //   this.writeNL();
  // }

  // protected exit_pairs(_node: Pairs, _parent: Node | undefined, _route: NodeInfo[]): void {
  //   this.writeNL();
  //   this.writeCardDivider();
  //   this.writeNL();
  // }

  // // pair

  // protected enter_pair(_node: Pair, _parent: Node | undefined, _route: NodeInfo[]): void {
  //   //
  // }

  // protected between_pair(_node: Pair, _left: Node, _right: Node, _parent: Node | undefined, _route: NodeInfo[]): void {
  //   //
  // }

  // protected exit_pair(_node: Pair, _parent: Node | undefined, _route: NodeInfo[]): void {
  //   //
  // }

  // // pairValues

  // protected enter_pairValues(_node: PairValues, _parent: Node | undefined, _route: NodeInfo[]): void {
  //   this.writeNL();
  //   this.writePairKeyValueDivider();
  //   this.writeNL();
  // }

  // protected between_pairValues(
  //   _node: PairValues,
  //   _left: Node,
  //   _right: Node,
  //   _parent: Node | undefined,
  //   _route: NodeInfo[],
  // ): void {
  //   this.writeNL();
  //   this.writePairValueDivider();
  //   this.writeNL();
  // }

  // protected exit_pairValues(_node: PairValues, _parent: Node | undefined, _route: NodeInfo[]): void {
  //   //
  // }

  //
  // Terminal nodes (leaves)
  //

  // bitType

  // textFormat

  // attachmentType

  //  * -> itemLead --> item

  protected leaf_item(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value != null) {
      this.writeOPC();
      this.writeString(node.value);
      this.writeCL();
    }
  }

  //  * -> itemLead --> lead

  protected leaf_lead(node: NodeInfo, _parent: Node | undefined, _route: NodeInfo[]): void {
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

  // * -> instruction

  protected leaf_instruction(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeOPB();
      this.writeString(node.value);
      this.writeCL();
    }
  }

  // * -> example

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

  // // element

  // protected enter_element(node: Solution, _parent: Node | undefined, _route: NodeInfo[]): void {
  //   if (node.value) {
  //     this.writeString(node.value);
  //   }
  // }

  // bitmark -> bits -> body -> solutions -> solution
  // ? -> solutions -> solution

  protected leaf_solutionsValue(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeOPU();
      this.writeString(node.value);
      this.writeCL();
    }
  }

  // // prefix

  // protected enter_prefix(node: Prefix, _parent: Node | undefined, _route: NodeInfo[]): void {
  //   if (node.value) {
  //     this.writeOPPRE();
  //     this.writeString(node.value);
  //     this.writeCL();
  //   }
  // }

  // // postfix

  // protected enter_postfix(node: Postfix, _parent: Node | undefined, _route: NodeInfo[]): void {
  //   if (node.value) {
  //     this.writeOPPOST();
  //     this.writeString(node.value);
  //     this.writeCL();
  //   }
  // }

  // // isCaseSensitive

  // protected enter_isCaseSensitive(node: IsCaseSensitive, _parent: Node | undefined, _route: NodeInfo[]): void {
  //   if (node.value) {
  //     // Not in bitmark??
  //   }
  // }

  // // isLongAnswer

  // protected enter_isLongAnswer(node: IsCorrect, _parent: Node | undefined, _route: NodeInfo[]): void {
  //   if (node.value) {
  //     //
  //   }
  // }

  // // isCorrect

  // protected enter_isCorrect(node: IsCorrect, _parent: Node | undefined, _route: NodeInfo[]): void {
  //   if (node.value) {
  //     //
  //   }
  // }

  // // pairKey

  // protected enter_pairKey(node: PairKey, _parent: Node | undefined, _route: NodeInfo[]): void {
  //   if (node.value) {
  //     this.writeString(node.value);
  //   }
  // }

  // // pairValue

  // protected enter_pairValue(node: PairValue, _parent: Node | undefined, _route: NodeInfo[]): void {
  //   if (node.value) {
  //     this.writeString(node.value);
  //   }
  // }

  // // // text

  // // protected enter_text(node: Text, _parent: Node | undefined, _route: NodeInfo[]): void {
  // //   if (node.value) {
  // //     this.writeString(node.value);
  // //   }
  // // }

  // // // propertyKey

  // // protected enter_propertyKey(node: PropertyKey, _parent: Node | undefined, _route: NodeInfo[]): void {
  // //   if (node.value) {
  // //     //
  // //   }
  // // }

  // // // propertyValue

  // // protected enter_propertyValue(node: PropertyValue, _parent: Node | undefined, _route: NodeInfo[]): void {
  // //   if (node.value) {
  // //     //
  // //   }
  // // }

  // // ids

  // protected enter_ids(node: Ids, _parent: Node | undefined, _route: NodeInfo[]): void {
  //   for (const id of node.value) {
  //     if (id) {
  //       this.writeOPA();
  //       this.writeString('id');
  //       this.writeColon();
  //       this.writeString(`${id}`);
  //       this.writeCL();
  //     }
  //   }
  // }

  // // ageRanges

  // protected enter_ageRanges(node: AgeRanges, _parent: Node | undefined, _route: NodeInfo[]): void {
  //   for (const ageRange of node.value) {
  //     if (ageRange) {
  //       this.writeOPA();
  //       this.writeString('ageRange');
  //       this.writeColon();
  //       this.writeString(`${ageRange}`);
  //       this.writeCL();
  //     }
  //   }
  // }

  // // languages

  // protected enter_languages(node: Languages, _parent: Node | undefined, _route: NodeInfo[]): void {
  //   for (const lang of node.value) {
  //     if (lang) {
  //       this.writeOPA();
  //       this.writeString('language');
  //       this.writeColon();
  //       this.writeString(`${lang}`);
  //       this.writeCL();
  //     }
  //   }
  // }

  // // resource

  // protected enter_resource(node: Resource, _parent: Node | undefined, _route: NodeInfo[]): void {
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
    this.write('---');
  }

  protected writePairKeyValueDivider(): void {
    this.write('==');
  }

  protected writePairValueDivider(): void {
    this.write('--');
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
