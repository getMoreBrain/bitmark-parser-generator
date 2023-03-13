import { AstNodeType } from '../AstNodeType';
import { Ast, AstWalkCallbacks, AstNode, AstNodeInfo } from '../Ast';
import { AgeRangesNode } from '../nodes/AgeRangesNode';
import { AttachmentTypeNode } from '../nodes/AttachmentTypeNode';
import { BitHeaderNode } from '../nodes/BitHeaderNode';
import { BitNode } from '../nodes/BitNode';
import { BitTypeNode } from '../nodes/BitTypeNode';
import { BitmarkNode } from '../nodes/BitmarkNode';
import { BodyNode } from '../nodes/BodyNode';
import { BodyTextNode } from '../nodes/BodyTextNode';
import { ChoiceNode } from '../nodes/ChoiceNode';
import { ChoicesNode } from '../nodes/ChoicesNode';
import { ExampleNode } from '../nodes/ExampleNode';
import { GapNode } from '../nodes/GapNode';
import { HintNode } from '../nodes/HintNode';
import { IdsNode } from '../nodes/IdsNode';
import { InstructionNode } from '../nodes/InstructionNode';
import { IsCaseSensitiveNode } from '../nodes/IsCaseSensitiveNode';
import { IsCorrectNode } from '../nodes/IsCorrectNode';
import { ItemLeadNode } from '../nodes/ItemLeadNode';
import { ItemNode } from '../nodes/ItemNode';
import { LanguagesNode } from '../nodes/LanguagesNode';
import { LeadNode } from '../nodes/LeadNode';
import { PostfixNode } from '../nodes/PostfixNode';
import { PrefixNode } from '../nodes/PrefixNode';
import { PropertiesNode } from '../nodes/PropertiesNode';
import { PropertyKeyNode } from '../nodes/PropertyKeyNode';
import { PropertyValueNode } from '../nodes/PropertyValueNode';
import { PropertyValuesNode } from '../nodes/PropertyValuesNode';
import { ResourceNode } from '../nodes/ResourceNode';
import { ResponseNode } from '../nodes/ResponseNode';
import { ResponsesNode } from '../nodes/ResponsesNode';
import { SelectNode } from '../nodes/SelectNode';
import { SelectOptionNode } from '../nodes/SelectOptionNode';
import { SelectOptionTextNode } from '../nodes/SelectOptionTextNode';
import { SelectOptionsNode } from '../nodes/SelectOptionsNode';
import { SolutionNode } from '../nodes/SolutionNode';
import { SolutionsNode } from '../nodes/SolutionsNode';
import { TextFormatNode } from '../nodes/TextFormatNode';
import { TextFormat } from '../types/TextFormat';
import { ArticleOnlineResource } from '../types/resources/ArticleOnlineResource';
import { ResourceType } from '../types/resources/ResouceType';

import { CodeGenerator } from './CodeGenerator';
import { CodeWriter } from './writer/CodeWriter';
import { TextWriter } from './writer/TextWriter';

const DEFAULT_OPTIONS: BitmarkGeneratorOptions = {
  //
};

export interface BitmarkGeneratorOptions {
  explicitTextFormat?: boolean;
}

class BitmarkMarkupGenerator extends CodeWriter implements CodeGenerator {
  // TODO - make Ast class a singleton
  private ast = new Ast();
  private options: BitmarkGeneratorOptions;
  private astWalker: AstWalker;

  constructor(writer: TextWriter, options?: BitmarkGeneratorOptions) {
    super(writer);

    this.options = {
      ...DEFAULT_OPTIONS,
      ...options,
    };

    this.astWalker = new AstWalker(this);
  }

  public generate(root: AstNode): void {
    this.ast.walk(root, this.astWalker);

    this.writeEndOfLine();
  }

  //
  // NODE HANDLERS
  //

  //
  // Non-Terminal nodes (branches)
  //

  // bitmark

  protected on_bitmark_enter(_node: BitmarkNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    //
  }

