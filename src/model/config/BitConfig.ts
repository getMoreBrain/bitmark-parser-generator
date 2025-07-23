import { type BitTypeType } from '../enum/BitType.ts';
import { Count } from '../enum/Count.ts';
import { type ExampleTypeType } from '../enum/ExampleType.ts';
import { type TextFormatType } from '../enum/TextFormat.ts';
import { CardSetConfig } from './CardSetConfig.ts';
import type { ConfigKeyType } from './enum/ConfigKey.ts';
import { type TagsConfig } from './TagsConfig.ts';

interface ToStringOptions {
  includeChains?: boolean;
  includeConfigs?: boolean;
}

class BitConfig {
  readonly since: string; // Supported since version
  readonly bitType: BitTypeType;
  readonly inheritedBitTypes: BitTypeType[]; // Bit inheritance tree (array for order)
  readonly inheritedBitTypesSet: Set<BitTypeType>; // Bit inheritance tree (set for faster lookup)
  readonly textFormatDefault: TextFormatType; // Default text format
  readonly tags: TagsConfig = {};
  readonly cardSet?: CardSetConfig;
  readonly quizBit?: boolean; // True if the bit is a quiz bit
  readonly deprecated?: string; // Deprecated version
  readonly bodyAllowed?: boolean; // Default: true
  readonly bodyRequired?: boolean; // Default: false
  readonly footerAllowed?: boolean; // Default: true
  readonly footerRequired?: boolean; // Default: false
  readonly resourceAttachmentAllowed?: boolean; // Default: true
  readonly rootExampleType?: ExampleTypeType;
  readonly comboResourceConfigKey?: ConfigKeyType;

  public constructor(config: {
    since: string;
    bitType: BitTypeType;
    inheritedBitTypes: BitTypeType[];
    textFormatDefault: TextFormatType;
    tags: TagsConfig;
    cardSet: CardSetConfig | undefined;
    quizBit: boolean | undefined;
    deprecated: string | undefined;
    bodyAllowed: boolean | undefined;
    bodyRequired: boolean | undefined;
    footerAllowed: boolean | undefined;
    footerRequired: boolean | undefined;
    resourceAttachmentAllowed: boolean | undefined;
    rootExampleType: ExampleTypeType | undefined;
    comboResourceConfigKey: ConfigKeyType | undefined;
  }) {
    const {
      since,
      bitType,
      inheritedBitTypes,
      textFormatDefault,
      tags,
      cardSet,
      quizBit,
      deprecated,
      bodyAllowed,
      bodyRequired,
      footerAllowed,
      footerRequired,
      resourceAttachmentAllowed,
      rootExampleType,
      comboResourceConfigKey,
    } = config;
    this.since = since;
    this.bitType = bitType;
    this.inheritedBitTypes = inheritedBitTypes;
    this.inheritedBitTypesSet = new Set(inheritedBitTypes);
    this.textFormatDefault = textFormatDefault;
    this.tags = tags;
    this.cardSet = cardSet;
    this.quizBit = quizBit;
    this.deprecated = deprecated;
    this.bodyAllowed = bodyAllowed == null ? true : bodyAllowed;
    this.bodyRequired = bodyRequired;
    this.footerAllowed = footerAllowed == null ? true : footerAllowed;
    this.footerRequired = footerRequired;
    this.resourceAttachmentAllowed =
      resourceAttachmentAllowed == null ? true : resourceAttachmentAllowed;
    this.rootExampleType = rootExampleType;
    this.comboResourceConfigKey = comboResourceConfigKey;
  }

  public toString(options?: ToStringOptions): string {
    const opts = Object.assign({}, options);

    let s = `[Bit]\n${this.bitType}`;

    // Aliases
    if (this.inheritedBitTypes.length > 0) {
      s += `\n\n[Inheritance]`;

      s += `\n${this.inheritedBitTypes.join(' => ')}`;
    }

    // Default text format
    s += `\n\n[Default text format]\n${this.textFormatDefault}`;

    // Flags
    const flags: string[] = [];
    if (this.since != null) flags.push(`since=${this.since}`);
    if (this.deprecated != null) flags.push(`deprecated=${this.deprecated}`);
    if (this.bodyAllowed) flags.push('bodyAllowed');
    if (this.bodyRequired) flags.push('bodyRequired');
    if (this.footerAllowed) flags.push('footerAllowed');
    if (this.footerRequired) flags.push('footerRequired');
    if (this.resourceAttachmentAllowed) flags.push('resourceAttachmentAllowed');
    if (this.rootExampleType != null) flags.push(`rootExampleType=${this.rootExampleType}`);
    if (this.comboResourceConfigKey != null)
      flags.push(`comboResourceConfigKey=${this.comboResourceConfigKey}`);
    s += `\n\n[Flags]\n${flags.join(', ')}`;

    // Tags
    s += `\n\n[Tags]`;

    for (const tag of Object.values(this.tags)) {
      if (tag.maxCount === Count.infinity || tag.maxCount > 0) {
        s += `\n${tag.toString(opts)}`;
      }
    }

    // Cards
    if (this.cardSet) {
      s += `\n\n${this.cardSet.toString(opts)}`;
    }

    return s;
  }
}

export { BitConfig };
