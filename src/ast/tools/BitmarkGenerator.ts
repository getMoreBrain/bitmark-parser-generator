import { AstNodeType } from '../AstNodeType';
import { Ast, AstNode, AstNodeInfo } from '../Ast';
import { Format } from '../types/Format';

import { CodeGenerator } from './CodeGenerator';
import { CodeWriter } from './writer/CodeWriter';
import { TextWriter } from './writer/TextWriter';

const DEFAULT_OPTIONS: BitmarkGeneratorOptions = {
  //
};

export interface BitmarkGeneratorOptions {
  explicitTextFormat?: boolean;
}

class BitmarkGenerator extends CodeWriter implements CodeGenerator {
  // TODO - make Ast class a singleton
  private ast = new Ast();
  private options: BitmarkGeneratorOptions;

  constructor(writer: TextWriter, options?: BitmarkGeneratorOptions) {
    super(writer);

    this.options = {
      ...DEFAULT_OPTIONS,
      ...options,
    };
  }

  public generate(root: AstNode): void {
    const enterNodeCallback = (node: AstNode, route: AstNodeInfo[]) => {
      switch (node.type) {
        // Non-terminal
        case AstNodeType.bitmark:
          break;
        case AstNodeType.bit:
          break;
        case AstNodeType.bitHeader:
          this.writeOPD();
          break;

        // Terminal
        case AstNodeType.type:
          this.writeString(node.value);
          break;
        case AstNodeType.format: {
          const isMinusMinus = Format.fromValue(node.value) === Format.bitmarkMinusMinus;
          const writeFormat = !isMinusMinus || this.options.explicitTextFormat;
          if (writeFormat) {
            this.writeColonString(node.value);
          }
          break;
        }
        case AstNodeType.attachmentType:
          this.writeAtString(node.value);
          break;
        case AstNodeType.text:
          this.writeString(node.value);
          break;
        default:
        // Ignore unknown node
      }
    };

    const exitNodeCallback = (node: AstNode, route: AstNodeInfo[]) => {
      switch (node.type) {
        // Non-terminal
        case AstNodeType.bitmark:
          break;
        case AstNodeType.bit:
          break;
        case AstNodeType.bitHeader:
          this.writeCL();
          this.writeNL();
          break;

        // Terminal
        case AstNodeType.type:
        case AstNodeType.format:
        case AstNodeType.attachmentType:
        case AstNodeType.text:
        default:
        // Ignore
      }
    };

    this.ast.walk(root, enterNodeCallback, exitNodeCallback);

    this.writeEndOfLine();
  }

  protected writeString(s?: string): void {
    if (s != null) this.write(s);
  }

  protected writeAtString(s?: string): void {
    if (s != null) this.write(`@${s}`);
  }

  protected writeColonString(s?: string): void {
    if (s != null) this.write(`:${s}`);
  }

  protected writeColonColonString(s?: string): void {
    if (s != null) this.write(`::${s}`);
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

  protected writeOP(): void {
    this.write('[');
  }

  protected writeCL(): void {
    this.write(']');
  }

  // protected writeAt(): void {
  //   this.write(':');
  // }

  // protected writeColon(): void {
  //   this.write(':');
  // }

  // protected writeDoubleColon(): void {
  //   this.write('::');
  // }

  protected writeNL(): void {
    this.write('\n');
  }
}

export { BitmarkGenerator };
