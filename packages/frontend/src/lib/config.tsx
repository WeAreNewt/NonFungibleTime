import { utils } from 'ethers';

export enum ChainId {
    mumbai = 80001,
    polygon = 137,
    mainnet = 1,
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

export class ETH {
    readonly name = 'ETH' as const;
    readonly decimals = 18 as const;
    readonly symbol = 'ETH';
}

export const matic = new Matic();
export const eth = new ETH();

export const addChainParameters: Record<number, AddEthereumChainParameter> = {
    [ChainId.mainnet]: {
        rpcUrls: ['https://cloudflare-eth.com', 'https://rpc.flashbots.net'],
        chainId: utils.hexValue(ChainId.mainnet),
        blockExplorerUrls: ['https://etherscan.io'],
        chainName: 'Ethereum Mainnet',
        nativeCurrency: {
            name: eth.name,
            symbol: eth.symbol,
            decimals: eth.decimals,
        },
    },
    [ChainId.mumbai]: {
        rpcUrls: ['https://polygon-mumbai.g.alchemy.com/v2/demo', 'https://matic-mumbai.chainstacklabs.com'],
        chainId: utils.hexValue(ChainId.mumbai),
        blockExplorerUrls: ['https://explorer-mumbai.maticvigil.com'],
        chainName: 'Mumbai Testnet',
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
    [ChainId.mainnet]: {
        subgraphHttpLink: '',
        subgraphWsLink: '',
        collectionAddress: '',
        blockExplorer: 'https://etherscan.io',
        ...addChainParameters[ChainId.mainnet],
    },
    [ChainId.mumbai]: {
        subgraphHttpLink: 'https://api.thegraph.com/subgraphs/name/wearenewt/non-fungible-time-mumbai',
        subgraphWsLink: 'wss://api.thegraph.com/subgraphs/name/wearenewt/non-fungible-time-mumbai',
        collectionAddress: '0x563b189cc2bc69b86716211d76fd5efdcb8f40ad',
        blockExplorer: 'https://explorer-mumbai.maticvigil.com',
        ...addChainParameters[ChainId.mumbai],
    },
    [ChainId.polygon]: {
        subgraphHttpLink: 'https://api.thegraph.com/subgraphs/name/wearenewt/non-fungible-time-polygon',
        subgraphWsLink: 'wss://api.thegraph.com/subgraphs/name/wearenewt/non-fungible-time-polygon',
        collectionAddress: '0x6A9ab6e747699fB80E53B21b3baB24EE840fD1Ff',
        blockExplorer: 'https://polygonscan.com',
        ...addChainParameters[ChainId.polygon],
    },
};
