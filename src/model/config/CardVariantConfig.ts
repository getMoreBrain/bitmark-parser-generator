import { type CountType } from '../enum/Count.ts';
import { type TagsConfig } from './TagsConfig.ts';

interface ToStringOptions {
  includeChains?: boolean;
  includeConfigs?: boolean;
}

class CardVariantConfig {
  tags: TagsConfig;
  bodyAllowed?: boolean; // Default: true
  bodyRequired?: boolean; // Default: false
  repeatCount?: CountType; // Default: 1

  public constructor(
    tags: TagsConfig,
    bodyAllowed?: boolean,
    bodyRequired?: boolean,
    repeatCount?: CountType,
  ) {
    this.tags = tags;
    this.bodyAllowed = bodyAllowed == null ? true : bodyAllowed;
    this.bodyRequired = bodyRequired;
    this.repeatCount = repeatCount;
  }

  public toString(options?: ToStringOptions): string {
    const opts = Object.assign({}, options);

    let s = '';

    // Flags
    const flags: string[] = [];
    if (this.bodyAllowed) flags.push('bodyAllowed');
    if (this.bodyRequired) flags.push('bodyRequired');
    if (this.repeatCount != null) flags.push(`repeatCount=${this.repeatCount}`);
    s += `[Flags]\n${flags.join(', ')}`;

    // Tags
    s += `\n\n[Tags]`;

    for (const tag of Object.values(this.tags)) {
      s += `\n${tag.toString(opts)}`;
    }

    return s;
  }
}

export { CardVariantConfig };