  protected on_bitmark_between(
    _node: BitmarkNode,
    _left: AstNode,
    _right: AstNode,
    _parent: AstNode | undefined,
    _route: AstNodeInfo[],
  ): void {
    this.writeNL();
    this.writeNL();
    this.writeNL();
  }

  protected on_bitmark_exit(_node: BitmarkNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    //
  }

  // bit

  protected on_bit_enter(node: BitNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    this.writeOPD();
    this.writeString(node.bitType.value);

    if (node.textFormat) {
      const write = this.isWriteTextFormat(node.textFormat.value);

      if (write) {
        this.writeColon();
        this.writeString(node.textFormat.value);
      }
    }

    if (node.attachmentType) {
      this.writeAmpersand();
      this.writeString(node.attachmentType.value);
    }
    this.writeCL();
    this.writeNL();
  }

  protected on_bit_between(
    _node: BitNode,
    left: AstNode,
    _right: AstNode,
    _parent: AstNode | undefined,
    _route: AstNodeInfo[],
  ): void {
    const noNl =
      left.type === AstNodeType.bitType ||
      left.type === AstNodeType.textFormat ||
      left.type === AstNodeType.attachmentType;

    if (!noNl) {
      this.writeNL();
    }
  }

  protected on_bit_exit(_node: BitNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    //
  }

  // bitHeader

  protected on_bitHeader_enter(_node: BitHeaderNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    //
  }

  protected on_bitHeader_between(
    _node: BitHeaderNode,
    _left: AstNode,
    right: AstNode,
    _parent: AstNode | undefined,
    _route: AstNodeInfo[],
  ): void {
    //
  }

  protected on_bitHeader_exit(_node: BitHeaderNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    //
  }

  // properties

  protected on_properties_enter(_node: PropertiesNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    //
  }

  protected on_properties_between(
    _node: PropertiesNode,
    _left: AstNode,
    _right: AstNode,
    _parent: AstNode | undefined,
    _route: AstNodeInfo[],
  ): void {
    //
  }

  protected on_properties_exit(_node: PropertyValuesNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    //
  }

  // propertyValues

  protected on_propertyValues_enter(
    _node: PropertyValuesNode,
    _parent: AstNode | undefined,
    _route: AstNodeInfo[],
  ): void {
    //
  }

  protected on_propertyValues_between(
    _node: PropertiesNode,
    _left: AstNode,
    _right: AstNode,
    _parent: AstNode | undefined,
    _route: AstNodeInfo[],
  ): void {
    //
  }

  protected on_propertyValues_exit(
    _node: PropertyValuesNode,
    _parent: AstNode | undefined,
    _route: AstNodeInfo[],
  ): void {
    //
  }

  // itemLead

  protected on_itemLead_enter(_node: ItemLeadNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    //
  }

  protected on_itemLead_between(
    _node: ItemLeadNode,
    _left: AstNode,
    _right: AstNode,
    _parent: AstNode | undefined,
    _route: AstNodeInfo[],
  ): void {
    //
  }

  protected on_itemLead_exit(_node: ItemLeadNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    //
  }

  // body

  protected on_body_enter(_node: BodyNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    //
  }

  protected on_body_between(
    _node: BodyNode,
    _left: AstNode,
    _right: AstNode,
    _parent: AstNode | undefined,
    _route: AstNodeInfo[],
  ): void {
    //
  }

  protected on_ibody_exit(_node: BodyNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    //
  }

  // gap

  protected on_gap_enter(_node: GapNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    //
  }

  protected on_gap_between(
    _node: GapNode,
    _left: AstNode,
    _right: AstNode,
    _parent: AstNode | undefined,
    _route: AstNodeInfo[],
  ): void {
    //
  }

  protected on_gap_exit(_node: GapNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    //
  }

  // select

  protected on_select_enter(_node: SelectNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    //
  }

  protected on_select_between(
    _node: SelectNode,
    _left: AstNode,
    _right: AstNode,
    _parent: AstNode | undefined,
    _route: AstNodeInfo[],
  ): void {
    //
  }

