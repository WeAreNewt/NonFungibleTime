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
  other = 'Other'
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

// TRM

export enum RiskSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  SEVERE = 'SEVERE',
}

export type RiskIndicatorType = {
  trmRuleId: string; // 'TRM1003';
  severity: string; // HIGH';
  category: string; // 'Anti-Money Laundering';
  description: string; // 'Used for Terrorism Financing.';
};

export type TRMEntityType = {
  id: string; // '980';
  name: string; // 'SamSam Ransomware';
  categories: string[]; // ['Ransomware', 'Sanctions'];
};

export type TRMScreeningType = {
  address: string; // '149w62rY42aZBox8fGcmqNsXUzSStKeq8C';
  blockchain: string; // 'bitcoin';
  asset: string; // 'BTC';
  riskScore: string; // 'HIGH';
  riskIndicators: RiskIndicatorType[];
  entities: TRMEntityType[];
};
