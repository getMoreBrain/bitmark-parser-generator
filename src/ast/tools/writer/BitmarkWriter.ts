import { AstNodeType } from '../../AstNodeType';
import { Ast, AstNode, AstNodeInfo } from '../../Ast';

import { CodeWriter } from './CodeWriter';

class BitmarkWriter extends CodeWriter {
  // TODO - make Ast class a singleton
  private ast = new Ast();

  public writeBitmark(root: AstNode): void {
    const enterNodeCallback = (node: AstNode, route: AstNodeInfo[]) => {
      switch (node.type) {
        // Non-terminal
        case AstNodeType.bitmark:
          break;
        case AstNodeType.op:
          this.writeOP();
          break;
        case AstNodeType.opd:
          this.writeOPD();
          break;
        case AstNodeType.opa:
          this.writeOPA();
          break;

        // Terminal
        case AstNodeType.bitBitType:
        case AstNodeType.textFormat:
        case AstNodeType.text:
          this.writeString(node.value);
          break;
        case AstNodeType.nl:
          this.writeNL();
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
        case AstNodeType.op:
        case AstNodeType.opd:
        case AstNodeType.opa:
          this.writeCL();
          break;

        // Terminal
        case AstNodeType.bitBitType:
        case AstNodeType.textFormat:
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

  protected writeNL(): void {
    this.write('\n');
  }
}

export { BitmarkWriter };