  protected on_select_exit(_node: SelectNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    //
  }

  // solutions

  protected on_solutions_enter(_node: SolutionsNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    //
  }

  protected on_solutions_between(
    _node: SolutionsNode,
    _left: AstNode,
    _right: AstNode,
    _parent: AstNode | undefined,
    _route: AstNodeInfo[],
  ): void {
    //
  }

  protected on_solutions_exit(_node: SolutionsNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    //
  }

  // selectOptions

  protected on_selectOptions_enter(
    _node: SelectOptionsNode,
    _parent: AstNode | undefined,
    _route: AstNodeInfo[],
  ): void {
    //
  }

  protected on_selectOptions_between(
    _node: SelectOptionsNode,
    _left: AstNode,
    _right: AstNode,
    _parent: AstNode | undefined,
    _route: AstNodeInfo[],
  ): void {
    //
  }

  protected on_selectOptions_exit(_node: SelectOptionsNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    //
  }

  // selectOption

  protected on_selectOption_enter(_node: SelectOptionNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    //
  }

  protected on_selectOption_between(
    _node: SelectOptionNode,
    _left: AstNode,
    _right: AstNode,
    _parent: AstNode | undefined,
    _route: AstNodeInfo[],
  ): void {
    //
  }

  protected on_selectOption_exit(_node: SelectOptionNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    //
  }

  // choices

  protected on_choices_enter(_node: ChoicesNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    //
  }

  protected on_choices_between(
    _node: ChoicesNode,
    _left: AstNode,
    _right: AstNode,
    _parent: AstNode | undefined,
    _route: AstNodeInfo[],
  ): void {
    this.writeNL();
  }

  protected on_choices_exit(_node: ChoicesNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    //
  }

  // choice

  protected on_choice_enter(node: ChoiceNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    if (node.isCorrect.value) {
      this.writeOPP();
    } else {
      this.writeOPM();
    }
    this.write(node.text.value);
    this.writeCL();
  }

  protected on_choice_between(
    _node: ChoiceNode,
    _left: AstNode,
    _right: AstNode,
    _parent: AstNode | undefined,
    _route: AstNodeInfo[],
  ): void {
    //
  }

  protected on_choice_exit(_node: ChoiceNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    //
  }

  // responses

  protected on_responses_enter(_node: ResponsesNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    //
  }

  protected on_responses_between(
    _node: ResponsesNode,
    _left: AstNode,
    _right: AstNode,
    _parent: AstNode | undefined,
    _route: AstNodeInfo[],
  ): void {
    this.writeNL();
  }

  protected on_responses_exit(_node: ResponsesNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    //
  }

  // response

  protected on_response_enter(node: ResponseNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    if (node.isCorrect.value) {
      this.writeOPP();
    } else {
      this.writeOPM();
    }
    this.write(node.text.value);
    this.writeCL();
  }

  protected on_response_between(
    _node: ResponseNode,
    _left: AstNode,
    _right: AstNode,
    _parent: AstNode | undefined,
    _route: AstNodeInfo[],
  ): void {
    //
  }

  protected on_response_exit(_node: ResponseNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    //
  }

  //
  // Terminal nodes (leaves)
  //

  // bitType

  protected on_bitType_enter(_node: BitTypeNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    //
  }

  // textFormat

  protected on_textFormat_enter(_node: TextFormatNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    //
  }

  // attachmentType

  protected on_attachmentType_enter(
    _node: AttachmentTypeNode,
    _parent: AstNode | undefined,
    _route: AstNodeInfo[],
  ): void {
    //
  }

  // item

  protected on_item_enter(node: ItemNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    if (node.value) {
      this.writeOPC();
      this.writeString(node.value);
      this.writeCL();
    }
  }

  // lead

  protected on_lead_enter(node: LeadNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    if (node.value) {
      this.writeOPC();
      this.writeString(node.value);
      this.writeCL();
    }
  }

