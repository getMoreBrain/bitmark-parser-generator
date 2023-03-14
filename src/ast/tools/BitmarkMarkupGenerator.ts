import { AstNodeType } from '../AstNodeType';
import { Ast, AstWalkCallbacks, AstNode, AstNodeInfo } from '../Ast';
import { AttachmentTypeNode } from '../nodes/bit/AttachmentTypeNode';
import { BitNode } from '../nodes/bit/BitNode';
import { BitTypeNode } from '../nodes/bit/BitTypeNode';
import { TextFormatNode } from '../nodes/bit/TextFormatNode';
import { BitmarkNode } from '../nodes/bitmark/BitmarkNode';
import { BodyNode } from '../nodes/body/BodyNode';
import { BodyTextNode } from '../nodes/body/BodyTextNode';
import { ChoiceNode } from '../nodes/choice/ChoiceNode';
import { ChoicesNode } from '../nodes/choice/ChoicesNode';
import { ElementsNode } from '../nodes/element/ElementsNode';
import { GapNode } from '../nodes/gap/GapNode';
import { SolutionNode } from '../nodes/gap/SolutionNode';
import { SolutionsNode } from '../nodes/gap/SolutionsNode';
import { ExampleNode } from '../nodes/generic/ExampleNode';
import { HintNode } from '../nodes/generic/HintNode';
import { InstructionNode } from '../nodes/generic/InstructionNode';
import { IsCaseSensitiveNode } from '../nodes/generic/IsCaseSensitiveNode';
import { IsCorrectNode } from '../nodes/generic/IsCorrectNode';
import { ItemLeadNode } from '../nodes/generic/ItemLeadNode';
import { ItemNode } from '../nodes/generic/ItemNode';
import { LeadNode } from '../nodes/generic/LeadNode';
import { PostfixNode } from '../nodes/generic/PostfixNode';
import { PrefixNode } from '../nodes/generic/PrefixNode';
import { TextNode } from '../nodes/generic/TextNode';
import { PairKeyNode } from '../nodes/pair/PairKeyNode';
import { PairNode } from '../nodes/pair/PairNode';
import { PairValueNode } from '../nodes/pair/PairValueNode';
import { PairValuesNode } from '../nodes/pair/PairValuesNode';
import { PairsNode } from '../nodes/pair/PairsNode';
import { PropertiesNode } from '../nodes/property/PropertiesNode';
import { PropertyKeyNode } from '../nodes/property/PropertyKeyNode';
import { PropertyValueNode } from '../nodes/property/PropertyValueNode';
import { PropertyValuesNode } from '../nodes/property/PropertyValuesNode';
import { AgeRangesNode } from '../nodes/property/specific/AgeRangesNode';
import { IdsNode } from '../nodes/property/specific/IdsNode';
import { LanguagesNode } from '../nodes/property/specific/LanguagesNode';
import { QuizNode } from '../nodes/quiz/QuizNode';
import { QuizzesNode } from '../nodes/quiz/QuizzesNode';
import { ResourceNode } from '../nodes/resource/ResourceNode';
import { ResponseNode } from '../nodes/response/ResponseNode';
import { ResponsesNode } from '../nodes/response/ResponsesNode';
import { SelectNode } from '../nodes/select/SelectNode';
import { SelectOptionNode } from '../nodes/select/SelectOptionNode';
import { SelectOptionsNode } from '../nodes/select/SelectOptionsNode';
import { StatementNode } from '../nodes/statement/StatementNode';
import { StatementsNode } from '../nodes/statement/StatementsNode';
import { TextFormat } from '../types/TextFormat';
import { ArticleOnlineResource } from '../types/resources/ArticleOnlineResource';
import { ResourceType } from '../types/resources/ResouceType';

import { CodeWriter } from './writer/CodeWriter';
import { TextWriter } from './writer/TextWriter';

const DEFAULT_OPTIONS: BitmarkGeneratorOptions = {
  //
};

export interface BitmarkGeneratorOptions {
  explicitTextFormat?: boolean;
}

class BitmarkMarkupGenerator extends CodeWriter {
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

  // elements

  protected on_elements_enter(_node: ElementsNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    this.writeCardDivider();
    this.writeNL();
  }

  protected on_elements_between(
    _node: ElementsNode,
    _left: AstNode,
    _right: AstNode,
    _parent: AstNode | undefined,
    _route: AstNodeInfo[],
  ): void {
    this.writeNL();
    this.writeElementDivider();
    this.writeNL();
  }

