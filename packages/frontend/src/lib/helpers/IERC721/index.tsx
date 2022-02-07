import { providers } from 'ethers';
import BaseService from '../base-service';

import { IERC721Upgradeable } from './typechain/IERC721Upgradeable';
import { IERC721Upgradeable__factory } from './typechain/factory/IERC721Upgradeable__factory';

export interface IERC721ServiceInterface {
}

export class ERC721Service
    extends BaseService<IERC721Upgradeable>
    implements IERC721ServiceInterface {


    constructor(provider: providers.Provider) {
        super(provider, IERC721Upgradeable__factory);
    }


}
