import { PaymentToken } from './lib/graphql';

export enum Category {
  graphics = 'Graphics & Design',
  music = 'Music & Audio',
  programming = 'Programming & Tech',
  marketing = 'Digital Marketing',
  data = 'Data',
  writing = 'Writing & Translation',
  business = 'Business',
  lessons = 'Lessons',
  video = 'Video & Animation',
}

export interface HistoryItem {
  txHash: string;
  timestamp: string;
  redeemedBy?: {
    id: string;
  };
  price?: number;
  currency?: {
    symbol: string;
  };
  forSale?: boolean;
  allowedBuyer?: string;
  owner?: {
    id: string;
  };
  to?: {
    id: string;
  };
  from?: {
    id: string;
  };
}

export interface NFT {
  id: string;
  tokenId: number;
  tokenURI: string;
  owner: {
    id: string;
  };
  creator: {
    id: string;
  };
  name: string;
  description: string;
  category: string;
  availabilityFrom: number;
  availabilityTo: number;
  allowedBuyer: string;
  duration: number;
  forSale: boolean;
  redeemed: boolean;
  royaltyBasisPoints: number;
  price: number;
  currency: PaymentToken;
  mintTimestamp: number;
  lastPurchaseTimestamp: number;
  history: HistoryItem[];
}

export interface User {
  createdNfts: NFT[];
  ownedNfts: NFT[];
}