  protected on_elements_exit(_node: ElementsNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    this.writeNL();
    this.writeCardDivider();
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

  protected on_selectOption_enter(node: SelectOptionNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    if (node.isCorrect.value) {
      this.writeOPP();
    } else {
      this.writeOPM();
    }
    this.write(node.text.value);
    this.writeCL();
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

  // statements

  protected on_statements_enter(_node: StatementsNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    this.writeCardDivider();
    this.writeNL();
  }

  protected on_statements_between(
    _node: StatementsNode,
    _left: AstNode,
    _right: AstNode,
    _parent: AstNode | undefined,
    _route: AstNodeInfo[],
  ): void {
    this.writeNL();
    this.writeCardDivider();
    this.writeNL();
  }

  protected on_statements_exit(_node: StatementsNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    this.writeNL();
    this.writeCardDivider();
  }

  // statement

  protected on_statement_enter(node: StatementNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    if (node.isCorrect.value) {
      this.writeOPP();
    } else {
      this.writeOPM();
    }
    this.write(node.text.value);
    this.writeCL();
  }

  protected on_statement_between(
    _node: StatementNode,
    _left: AstNode,
    _right: AstNode,
    _parent: AstNode | undefined,
    _route: AstNodeInfo[],
  ): void {
    //
  }

  protected on_statement_exit(_node: StatementNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
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

  // quizzes

  protected on_quizzes_enter(_node: QuizzesNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    this.writeCardDivider();
    this.writeNL();
  }

  protected on_quizzes_between(
    _node: QuizzesNode,
    _left: AstNode,
    _right: AstNode,
    _parent: AstNode | undefined,
    _route: AstNodeInfo[],
  ): void {
    this.writeNL();
    this.writeCardDivider();
    this.writeNL();
  }

  protected on_quizzes_exit(_node: QuizzesNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    this.writeNL();
    this.writeCardDivider();
  }

  // quiz

  protected on_quiz_enter(_node: QuizNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    //
  }

  protected on_quiz_between(
    _node: QuizNode,
    _left: AstNode,
    _right: AstNode,
    _parent: AstNode | undefined,
    _route: AstNodeInfo[],
  ): void {
    this.writeNL();
  }

  protected on_quiz_exit(_node: QuizNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    //
  }

  // pairs

  protected on_pairs_enter(_node: PairsNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    this.writeNL();
    this.writeCardDivider();
    this.writeNL();
  }

  protected on_pairs_between(
    _node: PairsNode,
    _left: AstNode,
    _right: AstNode,
    _parent: AstNode | undefined,
    _route: AstNodeInfo[],
  ): void {
    this.writeNL();
    this.writeCardDivider();
    this.writeNL();
  }

  protected on_pairs_exit(_node: PairsNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    this.writeNL();
    this.writeCardDivider();
    this.writeNL();
  }

  // pair

  protected on_pair_enter(_node: PairNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    //
  }

  protected on_pair_between(
    _node: PairNode,
    _left: AstNode,
    _right: AstNode,
    _parent: AstNode | undefined,
    _route: AstNodeInfo[],
  ): void {
    //
  }

  protected on_pair_exit(_node: PairNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    //
  }

  // pairValues

  protected on_pairValues_enter(_node: PairValuesNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    this.writeNL();
    this.writePairKeyValueDivider();
    this.writeNL();
  }

  protected on_pairValues_between(
    _node: PairValuesNode,
    _left: AstNode,
    _right: AstNode,
    _parent: AstNode | undefined,
    _route: AstNodeInfo[],
  ): void {
    this.writeNL();
    this.writePairValueDivider();
    this.writeNL();
  }

  protected on_pairValues_exit(_node: PairValuesNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
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
    if (node.value != null) {
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

  // element

  protected on_element_enter(node: SolutionNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
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
      this.writeOPPRE();
      this.writeString(node.value);
      this.writeCL();
    }
  }

  // postfix

  protected on_postfix_enter(node: PostfixNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    if (node.value) {
      this.writeOPPOST();
      this.writeString(node.value);
      this.writeCL();
    }
  }

  // isCaseSensitive

  protected on_isCaseSensitive_enter(
    node: IsCaseSensitiveNode,
    _parent: AstNode | undefined,
    _route: AstNodeInfo[],
  ): void {
    if (node.value) {
      // Not in bitmark??
    }
  }

  // isLongAnswer

  protected on_isLongAnswer_enter(node: IsCorrectNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
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

  // pairKey

  protected on_pairKey_enter(node: PairKeyNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    if (node.value) {
      this.writeString(node.value);
    }
  }

  // pairValue

  protected on_pairValue_enter(node: PairValueNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    if (node.value) {
      this.writeString(node.value);
    }
  }

  // text

  protected on_text_enter(node: TextNode, _parent: AstNode | undefined, _route: AstNodeInfo[]): void {
    if (node.value) {
      this.writeString(node.value);
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
