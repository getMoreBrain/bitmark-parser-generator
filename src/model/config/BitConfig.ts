import { BitType, RootBitTypeType } from '../enum/BitType';
import { ExampleTypeType } from '../enum/ExampleType';
import { ResourceTagType } from '../enum/ResourceTag';

import { CardSetConfig } from './CardSetConfig';
import { TagsConfig } from './TagsConfig';

interface ToStringOptions {
  includeChains?: boolean;
  includeConfigs?: boolean;
}

class BitConfig {
  readonly rootBitType: RootBitTypeType;
  readonly tags: TagsConfig = {};
  readonly cardSet?: CardSetConfig;
  readonly deprecated?: string; // Deprecated version
  readonly bodyAllowed?: boolean; // Default: false
  readonly bodyRequired?: boolean; // Default: false
  readonly footerAllowed?: boolean; // Default: false
  readonly footerRequired?: boolean; // Default: false
  readonly resourceAttachmentAllowed?: boolean; // Default: false
  readonly rootExampleType?: ExampleTypeType;
  readonly comboResourceType?: ResourceTagType;

  public constructor(
    bitType: BitType,
    tags: TagsConfig,
    cardSet: CardSetConfig | undefined,
    deprecated: string | undefined,
    bodyAllowed: boolean | undefined,
    bodyRequired: boolean | undefined,
    footerAllowed: boolean | undefined,
    footerRequired: boolean | undefined,
    resourceAttachmentAllowed: boolean | undefined,
    rootExampleType: ExampleTypeType | undefined,
    comboResourceType: ResourceTagType | undefined,
  ) {
    this.rootBitType = bitType.root;
    this.tags = tags;
    this.cardSet = cardSet;
    this.deprecated = deprecated;
    this.bodyAllowed = bodyAllowed;
    this.bodyRequired = bodyRequired;
    this.footerAllowed = footerAllowed;
    this.footerRequired = footerRequired;
    this.resourceAttachmentAllowed = resourceAttachmentAllowed;
    this.rootExampleType = rootExampleType;
    this.comboResourceType = comboResourceType;
  }

  public toString(options?: ToStringOptions): string {
    const opts = Object.assign({}, options);

    let s = `[Bit]\n${this.rootBitType}`;

    // Flags
    const flags: string[] = [];
    if (this.deprecated != null) flags.push(`deprecated=${this.deprecated}`);
    if (this.bodyAllowed) flags.push('bodyAllowed');
    if (this.bodyRequired) flags.push('bodyRequired');
    if (this.footerAllowed) flags.push('footerAllowed');
    if (this.footerRequired) flags.push('footerRequired');
    if (this.resourceAttachmentAllowed) flags.push('resourceAttachmentAllowed');
    if (this.rootExampleType != null) flags.push(`rootExampleType=${this.rootExampleType}`);
    if (this.rootExampleType != null) flags.push(`comboResourceType=${this.comboResourceType}`);
    s += `\n\n[Flags]\n${flags.join(', ')}`;

    // Tags
    s += `\n\n[Tags]`;

    for (const tag of Object.values(this.tags)) {
      s += `\n${tag.toString(opts)}`;
    }

    // Cards
    if (this.cardSet) {
      s += `\n\n${this.cardSet.toString(opts)}`;
    }

    return s;
  }
}

export { BitConfig };
