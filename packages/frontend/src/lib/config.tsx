import { utils } from 'ethers';

export enum ChainId {
    mumbai = 80001,
    polygon = 137,
}

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

export interface NetworkConfig extends AddEthereumChainParameter {
    subgraphHttpLink: string;
    subgraphWsLink: string;
    collectionAddress: string;
    blockExplorer: string;
}

export class Matic {
    readonly name = 'Matic' as const;
    readonly decimals = 18 as const;
    readonly symbol = 'MATIC';
}

export const matic = new Matic();

export const addChainParameters: Record<number, AddEthereumChainParameter> = {
    [ChainId.mumbai]: {
        rpcUrls: ['https://polygon-mumbai.g.alchemy.com/v2/demo', 'https://matic-mumbai.chainstacklabs.com', 'https://rpc-mumbai.maticvigil.com'],
        chainId: utils.hexValue(ChainId.mumbai),
        blockExplorerUrls: ['https://explorer-mumbai.maticvigil.com'],
        chainName: 'Polygon Mainnet',
        nativeCurrency: {
            name: matic.name,
            symbol: matic.symbol,
            decimals: matic.decimals,
        },
    },
    [ChainId.polygon]: {
        chainId: utils.hexValue(ChainId.polygon),
        blockExplorerUrls: ['https://polygonscan.com'],
        rpcUrls: ['https://polygon-rpc.com/'],
        chainName: 'Polygon Mainnet',
        nativeCurrency: {
            name: matic.name,
            symbol: matic.symbol,
            decimals: matic.decimals,
        },
    },
};

export const networkConfigs: Record<number, NetworkConfig> = {
    [ChainId.mumbai]: {
        subgraphHttpLink: 'https://api.thegraph.com/subgraphs/name/wearenewt/non-fungible-time-mumbai',
        subgraphWsLink: 'wss://api.thegraph.com/subgraphs/name/wearenewt/non-fungible-time-mumbai',
        collectionAddress: '0x4ECe6a51321B9F1B9FEc33A98f0513A7B626BFB4',
        blockExplorer: 'https://explorer-mumbai.maticvigil.com',
        ...addChainParameters[ChainId.mumbai],
    },
    [ChainId.polygon]: {
        subgraphHttpLink: 'https://api.thegraph.com/subgraphs/name/wearenewt/non-fungible-time-polygon',
        subgraphWsLink: 'wss://api.thegraph.com/subgraphs/name/wearenewt/non-fungible-time-polygon',
        collectionAddress: '',
        blockExplorer: 'https://polygon-rpc.com/',
        ...addChainParameters[ChainId.polygon],
    },
};