  // hint

  protected on_hint_enter(node: HintNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    if (node.value) {
      this.writeOPQ();
      this.writeString(node.value);
      this.writeCL();
    }
  }

  // instruction

  protected on_instruction_enter(node: InstructionNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    if (node.value) {
      this.writeOPB();
      this.writeString(node.value);
      this.writeCL();
    }
  }

  // example

  protected on_example_enter(node: ExampleNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    const example = node.value;

    this.writeOPA();
    this.writeString('example');

    if (example !== true && example !== '') {
      this.writeColon();
      this.writeString(example as string);
    }

    this.writeCL();
  }

  // bodyText

  protected on_bodyText_enter(node: BodyTextNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    if (node.value) {
      this.writeString(node.value);
    }
  }

  // solution

  protected on_solution_enter(node: SolutionNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    if (node.value) {
      this.writeOPU();
      this.writeString(node.value);
      this.writeCL();
    }
  }

  // prefix

  protected on_prefix_enter(node: PrefixNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    if (node.value) {
      //
    }
  }

  // postfix

  protected on_postfix_enter(node: PostfixNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    if (node.value) {
      //
    }
  }

  // isCaseSensitive

  protected on_isCaseSensitive_enter(
    node: IsCaseSensitiveNode,
    _parent: AstNode | undefined,
    _route: AstNodeInfo[],
  ): void {
    if (node.value) {
      //
    }
  }

  // isCorrect

  protected on_isCorrect_enter(node: IsCorrectNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    if (node.value) {
      //
    }
  }

  // selectOptionText

  protected on_selectOptionText_enter(
    node: SelectOptionTextNode,
    _parent: AstNode | undefined,
    _route: AstNodeInfo[],
  ): void {
    if (node.value) {
      //
    }
  }

  // propertyKey

  protected on_propertyKey_enter(node: PropertyKeyNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    if (node.value) {
      //
    }
  }

  // propertyValue

  protected on_propertyValue_enter(node: PropertyValueNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    if (node.value) {
      //
    }
  }

  // ids

