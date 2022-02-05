export enum Category {
    business = 'Business',
    development = 'Development',
    community = 'Community',
    advertising = 'Advertising',
    design = 'Design',
    other = 'Other',
}

export interface HistoryItem {
    txHash: string;
    timestamp: string;
    redeemedBy?: {
        id: string;
    }
    price?: number;
    currency?: {
        symbol: string;
    }
    forSale?: boolean;
    allowedBuyer?: string;
    owner?: {
        id: string;
    }
    to?: {
        id: string;
    }
    from?: {
        id: string;
    }
}

export interface NFT {
    id: string;
    tokenId: number;
    tokenURI: string;
    owner: {
        id: string;
    }
    creator: {
        id: string;
    }
    name: string;
    description: string;
    work: string;
    availabilityFrom: number;
    availabilityTo: number;
    allowedBuyer: string;
    duration: number;
    forSale: boolean;
    redeemed: boolean;
    royaltyBasisPoints: number;
    price: number;
    currency: {
        id: string;
        symbol: string;
        decimals: number
    }
    mintTimestamp: number;
    lastPurchaseTimestamp: number;
    history: HistoryItem[];
}

export interface User {
    createdNfts: NFT[];
    ownedNfts: NFT[];
}