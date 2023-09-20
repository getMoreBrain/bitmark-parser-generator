import { BitConfig } from '../model/config/BitConfig';
import { AliasBitType, RootBitType } from '../model/enum/BitType';

import { Config } from './Config_RENAME';

class ConfigBuilder {
  build(): BitConfig {
    const config: BitConfig = Config.getBitConfig({
      root: RootBitType.example,
      alias: AliasBitType.bug,
    });

    return config;
  }
}

export { ConfigBuilder };