  protected on_ids_enter(node: IdsNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
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

  // ageRanges

  protected on_ageRanges_enter(node: AgeRangesNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
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

  // languages

  protected on_languages_enter(node: LanguagesNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
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

  // resource

  protected on_resource_enter(node: ResourceNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    const resource = node.value;
    if (resource) {
      this.writeOPAMP();
      this.writeString(resource.type);
      this.writeColon();

      switch (resource.type) {
        case ResourceType.articleOnline: {
          const articleOnline = resource.articleOnline as ArticleOnlineResource;
          this.writeString(articleOnline.url);
          break;
        }
        case ResourceType.app:
          this.writeString(resource.app);
          break;
      }

      this.writeCL();
    }
  }
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

  protected writeNL(): void {
    this.write('\n');
  }

  // protected isBodyNode(node: BitNode): boolean {
  //   if (!node || node.type !== AstNodeType.bit) return false;
  //   return node.bitTypeNode?.bitType === BitType.body;
  // }

  // protected isTextNode(node: BitNode): boolean {
  //   if (!node || node.type !== AstNodeType.bit) return false;
  //   return node.bitTypeNode?.bitType === BitType.text;
  // }

  // protected isCardsNode(node: BitNode): boolean {
  //   if (!node || node.type !== AstNodeType.bit) return false;
  //   if (node.bitTypeNode) {
  //     switch (node.bitTypeNode.bitType) {
  //       case BitType.cards:
  //         return true;
  //     }
  //   }
  //   return false;
  // }

  // protected isQuizNode(node: BitNode): boolean {
  //   if (!node || node.type !== AstNodeType.bit) return false;
  //   if (node.bitTypeNode) {
  //     switch (node.bitTypeNode.bitType) {
  //       case BitType.quiz:
  //         return true;
  //     }
  //   }
  //   return false;
  // }

  protected isWriteTextFormat(bitValue: string): boolean {
    const isMinusMinus = TextFormat.fromValue(bitValue) === TextFormat.bitmarkMinusMinus;
    const writeFormat = !isMinusMinus || this.options.explicitTextFormat;
    return !!writeFormat;
  }
}

class AstWalker implements AstWalkCallbacks {
  private generator: BitmarkMarkupGenerator;

  constructor(generator: BitmarkMarkupGenerator) {
    this.generator = generator;

    this.enter = this.enter.bind(this);
    this.between = this.between.bind(this);
    this.exit = this.exit.bind(this);
  }

  enter(node: AstNode, parent: AstNode | undefined, route: AstNodeInfo[]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gen = this.generator as any;
    const funcName = `on_${node.type}_enter`;

    if (typeof gen[funcName] === 'function') {
      gen[funcName](node, parent, route);
    }
  }

  between(node: AstNode, leftNode: AstNode, rightNode: AstNode, parent: AstNode | undefined, route: AstNodeInfo[]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gen = this.generator as any;
    const funcName = `on_${node.type}_between`;

    if (typeof gen[funcName] === 'function') {
      gen[funcName](node, leftNode, rightNode, parent, route);
    }
  }

  exit(node: AstNode, parent: AstNode | undefined, route: AstNodeInfo[]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gen = this.generator as any;
    const funcName = `on_${node.type}_exit`;

    if (typeof gen[funcName] === 'function') {
      gen[funcName](node, parent, route);
    }
  }
}

export { BitmarkMarkupGenerator };

// // bits

// protected on_bit_enter(node: BitNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
//   // const isCardBits = this.isCardNode(node.bitNode);
//   // if (isCardBits) {
//   //   this.writeCardDivider();
//   // }
// }

// protected on_bits_between(
//   node: BitsNode,
//   _left: AstNode,
//   _right: AstNode,
//   _parent: AstNode | undefined,
//   _route: AstNodeInfo[],
// ): void {
//   const isTopLevelBits = this.isTopLevelBits(node);
//   const isCards = this.isCardsNode(node.bitNode);
//   const isQuiz = this.isQuizNode(node.bitNode);

//   if (isTopLevelBits || isQuiz) {
//     this.writeNL();
//   } else if (isCards) {
//     this.writeCardDivider();
//   }
// }

// protected on_bits_exit(node: BitsNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
//   const isCards = this.isCardsNode(node.bitNode);
//   if (isCards) {
//     this.writeCardDivider();
//   }

//   const isQuiz = this.isQuizNode(node.bitNode);
//   if (isQuiz) {
//     this.writeNL();
//   }
// }

// // bit

// protected on_bit_enter(node: BitNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
//   const isHiddenBit = this.isHiddenBitNode(node);

//   if (!isHiddenBit) {
//     this.writeOP();
//   }
// }

// protected on_bit_between(
//   _node: BitNode,
//   _left: AstNode,
//   _right: AstNode,
//   _parent: AstNode | undefined,
//   _route: AstNodeInfo[],
// ): void {
//   //
// }

// protected on_bit_exit(node: BitNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
//   const isHiddenBit = this.isHiddenBitNode(node);

//   if (!isHiddenBit) {
//     this.writeCL();
//   }
// }

// //
// // Terminal nodes (leaves)
// //

// // bitType

// protected on_bitType_enter(node: AstNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
//   const bitTypeText = BitTypeMap.fromKey(node.value) ?? '';
//   this.writeString(bitTypeText);
// }

// // bitKey

// protected on_bitKey_enter(node: AstNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
//   this.writeString(node.value);
// }

// // bitValue

// protected on_bitValue_enter(node: AstNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
//   if (node.value) {
//     const write = this.isWriteFormat(node.value);

//     if (write) {
//       if (node.value !== true) {
//         this.writeColon();
//         this.writeString(node.value);
//       }
//     }
//   }
// }

// // bitAttachmentType

// protected on_bitAttachmentType_enter(node: AstNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
//   if (node.value) {
//     this.writeAmpersand();
//     this.writeString(node.value);
//   }
// }

// // END NODE HANDLERS

// //
// // WRITE FUNCTIONS
// //

// protected writeString(s?: string): void {
//   if (s != null) this.write(s);
// }

// // protected writeOPBUL(): void {
// //   this.write('[•');
// // }

// // protected writeOPESC(): void {
// //   this.write('[^');
// // }

// // protected writeOPRANGLE(): void {
// //   this.write('[►');
// // }

// // protected writeOPDANGLE(): void {
// //   this.write('[▼');
// // }

// // protected writeOPD(): void {
// //   this.write('[.');
// // }

// // protected writeOPU(): void {
// //   this.write('[_');
// // }

// // protected writeOPB(): void {
// //   this.write('[!');
// // }

// // protected writeOPQ(): void {
// //   this.write('[?');
// // }

// // protected writeOPA(): void {
// //   this.write('[@');
// // }

// // protected writeOPP(): void {
// //   this.write('[+');
// // }

// // protected writeOPM(): void {
// //   this.write('[-');
// // }

// // protected writeOPS(): void {
// //   this.write('[\\');
// // }

// // protected writeOPR(): void {
// //   this.write('[*');
// // }

// // protected writeOPC(): void {
// //   this.write('[%');
// // }

// protected writeOP(): void {
//   this.write('[');
// }

// protected writeCL(): void {
//   this.write(']');
// }

// protected writeAmpersand(): void {
//   this.write('&');
// }

// protected writeColon(): void {
//   this.write(':');
// }

// // protected writeDoubleColon(): void {
// //   this.write('::');
// // }

// protected writeCardDivider(): void {
//   this.write('===');
// }

// protected writeNL(): void {
//   this.write('\n');
// }

// protected isTopLevelBits(node: BitsNode): boolean {
//   if (node.type !== AstNodeType.bits) return false;

//   if (node.bitNode && node.bitNode.bitTypeNode) {
//     switch (node.bitNode.bitTypeNode.bitType) {
//       case BitType.bit:
//         // case BitType.statementFalse:
//         return true;
//     }
//   }

//   return false;
// }

// // protected isTopLevelBit(node: BitNode): boolean {
// //   if (node.type !== AstNodeType.bit) return false;

// //   if (node.bitTypeNode) {
// //     switch (node.bitTypeNode.bitType) {
// //       case BitType.bit:
// //       case BitType.property:
// //         return true;
// //     }
// //   }

// //   return false;
// // }

// protected isHiddenBitNode(node: BitNode): boolean {
//   return this.isBodyNode(node) || this.isTextNode(node) || this.isQuizNode(node) || this.isCardsNode(node);
// }

// protected isBodyNode(node: BitNode): boolean {
//   if (!node || node.type !== AstNodeType.bit) return false;
//   return node.bitTypeNode?.bitType === BitType.body;
// }

// protected isTextNode(node: BitNode): boolean {
//   if (!node || node.type !== AstNodeType.bit) return false;
//   return node.bitTypeNode?.bitType === BitType.text;
// }

// protected isCardsNode(node: BitNode): boolean {
//   if (!node || node.type !== AstNodeType.bit) return false;
//   if (node.bitTypeNode) {
//     switch (node.bitTypeNode.bitType) {
//       case BitType.cards:
//         return true;
//     }
//   }
//   return false;
// }

// protected isQuizNode(node: BitNode): boolean {
//   if (!node || node.type !== AstNodeType.bit) return false;
//   if (node.bitTypeNode) {
//     switch (node.bitTypeNode.bitType) {
//       case BitType.quiz:
//         return true;
//     }
//   }
//   return false;
// }

// protected isWriteFormat(bitValue: string): boolean {
//   const isMinusMinus = TextFormat.fromValue(bitValue) === TextFormat.bitmarkMinusMinus;
//   const writeFormat = !isMinusMinus || this.options.explicitTextFormat;
//   return !!writeFormat;
// }
