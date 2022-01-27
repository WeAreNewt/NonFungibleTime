import { utils } from 'ethers';
import { matic } from './assets';

// https://eips.ethereum.org/EIPS/eip-3085
export interface AddEthereumChainParameter {
  chainId: string;
  blockExplorerUrls?: string[];
  chainName?: string;
  iconUrls?: string[];
  nativeCurrency?: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls?: string[];
}

// https://chainlist.org/
export const Networks = {
  POLYGON_MAINNET: 137,
  PfOLYGON_MUMBAI: 80001,
};

export const addChainParameters: Record<number, AddEthereumChainParameter> = {
  [Networks.POLYGON_MAINNET]: {
    chainId: utils.hexValue(Networks.POLYGON_MAINNET),
    blockExplorerUrls: ['https://polygon-rpc.com/'],
    rpcUrls: ['https://polygon-rpc.com/'],
    chainName: 'Polygon Mainnet',
    nativeCurrency: {
      name: matic.name,
      symbol: matic.symbol,
      decimals: matic.decimals,
    },
  },
};
