import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: any;
  BigInt: any;
  Bytes: any;
};

export type Block_Height = {
  hash?: InputMaybe<Scalars['Bytes']>;
  number?: InputMaybe<Scalars['Int']>;
  number_gte?: InputMaybe<Scalars['Int']>;
};

export type BuyingConditionChange = NftStatusChange & {
  __typename?: 'BuyingConditionChange';
  allowedBuyer: Scalars['String'];
  blockNumber: Scalars['BigInt'];
  currency: PaymentToken;
  forSale: Scalars['Boolean'];
  id: Scalars['ID'];
  nft: Nft;
  owner: User;
  price: Scalars['BigInt'];
  timestamp: Scalars['BigInt'];
  txHash: Scalars['String'];
};

export type BuyingConditionChange_Filter = {
  allowedBuyer?: InputMaybe<Scalars['String']>;
  allowedBuyer_contains?: InputMaybe<Scalars['String']>;
  allowedBuyer_ends_with?: InputMaybe<Scalars['String']>;
  allowedBuyer_gt?: InputMaybe<Scalars['String']>;
  allowedBuyer_gte?: InputMaybe<Scalars['String']>;
  allowedBuyer_in?: InputMaybe<Array<Scalars['String']>>;
  allowedBuyer_lt?: InputMaybe<Scalars['String']>;
  allowedBuyer_lte?: InputMaybe<Scalars['String']>;
  allowedBuyer_not?: InputMaybe<Scalars['String']>;
  allowedBuyer_not_contains?: InputMaybe<Scalars['String']>;
  allowedBuyer_not_ends_with?: InputMaybe<Scalars['String']>;
  allowedBuyer_not_in?: InputMaybe<Array<Scalars['String']>>;
  allowedBuyer_not_starts_with?: InputMaybe<Scalars['String']>;
  allowedBuyer_starts_with?: InputMaybe<Scalars['String']>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  currency?: InputMaybe<Scalars['String']>;
  currency_contains?: InputMaybe<Scalars['String']>;
  currency_ends_with?: InputMaybe<Scalars['String']>;
  currency_gt?: InputMaybe<Scalars['String']>;
  currency_gte?: InputMaybe<Scalars['String']>;
  currency_in?: InputMaybe<Array<Scalars['String']>>;
  currency_lt?: InputMaybe<Scalars['String']>;
  currency_lte?: InputMaybe<Scalars['String']>;
  currency_not?: InputMaybe<Scalars['String']>;
  currency_not_contains?: InputMaybe<Scalars['String']>;
  currency_not_ends_with?: InputMaybe<Scalars['String']>;
  currency_not_in?: InputMaybe<Array<Scalars['String']>>;
  currency_not_starts_with?: InputMaybe<Scalars['String']>;
  currency_starts_with?: InputMaybe<Scalars['String']>;
  forSale?: InputMaybe<Scalars['Boolean']>;
  forSale_in?: InputMaybe<Array<Scalars['Boolean']>>;
  forSale_not?: InputMaybe<Scalars['Boolean']>;
  forSale_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  nft?: InputMaybe<Scalars['String']>;
  nft_contains?: InputMaybe<Scalars['String']>;
  nft_ends_with?: InputMaybe<Scalars['String']>;
  nft_gt?: InputMaybe<Scalars['String']>;
  nft_gte?: InputMaybe<Scalars['String']>;
  nft_in?: InputMaybe<Array<Scalars['String']>>;
  nft_lt?: InputMaybe<Scalars['String']>;
  nft_lte?: InputMaybe<Scalars['String']>;
  nft_not?: InputMaybe<Scalars['String']>;
  nft_not_contains?: InputMaybe<Scalars['String']>;
  nft_not_ends_with?: InputMaybe<Scalars['String']>;
  nft_not_in?: InputMaybe<Array<Scalars['String']>>;
  nft_not_starts_with?: InputMaybe<Scalars['String']>;
  nft_starts_with?: InputMaybe<Scalars['String']>;
  owner?: InputMaybe<Scalars['String']>;
  owner_contains?: InputMaybe<Scalars['String']>;
  owner_ends_with?: InputMaybe<Scalars['String']>;
  owner_gt?: InputMaybe<Scalars['String']>;
  owner_gte?: InputMaybe<Scalars['String']>;
  owner_in?: InputMaybe<Array<Scalars['String']>>;
  owner_lt?: InputMaybe<Scalars['String']>;
  owner_lte?: InputMaybe<Scalars['String']>;
  owner_not?: InputMaybe<Scalars['String']>;
  owner_not_contains?: InputMaybe<Scalars['String']>;
  owner_not_ends_with?: InputMaybe<Scalars['String']>;
  owner_not_in?: InputMaybe<Array<Scalars['String']>>;
  owner_not_starts_with?: InputMaybe<Scalars['String']>;
  owner_starts_with?: InputMaybe<Scalars['String']>;
  price?: InputMaybe<Scalars['BigInt']>;
  price_gt?: InputMaybe<Scalars['BigInt']>;
  price_gte?: InputMaybe<Scalars['BigInt']>;
  price_in?: InputMaybe<Array<Scalars['BigInt']>>;
  price_lt?: InputMaybe<Scalars['BigInt']>;
  price_lte?: InputMaybe<Scalars['BigInt']>;
  price_not?: InputMaybe<Scalars['BigInt']>;
  price_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txHash?: InputMaybe<Scalars['String']>;
  txHash_contains?: InputMaybe<Scalars['String']>;
  txHash_ends_with?: InputMaybe<Scalars['String']>;
  txHash_gt?: InputMaybe<Scalars['String']>;
  txHash_gte?: InputMaybe<Scalars['String']>;
  txHash_in?: InputMaybe<Array<Scalars['String']>>;
  txHash_lt?: InputMaybe<Scalars['String']>;
  txHash_lte?: InputMaybe<Scalars['String']>;
  txHash_not?: InputMaybe<Scalars['String']>;
  txHash_not_contains?: InputMaybe<Scalars['String']>;
  txHash_not_ends_with?: InputMaybe<Scalars['String']>;
  txHash_not_in?: InputMaybe<Array<Scalars['String']>>;
  txHash_not_starts_with?: InputMaybe<Scalars['String']>;
  txHash_starts_with?: InputMaybe<Scalars['String']>;
};

export enum BuyingConditionChange_OrderBy {
  AllowedBuyer = 'allowedBuyer',
  BlockNumber = 'blockNumber',
  Currency = 'currency',
  ForSale = 'forSale',
  Id = 'id',
  Nft = 'nft',
  Owner = 'owner',
  Price = 'price',
  Timestamp = 'timestamp',
  TxHash = 'txHash'
}

export enum EventType {
  BuyingConditionChange = 'BuyingConditionChange',
  Redeem = 'Redeem',
  Sale = 'Sale',
  Transfer = 'Transfer'
}

export type Nft = {
  __typename?: 'Nft';
  /** nft creator can restrict buyer to a single address */
  allowedBuyer: Scalars['String'];
  availabilityFrom: Scalars['BigInt'];
  availabilityTo: Scalars['BigInt'];
  category: Scalars['String'];
  contractAddress: Scalars['String'];
  creator: User;
  currency: PaymentToken;
  description: Scalars['String'];
  /** number of hours */
  duration: Scalars['BigInt'];
  forSale: Scalars['Boolean'];
  history: Array<NftStatusChange>;
  id: Scalars['ID'];
  lastPurchaseTimestamp: Scalars['Int'];
  mintTimestamp: Scalars['Int'];
  name: Scalars['String'];
  owner: User;
  price: Scalars['BigInt'];
  redeemed: Scalars['Boolean'];
  /** out of 10000 */
  royaltyBasisPoints: Scalars['BigInt'];
  royaltyReceiver: User;
  tokenId: Scalars['BigInt'];
  tokenURI: Scalars['String'];
};


export type NftHistoryArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<NftStatusChange_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<NftStatusChange_Filter>;
};

export type NftStatusChange = {
  blockNumber: Scalars['BigInt'];
  id: Scalars['ID'];
  nft: Nft;
  timestamp: Scalars['BigInt'];
  txHash: Scalars['String'];
};

export type NftStatusChange_Filter = {
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  nft?: InputMaybe<Scalars['String']>;
  nft_contains?: InputMaybe<Scalars['String']>;
  nft_ends_with?: InputMaybe<Scalars['String']>;
  nft_gt?: InputMaybe<Scalars['String']>;
  nft_gte?: InputMaybe<Scalars['String']>;
  nft_in?: InputMaybe<Array<Scalars['String']>>;
  nft_lt?: InputMaybe<Scalars['String']>;
  nft_lte?: InputMaybe<Scalars['String']>;
  nft_not?: InputMaybe<Scalars['String']>;
  nft_not_contains?: InputMaybe<Scalars['String']>;
  nft_not_ends_with?: InputMaybe<Scalars['String']>;
  nft_not_in?: InputMaybe<Array<Scalars['String']>>;
  nft_not_starts_with?: InputMaybe<Scalars['String']>;
  nft_starts_with?: InputMaybe<Scalars['String']>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txHash?: InputMaybe<Scalars['String']>;
  txHash_contains?: InputMaybe<Scalars['String']>;
  txHash_ends_with?: InputMaybe<Scalars['String']>;
  txHash_gt?: InputMaybe<Scalars['String']>;
  txHash_gte?: InputMaybe<Scalars['String']>;
  txHash_in?: InputMaybe<Array<Scalars['String']>>;
  txHash_lt?: InputMaybe<Scalars['String']>;
  txHash_lte?: InputMaybe<Scalars['String']>;
  txHash_not?: InputMaybe<Scalars['String']>;
  txHash_not_contains?: InputMaybe<Scalars['String']>;
  txHash_not_ends_with?: InputMaybe<Scalars['String']>;
  txHash_not_in?: InputMaybe<Array<Scalars['String']>>;
  txHash_not_starts_with?: InputMaybe<Scalars['String']>;
  txHash_starts_with?: InputMaybe<Scalars['String']>;
};

export enum NftStatusChange_OrderBy {
  BlockNumber = 'blockNumber',
  Id = 'id',
  Nft = 'nft',
  Timestamp = 'timestamp',
  TxHash = 'txHash'
}

export type Nft_Filter = {
  allowedBuyer?: InputMaybe<Scalars['String']>;
  allowedBuyer_contains?: InputMaybe<Scalars['String']>;
  allowedBuyer_ends_with?: InputMaybe<Scalars['String']>;
  allowedBuyer_gt?: InputMaybe<Scalars['String']>;
  allowedBuyer_gte?: InputMaybe<Scalars['String']>;
  allowedBuyer_in?: InputMaybe<Array<Scalars['String']>>;
  allowedBuyer_lt?: InputMaybe<Scalars['String']>;
  allowedBuyer_lte?: InputMaybe<Scalars['String']>;
  allowedBuyer_not?: InputMaybe<Scalars['String']>;
  allowedBuyer_not_contains?: InputMaybe<Scalars['String']>;
  allowedBuyer_not_ends_with?: InputMaybe<Scalars['String']>;
  allowedBuyer_not_in?: InputMaybe<Array<Scalars['String']>>;
  allowedBuyer_not_starts_with?: InputMaybe<Scalars['String']>;
  allowedBuyer_starts_with?: InputMaybe<Scalars['String']>;
  availabilityFrom?: InputMaybe<Scalars['BigInt']>;
  availabilityFrom_gt?: InputMaybe<Scalars['BigInt']>;
  availabilityFrom_gte?: InputMaybe<Scalars['BigInt']>;
  availabilityFrom_in?: InputMaybe<Array<Scalars['BigInt']>>;
  availabilityFrom_lt?: InputMaybe<Scalars['BigInt']>;
  availabilityFrom_lte?: InputMaybe<Scalars['BigInt']>;
  availabilityFrom_not?: InputMaybe<Scalars['BigInt']>;
  availabilityFrom_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  availabilityTo?: InputMaybe<Scalars['BigInt']>;
  availabilityTo_gt?: InputMaybe<Scalars['BigInt']>;
  availabilityTo_gte?: InputMaybe<Scalars['BigInt']>;
  availabilityTo_in?: InputMaybe<Array<Scalars['BigInt']>>;
  availabilityTo_lt?: InputMaybe<Scalars['BigInt']>;
  availabilityTo_lte?: InputMaybe<Scalars['BigInt']>;
  availabilityTo_not?: InputMaybe<Scalars['BigInt']>;
  availabilityTo_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  category?: InputMaybe<Scalars['String']>;
  category_contains?: InputMaybe<Scalars['String']>;
  category_ends_with?: InputMaybe<Scalars['String']>;
  category_gt?: InputMaybe<Scalars['String']>;
  category_gte?: InputMaybe<Scalars['String']>;
  category_in?: InputMaybe<Array<Scalars['String']>>;
  category_lt?: InputMaybe<Scalars['String']>;
  category_lte?: InputMaybe<Scalars['String']>;
  category_not?: InputMaybe<Scalars['String']>;
  category_not_contains?: InputMaybe<Scalars['String']>;
  category_not_ends_with?: InputMaybe<Scalars['String']>;
  category_not_in?: InputMaybe<Array<Scalars['String']>>;
  category_not_starts_with?: InputMaybe<Scalars['String']>;
  category_starts_with?: InputMaybe<Scalars['String']>;
  contractAddress?: InputMaybe<Scalars['String']>;
  contractAddress_contains?: InputMaybe<Scalars['String']>;
  contractAddress_ends_with?: InputMaybe<Scalars['String']>;
  contractAddress_gt?: InputMaybe<Scalars['String']>;
  contractAddress_gte?: InputMaybe<Scalars['String']>;
  contractAddress_in?: InputMaybe<Array<Scalars['String']>>;
  contractAddress_lt?: InputMaybe<Scalars['String']>;
  contractAddress_lte?: InputMaybe<Scalars['String']>;
  contractAddress_not?: InputMaybe<Scalars['String']>;
  contractAddress_not_contains?: InputMaybe<Scalars['String']>;
  contractAddress_not_ends_with?: InputMaybe<Scalars['String']>;
  contractAddress_not_in?: InputMaybe<Array<Scalars['String']>>;
  contractAddress_not_starts_with?: InputMaybe<Scalars['String']>;
  contractAddress_starts_with?: InputMaybe<Scalars['String']>;
  creator?: InputMaybe<Scalars['String']>;
  creator_contains?: InputMaybe<Scalars['String']>;
  creator_ends_with?: InputMaybe<Scalars['String']>;
  creator_gt?: InputMaybe<Scalars['String']>;
  creator_gte?: InputMaybe<Scalars['String']>;
  creator_in?: InputMaybe<Array<Scalars['String']>>;
  creator_lt?: InputMaybe<Scalars['String']>;
  creator_lte?: InputMaybe<Scalars['String']>;
  creator_not?: InputMaybe<Scalars['String']>;
  creator_not_contains?: InputMaybe<Scalars['String']>;
  creator_not_ends_with?: InputMaybe<Scalars['String']>;
  creator_not_in?: InputMaybe<Array<Scalars['String']>>;
  creator_not_starts_with?: InputMaybe<Scalars['String']>;
  creator_starts_with?: InputMaybe<Scalars['String']>;
  currency?: InputMaybe<Scalars['String']>;
  currency_contains?: InputMaybe<Scalars['String']>;
  currency_ends_with?: InputMaybe<Scalars['String']>;
  currency_gt?: InputMaybe<Scalars['String']>;
  currency_gte?: InputMaybe<Scalars['String']>;
  currency_in?: InputMaybe<Array<Scalars['String']>>;
  currency_lt?: InputMaybe<Scalars['String']>;
  currency_lte?: InputMaybe<Scalars['String']>;
  currency_not?: InputMaybe<Scalars['String']>;
  currency_not_contains?: InputMaybe<Scalars['String']>;
  currency_not_ends_with?: InputMaybe<Scalars['String']>;
  currency_not_in?: InputMaybe<Array<Scalars['String']>>;
  currency_not_starts_with?: InputMaybe<Scalars['String']>;
  currency_starts_with?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  description_contains?: InputMaybe<Scalars['String']>;
  description_ends_with?: InputMaybe<Scalars['String']>;
  description_gt?: InputMaybe<Scalars['String']>;
  description_gte?: InputMaybe<Scalars['String']>;
  description_in?: InputMaybe<Array<Scalars['String']>>;
  description_lt?: InputMaybe<Scalars['String']>;
  description_lte?: InputMaybe<Scalars['String']>;
  description_not?: InputMaybe<Scalars['String']>;
  description_not_contains?: InputMaybe<Scalars['String']>;
  description_not_ends_with?: InputMaybe<Scalars['String']>;
  description_not_in?: InputMaybe<Array<Scalars['String']>>;
  description_not_starts_with?: InputMaybe<Scalars['String']>;
  description_starts_with?: InputMaybe<Scalars['String']>;
  duration?: InputMaybe<Scalars['BigInt']>;
  duration_gt?: InputMaybe<Scalars['BigInt']>;
  duration_gte?: InputMaybe<Scalars['BigInt']>;
  duration_in?: InputMaybe<Array<Scalars['BigInt']>>;
  duration_lt?: InputMaybe<Scalars['BigInt']>;
  duration_lte?: InputMaybe<Scalars['BigInt']>;
  duration_not?: InputMaybe<Scalars['BigInt']>;
  duration_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  forSale?: InputMaybe<Scalars['Boolean']>;
  forSale_in?: InputMaybe<Array<Scalars['Boolean']>>;
  forSale_not?: InputMaybe<Scalars['Boolean']>;
  forSale_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  lastPurchaseTimestamp?: InputMaybe<Scalars['Int']>;
  lastPurchaseTimestamp_gt?: InputMaybe<Scalars['Int']>;
  lastPurchaseTimestamp_gte?: InputMaybe<Scalars['Int']>;
  lastPurchaseTimestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  lastPurchaseTimestamp_lt?: InputMaybe<Scalars['Int']>;
  lastPurchaseTimestamp_lte?: InputMaybe<Scalars['Int']>;
  lastPurchaseTimestamp_not?: InputMaybe<Scalars['Int']>;
  lastPurchaseTimestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  mintTimestamp?: InputMaybe<Scalars['Int']>;
  mintTimestamp_gt?: InputMaybe<Scalars['Int']>;
  mintTimestamp_gte?: InputMaybe<Scalars['Int']>;
  mintTimestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  mintTimestamp_lt?: InputMaybe<Scalars['Int']>;
  mintTimestamp_lte?: InputMaybe<Scalars['Int']>;
  mintTimestamp_not?: InputMaybe<Scalars['Int']>;
  mintTimestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  name?: InputMaybe<Scalars['String']>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_ends_with?: InputMaybe<Scalars['String']>;
  name_gt?: InputMaybe<Scalars['String']>;
  name_gte?: InputMaybe<Scalars['String']>;
  name_in?: InputMaybe<Array<Scalars['String']>>;
  name_lt?: InputMaybe<Scalars['String']>;
  name_lte?: InputMaybe<Scalars['String']>;
  name_not?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_not_ends_with?: InputMaybe<Scalars['String']>;
  name_not_in?: InputMaybe<Array<Scalars['String']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']>;
  name_starts_with?: InputMaybe<Scalars['String']>;
  owner?: InputMaybe<Scalars['String']>;
  owner_contains?: InputMaybe<Scalars['String']>;
  owner_ends_with?: InputMaybe<Scalars['String']>;
  owner_gt?: InputMaybe<Scalars['String']>;
  owner_gte?: InputMaybe<Scalars['String']>;
  owner_in?: InputMaybe<Array<Scalars['String']>>;
  owner_lt?: InputMaybe<Scalars['String']>;
  owner_lte?: InputMaybe<Scalars['String']>;
  owner_not?: InputMaybe<Scalars['String']>;
  owner_not_contains?: InputMaybe<Scalars['String']>;
  owner_not_ends_with?: InputMaybe<Scalars['String']>;
  owner_not_in?: InputMaybe<Array<Scalars['String']>>;
  owner_not_starts_with?: InputMaybe<Scalars['String']>;
  owner_starts_with?: InputMaybe<Scalars['String']>;
  price?: InputMaybe<Scalars['BigInt']>;
  price_gt?: InputMaybe<Scalars['BigInt']>;
  price_gte?: InputMaybe<Scalars['BigInt']>;
  price_in?: InputMaybe<Array<Scalars['BigInt']>>;
  price_lt?: InputMaybe<Scalars['BigInt']>;
  price_lte?: InputMaybe<Scalars['BigInt']>;
  price_not?: InputMaybe<Scalars['BigInt']>;
  price_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  redeemed?: InputMaybe<Scalars['Boolean']>;
  redeemed_in?: InputMaybe<Array<Scalars['Boolean']>>;
  redeemed_not?: InputMaybe<Scalars['Boolean']>;
  redeemed_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  royaltyBasisPoints?: InputMaybe<Scalars['BigInt']>;
  royaltyBasisPoints_gt?: InputMaybe<Scalars['BigInt']>;
  royaltyBasisPoints_gte?: InputMaybe<Scalars['BigInt']>;
  royaltyBasisPoints_in?: InputMaybe<Array<Scalars['BigInt']>>;
  royaltyBasisPoints_lt?: InputMaybe<Scalars['BigInt']>;
  royaltyBasisPoints_lte?: InputMaybe<Scalars['BigInt']>;
  royaltyBasisPoints_not?: InputMaybe<Scalars['BigInt']>;
  royaltyBasisPoints_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  royaltyReceiver?: InputMaybe<Scalars['String']>;
  royaltyReceiver_contains?: InputMaybe<Scalars['String']>;
  royaltyReceiver_ends_with?: InputMaybe<Scalars['String']>;
  royaltyReceiver_gt?: InputMaybe<Scalars['String']>;
  royaltyReceiver_gte?: InputMaybe<Scalars['String']>;
  royaltyReceiver_in?: InputMaybe<Array<Scalars['String']>>;
  royaltyReceiver_lt?: InputMaybe<Scalars['String']>;
  royaltyReceiver_lte?: InputMaybe<Scalars['String']>;
  royaltyReceiver_not?: InputMaybe<Scalars['String']>;
  royaltyReceiver_not_contains?: InputMaybe<Scalars['String']>;
  royaltyReceiver_not_ends_with?: InputMaybe<Scalars['String']>;
  royaltyReceiver_not_in?: InputMaybe<Array<Scalars['String']>>;
  royaltyReceiver_not_starts_with?: InputMaybe<Scalars['String']>;
  royaltyReceiver_starts_with?: InputMaybe<Scalars['String']>;
  tokenId?: InputMaybe<Scalars['BigInt']>;
  tokenId_gt?: InputMaybe<Scalars['BigInt']>;
  tokenId_gte?: InputMaybe<Scalars['BigInt']>;
  tokenId_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tokenId_lt?: InputMaybe<Scalars['BigInt']>;
  tokenId_lte?: InputMaybe<Scalars['BigInt']>;
  tokenId_not?: InputMaybe<Scalars['BigInt']>;
  tokenId_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tokenURI?: InputMaybe<Scalars['String']>;
  tokenURI_contains?: InputMaybe<Scalars['String']>;
  tokenURI_ends_with?: InputMaybe<Scalars['String']>;
  tokenURI_gt?: InputMaybe<Scalars['String']>;
  tokenURI_gte?: InputMaybe<Scalars['String']>;
  tokenURI_in?: InputMaybe<Array<Scalars['String']>>;
  tokenURI_lt?: InputMaybe<Scalars['String']>;
  tokenURI_lte?: InputMaybe<Scalars['String']>;
  tokenURI_not?: InputMaybe<Scalars['String']>;
  tokenURI_not_contains?: InputMaybe<Scalars['String']>;
  tokenURI_not_ends_with?: InputMaybe<Scalars['String']>;
  tokenURI_not_in?: InputMaybe<Array<Scalars['String']>>;
  tokenURI_not_starts_with?: InputMaybe<Scalars['String']>;
  tokenURI_starts_with?: InputMaybe<Scalars['String']>;
};

export enum Nft_OrderBy {
  AllowedBuyer = 'allowedBuyer',
  AvailabilityFrom = 'availabilityFrom',
  AvailabilityTo = 'availabilityTo',
  Category = 'category',
  ContractAddress = 'contractAddress',
  Creator = 'creator',
  Currency = 'currency',
  Description = 'description',
  Duration = 'duration',
  ForSale = 'forSale',
  History = 'history',
  Id = 'id',
  LastPurchaseTimestamp = 'lastPurchaseTimestamp',
  MintTimestamp = 'mintTimestamp',
  Name = 'name',
  Owner = 'owner',
  Price = 'price',
  Redeemed = 'redeemed',
  RoyaltyBasisPoints = 'royaltyBasisPoints',
  RoyaltyReceiver = 'royaltyReceiver',
  TokenId = 'tokenId',
  TokenUri = 'tokenURI'
}

export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type PaymentToken = {
  __typename?: 'PaymentToken';
  acceptable: Scalars['Boolean'];
  decimals: Scalars['Int'];
  id: Scalars['ID'];
  symbol: Scalars['String'];
};

export type PaymentToken_Filter = {
  acceptable?: InputMaybe<Scalars['Boolean']>;
  acceptable_in?: InputMaybe<Array<Scalars['Boolean']>>;
  acceptable_not?: InputMaybe<Scalars['Boolean']>;
  acceptable_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  decimals?: InputMaybe<Scalars['Int']>;
  decimals_gt?: InputMaybe<Scalars['Int']>;
  decimals_gte?: InputMaybe<Scalars['Int']>;
  decimals_in?: InputMaybe<Array<Scalars['Int']>>;
  decimals_lt?: InputMaybe<Scalars['Int']>;
  decimals_lte?: InputMaybe<Scalars['Int']>;
  decimals_not?: InputMaybe<Scalars['Int']>;
  decimals_not_in?: InputMaybe<Array<Scalars['Int']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  symbol?: InputMaybe<Scalars['String']>;
  symbol_contains?: InputMaybe<Scalars['String']>;
  symbol_ends_with?: InputMaybe<Scalars['String']>;
  symbol_gt?: InputMaybe<Scalars['String']>;
  symbol_gte?: InputMaybe<Scalars['String']>;
  symbol_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_lt?: InputMaybe<Scalars['String']>;
  symbol_lte?: InputMaybe<Scalars['String']>;
  symbol_not?: InputMaybe<Scalars['String']>;
  symbol_not_contains?: InputMaybe<Scalars['String']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']>;
  symbol_starts_with?: InputMaybe<Scalars['String']>;
};

export enum PaymentToken_OrderBy {
  Acceptable = 'acceptable',
  Decimals = 'decimals',
  Id = 'id',
  Symbol = 'symbol'
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  buyingConditionChange?: Maybe<BuyingConditionChange>;
  buyingConditionChanges: Array<BuyingConditionChange>;
  nft?: Maybe<Nft>;
  nftStatusChange?: Maybe<NftStatusChange>;
  nftStatusChanges: Array<NftStatusChange>;
  nfts: Array<Nft>;
  paymentToken?: Maybe<PaymentToken>;
  paymentTokens: Array<PaymentToken>;
  redeem?: Maybe<Redeem>;
  redeems: Array<Redeem>;
  sale?: Maybe<Sale>;
  sales: Array<Sale>;
  transfer?: Maybe<Transfer>;
  transfers: Array<Transfer>;
  user?: Maybe<User>;
  users: Array<User>;
};


export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type QueryBuyingConditionChangeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryBuyingConditionChangesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<BuyingConditionChange_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<BuyingConditionChange_Filter>;
};


export type QueryNftArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryNftStatusChangeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryNftStatusChangesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<NftStatusChange_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<NftStatusChange_Filter>;
};


export type QueryNftsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Nft_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Nft_Filter>;
};


export type QueryPaymentTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPaymentTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PaymentToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PaymentToken_Filter>;
};


export type QueryRedeemArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryRedeemsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Redeem_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Redeem_Filter>;
};


export type QuerySaleArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerySalesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Sale_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Sale_Filter>;
};


export type QueryTransferArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTransfersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Transfer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Transfer_Filter>;
};


export type QueryUserArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryUsersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<User_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<User_Filter>;
};

export type Redeem = NftStatusChange & {
  __typename?: 'Redeem';
  blockNumber: Scalars['BigInt'];
  creator: User;
  id: Scalars['ID'];
  nft: Nft;
  redeemedBy: User;
  timestamp: Scalars['BigInt'];
  txHash: Scalars['String'];
};

export type Redeem_Filter = {
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  creator?: InputMaybe<Scalars['String']>;
  creator_contains?: InputMaybe<Scalars['String']>;
  creator_ends_with?: InputMaybe<Scalars['String']>;
  creator_gt?: InputMaybe<Scalars['String']>;
  creator_gte?: InputMaybe<Scalars['String']>;
  creator_in?: InputMaybe<Array<Scalars['String']>>;
  creator_lt?: InputMaybe<Scalars['String']>;
  creator_lte?: InputMaybe<Scalars['String']>;
  creator_not?: InputMaybe<Scalars['String']>;
  creator_not_contains?: InputMaybe<Scalars['String']>;
  creator_not_ends_with?: InputMaybe<Scalars['String']>;
  creator_not_in?: InputMaybe<Array<Scalars['String']>>;
  creator_not_starts_with?: InputMaybe<Scalars['String']>;
  creator_starts_with?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  nft?: InputMaybe<Scalars['String']>;
  nft_contains?: InputMaybe<Scalars['String']>;
  nft_ends_with?: InputMaybe<Scalars['String']>;
  nft_gt?: InputMaybe<Scalars['String']>;
  nft_gte?: InputMaybe<Scalars['String']>;
  nft_in?: InputMaybe<Array<Scalars['String']>>;
  nft_lt?: InputMaybe<Scalars['String']>;
  nft_lte?: InputMaybe<Scalars['String']>;
  nft_not?: InputMaybe<Scalars['String']>;
  nft_not_contains?: InputMaybe<Scalars['String']>;
  nft_not_ends_with?: InputMaybe<Scalars['String']>;
  nft_not_in?: InputMaybe<Array<Scalars['String']>>;
  nft_not_starts_with?: InputMaybe<Scalars['String']>;
  nft_starts_with?: InputMaybe<Scalars['String']>;
  redeemedBy?: InputMaybe<Scalars['String']>;
  redeemedBy_contains?: InputMaybe<Scalars['String']>;
  redeemedBy_ends_with?: InputMaybe<Scalars['String']>;
  redeemedBy_gt?: InputMaybe<Scalars['String']>;
  redeemedBy_gte?: InputMaybe<Scalars['String']>;
  redeemedBy_in?: InputMaybe<Array<Scalars['String']>>;
  redeemedBy_lt?: InputMaybe<Scalars['String']>;
  redeemedBy_lte?: InputMaybe<Scalars['String']>;
  redeemedBy_not?: InputMaybe<Scalars['String']>;
  redeemedBy_not_contains?: InputMaybe<Scalars['String']>;
  redeemedBy_not_ends_with?: InputMaybe<Scalars['String']>;
  redeemedBy_not_in?: InputMaybe<Array<Scalars['String']>>;
  redeemedBy_not_starts_with?: InputMaybe<Scalars['String']>;
  redeemedBy_starts_with?: InputMaybe<Scalars['String']>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txHash?: InputMaybe<Scalars['String']>;
  txHash_contains?: InputMaybe<Scalars['String']>;
  txHash_ends_with?: InputMaybe<Scalars['String']>;
  txHash_gt?: InputMaybe<Scalars['String']>;
  txHash_gte?: InputMaybe<Scalars['String']>;
  txHash_in?: InputMaybe<Array<Scalars['String']>>;
  txHash_lt?: InputMaybe<Scalars['String']>;
  txHash_lte?: InputMaybe<Scalars['String']>;
  txHash_not?: InputMaybe<Scalars['String']>;
  txHash_not_contains?: InputMaybe<Scalars['String']>;
  txHash_not_ends_with?: InputMaybe<Scalars['String']>;
  txHash_not_in?: InputMaybe<Array<Scalars['String']>>;
  txHash_not_starts_with?: InputMaybe<Scalars['String']>;
  txHash_starts_with?: InputMaybe<Scalars['String']>;
};

export enum Redeem_OrderBy {
  BlockNumber = 'blockNumber',
  Creator = 'creator',
  Id = 'id',
  Nft = 'nft',
  RedeemedBy = 'redeemedBy',
  Timestamp = 'timestamp',
  TxHash = 'txHash'
}

export type Sale = NftStatusChange & {
  __typename?: 'Sale';
  blockNumber: Scalars['BigInt'];
  currency: PaymentToken;
  from: User;
  id: Scalars['ID'];
  nft: Nft;
  price: Scalars['BigInt'];
  royaltyAccrued: Scalars['BigInt'];
  royaltyReceiver: User;
  timestamp: Scalars['BigInt'];
  to: User;
  txHash: Scalars['String'];
};

export type Sale_Filter = {
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  currency?: InputMaybe<Scalars['String']>;
  currency_contains?: InputMaybe<Scalars['String']>;
  currency_ends_with?: InputMaybe<Scalars['String']>;
  currency_gt?: InputMaybe<Scalars['String']>;
  currency_gte?: InputMaybe<Scalars['String']>;
  currency_in?: InputMaybe<Array<Scalars['String']>>;
  currency_lt?: InputMaybe<Scalars['String']>;
  currency_lte?: InputMaybe<Scalars['String']>;
  currency_not?: InputMaybe<Scalars['String']>;
  currency_not_contains?: InputMaybe<Scalars['String']>;
  currency_not_ends_with?: InputMaybe<Scalars['String']>;
  currency_not_in?: InputMaybe<Array<Scalars['String']>>;
  currency_not_starts_with?: InputMaybe<Scalars['String']>;
  currency_starts_with?: InputMaybe<Scalars['String']>;
  from?: InputMaybe<Scalars['String']>;
  from_contains?: InputMaybe<Scalars['String']>;
  from_ends_with?: InputMaybe<Scalars['String']>;
  from_gt?: InputMaybe<Scalars['String']>;
  from_gte?: InputMaybe<Scalars['String']>;
  from_in?: InputMaybe<Array<Scalars['String']>>;
  from_lt?: InputMaybe<Scalars['String']>;
  from_lte?: InputMaybe<Scalars['String']>;
  from_not?: InputMaybe<Scalars['String']>;
  from_not_contains?: InputMaybe<Scalars['String']>;
  from_not_ends_with?: InputMaybe<Scalars['String']>;
  from_not_in?: InputMaybe<Array<Scalars['String']>>;
  from_not_starts_with?: InputMaybe<Scalars['String']>;
  from_starts_with?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  nft?: InputMaybe<Scalars['String']>;
  nft_contains?: InputMaybe<Scalars['String']>;
  nft_ends_with?: InputMaybe<Scalars['String']>;
  nft_gt?: InputMaybe<Scalars['String']>;
  nft_gte?: InputMaybe<Scalars['String']>;
  nft_in?: InputMaybe<Array<Scalars['String']>>;
  nft_lt?: InputMaybe<Scalars['String']>;
  nft_lte?: InputMaybe<Scalars['String']>;
  nft_not?: InputMaybe<Scalars['String']>;
  nft_not_contains?: InputMaybe<Scalars['String']>;
  nft_not_ends_with?: InputMaybe<Scalars['String']>;
  nft_not_in?: InputMaybe<Array<Scalars['String']>>;
  nft_not_starts_with?: InputMaybe<Scalars['String']>;
  nft_starts_with?: InputMaybe<Scalars['String']>;
  price?: InputMaybe<Scalars['BigInt']>;
  price_gt?: InputMaybe<Scalars['BigInt']>;
  price_gte?: InputMaybe<Scalars['BigInt']>;
  price_in?: InputMaybe<Array<Scalars['BigInt']>>;
  price_lt?: InputMaybe<Scalars['BigInt']>;
  price_lte?: InputMaybe<Scalars['BigInt']>;
  price_not?: InputMaybe<Scalars['BigInt']>;
  price_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  royaltyAccrued?: InputMaybe<Scalars['BigInt']>;
  royaltyAccrued_gt?: InputMaybe<Scalars['BigInt']>;
  royaltyAccrued_gte?: InputMaybe<Scalars['BigInt']>;
  royaltyAccrued_in?: InputMaybe<Array<Scalars['BigInt']>>;
  royaltyAccrued_lt?: InputMaybe<Scalars['BigInt']>;
  royaltyAccrued_lte?: InputMaybe<Scalars['BigInt']>;
  royaltyAccrued_not?: InputMaybe<Scalars['BigInt']>;
  royaltyAccrued_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  royaltyReceiver?: InputMaybe<Scalars['String']>;
  royaltyReceiver_contains?: InputMaybe<Scalars['String']>;
  royaltyReceiver_ends_with?: InputMaybe<Scalars['String']>;
  royaltyReceiver_gt?: InputMaybe<Scalars['String']>;
  royaltyReceiver_gte?: InputMaybe<Scalars['String']>;
  royaltyReceiver_in?: InputMaybe<Array<Scalars['String']>>;
  royaltyReceiver_lt?: InputMaybe<Scalars['String']>;
  royaltyReceiver_lte?: InputMaybe<Scalars['String']>;
  royaltyReceiver_not?: InputMaybe<Scalars['String']>;
  royaltyReceiver_not_contains?: InputMaybe<Scalars['String']>;
  royaltyReceiver_not_ends_with?: InputMaybe<Scalars['String']>;
  royaltyReceiver_not_in?: InputMaybe<Array<Scalars['String']>>;
  royaltyReceiver_not_starts_with?: InputMaybe<Scalars['String']>;
  royaltyReceiver_starts_with?: InputMaybe<Scalars['String']>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  to?: InputMaybe<Scalars['String']>;
  to_contains?: InputMaybe<Scalars['String']>;
  to_ends_with?: InputMaybe<Scalars['String']>;
  to_gt?: InputMaybe<Scalars['String']>;
  to_gte?: InputMaybe<Scalars['String']>;
  to_in?: InputMaybe<Array<Scalars['String']>>;
  to_lt?: InputMaybe<Scalars['String']>;
  to_lte?: InputMaybe<Scalars['String']>;
  to_not?: InputMaybe<Scalars['String']>;
  to_not_contains?: InputMaybe<Scalars['String']>;
  to_not_ends_with?: InputMaybe<Scalars['String']>;
  to_not_in?: InputMaybe<Array<Scalars['String']>>;
  to_not_starts_with?: InputMaybe<Scalars['String']>;
  to_starts_with?: InputMaybe<Scalars['String']>;
  txHash?: InputMaybe<Scalars['String']>;
  txHash_contains?: InputMaybe<Scalars['String']>;
  txHash_ends_with?: InputMaybe<Scalars['String']>;
  txHash_gt?: InputMaybe<Scalars['String']>;
  txHash_gte?: InputMaybe<Scalars['String']>;
  txHash_in?: InputMaybe<Array<Scalars['String']>>;
  txHash_lt?: InputMaybe<Scalars['String']>;
  txHash_lte?: InputMaybe<Scalars['String']>;
  txHash_not?: InputMaybe<Scalars['String']>;
  txHash_not_contains?: InputMaybe<Scalars['String']>;
  txHash_not_ends_with?: InputMaybe<Scalars['String']>;
  txHash_not_in?: InputMaybe<Array<Scalars['String']>>;
  txHash_not_starts_with?: InputMaybe<Scalars['String']>;
  txHash_starts_with?: InputMaybe<Scalars['String']>;
};

export enum Sale_OrderBy {
  BlockNumber = 'blockNumber',
  Currency = 'currency',
  From = 'from',
  Id = 'id',
  Nft = 'nft',
  Price = 'price',
  RoyaltyAccrued = 'royaltyAccrued',
  RoyaltyReceiver = 'royaltyReceiver',
  Timestamp = 'timestamp',
  To = 'to',
  TxHash = 'txHash'
}

export type Subscription = {
  __typename?: 'Subscription';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  buyingConditionChange?: Maybe<BuyingConditionChange>;
  buyingConditionChanges: Array<BuyingConditionChange>;
  nft?: Maybe<Nft>;
  nftStatusChange?: Maybe<NftStatusChange>;
  nftStatusChanges: Array<NftStatusChange>;
  nfts: Array<Nft>;
  paymentToken?: Maybe<PaymentToken>;
  paymentTokens: Array<PaymentToken>;
  redeem?: Maybe<Redeem>;
  redeems: Array<Redeem>;
  sale?: Maybe<Sale>;
  sales: Array<Sale>;
  transfer?: Maybe<Transfer>;
  transfers: Array<Transfer>;
  user?: Maybe<User>;
  users: Array<User>;
};


export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type SubscriptionBuyingConditionChangeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionBuyingConditionChangesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<BuyingConditionChange_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<BuyingConditionChange_Filter>;
};


export type SubscriptionNftArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionNftStatusChangeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionNftStatusChangesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<NftStatusChange_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<NftStatusChange_Filter>;
};


export type SubscriptionNftsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Nft_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Nft_Filter>;
};


export type SubscriptionPaymentTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPaymentTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PaymentToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PaymentToken_Filter>;
};


export type SubscriptionRedeemArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionRedeemsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Redeem_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Redeem_Filter>;
};


export type SubscriptionSaleArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionSalesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Sale_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Sale_Filter>;
};


export type SubscriptionTransferArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionTransfersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Transfer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Transfer_Filter>;
};


export type SubscriptionUserArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionUsersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<User_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<User_Filter>;
};

export type Transfer = NftStatusChange & {
  __typename?: 'Transfer';
  blockNumber: Scalars['BigInt'];
  from: User;
  id: Scalars['ID'];
  nft: Nft;
  timestamp: Scalars['BigInt'];
  to: User;
  txHash: Scalars['String'];
};

export type Transfer_Filter = {
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  from?: InputMaybe<Scalars['String']>;
  from_contains?: InputMaybe<Scalars['String']>;
  from_ends_with?: InputMaybe<Scalars['String']>;
  from_gt?: InputMaybe<Scalars['String']>;
  from_gte?: InputMaybe<Scalars['String']>;
  from_in?: InputMaybe<Array<Scalars['String']>>;
  from_lt?: InputMaybe<Scalars['String']>;
  from_lte?: InputMaybe<Scalars['String']>;
  from_not?: InputMaybe<Scalars['String']>;
  from_not_contains?: InputMaybe<Scalars['String']>;
  from_not_ends_with?: InputMaybe<Scalars['String']>;
  from_not_in?: InputMaybe<Array<Scalars['String']>>;
  from_not_starts_with?: InputMaybe<Scalars['String']>;
  from_starts_with?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  nft?: InputMaybe<Scalars['String']>;
  nft_contains?: InputMaybe<Scalars['String']>;
  nft_ends_with?: InputMaybe<Scalars['String']>;
  nft_gt?: InputMaybe<Scalars['String']>;
  nft_gte?: InputMaybe<Scalars['String']>;
  nft_in?: InputMaybe<Array<Scalars['String']>>;
  nft_lt?: InputMaybe<Scalars['String']>;
  nft_lte?: InputMaybe<Scalars['String']>;
  nft_not?: InputMaybe<Scalars['String']>;
  nft_not_contains?: InputMaybe<Scalars['String']>;
  nft_not_ends_with?: InputMaybe<Scalars['String']>;
  nft_not_in?: InputMaybe<Array<Scalars['String']>>;
  nft_not_starts_with?: InputMaybe<Scalars['String']>;
  nft_starts_with?: InputMaybe<Scalars['String']>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  to?: InputMaybe<Scalars['String']>;
  to_contains?: InputMaybe<Scalars['String']>;
  to_ends_with?: InputMaybe<Scalars['String']>;
  to_gt?: InputMaybe<Scalars['String']>;
  to_gte?: InputMaybe<Scalars['String']>;
  to_in?: InputMaybe<Array<Scalars['String']>>;
  to_lt?: InputMaybe<Scalars['String']>;
  to_lte?: InputMaybe<Scalars['String']>;
  to_not?: InputMaybe<Scalars['String']>;
  to_not_contains?: InputMaybe<Scalars['String']>;
  to_not_ends_with?: InputMaybe<Scalars['String']>;
  to_not_in?: InputMaybe<Array<Scalars['String']>>;
  to_not_starts_with?: InputMaybe<Scalars['String']>;
  to_starts_with?: InputMaybe<Scalars['String']>;
  txHash?: InputMaybe<Scalars['String']>;
  txHash_contains?: InputMaybe<Scalars['String']>;
  txHash_ends_with?: InputMaybe<Scalars['String']>;
  txHash_gt?: InputMaybe<Scalars['String']>;
  txHash_gte?: InputMaybe<Scalars['String']>;
  txHash_in?: InputMaybe<Array<Scalars['String']>>;
  txHash_lt?: InputMaybe<Scalars['String']>;
  txHash_lte?: InputMaybe<Scalars['String']>;
  txHash_not?: InputMaybe<Scalars['String']>;
  txHash_not_contains?: InputMaybe<Scalars['String']>;
  txHash_not_ends_with?: InputMaybe<Scalars['String']>;
  txHash_not_in?: InputMaybe<Array<Scalars['String']>>;
  txHash_not_starts_with?: InputMaybe<Scalars['String']>;
  txHash_starts_with?: InputMaybe<Scalars['String']>;
};

export enum Transfer_OrderBy {
  BlockNumber = 'blockNumber',
  From = 'from',
  Id = 'id',
  Nft = 'nft',
  Timestamp = 'timestamp',
  To = 'to',
  TxHash = 'txHash'
}

export type User = {
  __typename?: 'User';
  /** Sale option toggles for NFTs this user owns */
  buyingConditionChanges: Array<BuyingConditionChange>;
  createdNfts: Array<Nft>;
  /** Nfts which this user has created that have been redeemed */
  creatorRedemptions: Array<Redeem>;
  id: Scalars['ID'];
  incomingTransfers: Array<Transfer>;
  outgoingTransfers: Array<Transfer>;
  ownedNfts: Array<Nft>;
  purchases: Array<Sale>;
  /** Nfts which this user has redeemed */
  redemptions: Array<Redeem>;
  royaltiesAccrued: Array<Sale>;
  sales: Array<Sale>;
};


export type UserBuyingConditionChangesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<BuyingConditionChange_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<BuyingConditionChange_Filter>;
};


export type UserCreatedNftsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Nft_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Nft_Filter>;
};


export type UserCreatorRedemptionsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Redeem_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Redeem_Filter>;
};


export type UserIncomingTransfersArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Transfer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Transfer_Filter>;
};


export type UserOutgoingTransfersArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Transfer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Transfer_Filter>;
};


export type UserOwnedNftsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Nft_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Nft_Filter>;
};


export type UserPurchasesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Sale_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Sale_Filter>;
};


export type UserRedemptionsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Redeem_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Redeem_Filter>;
};


export type UserRoyaltiesAccruedArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Sale_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Sale_Filter>;
};


export type UserSalesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Sale_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Sale_Filter>;
};

export type User_Filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
};

export enum User_OrderBy {
  BuyingConditionChanges = 'buyingConditionChanges',
  CreatedNfts = 'createdNfts',
  CreatorRedemptions = 'creatorRedemptions',
  Id = 'id',
  IncomingTransfers = 'incomingTransfers',
  OutgoingTransfers = 'outgoingTransfers',
  OwnedNfts = 'ownedNfts',
  Purchases = 'purchases',
  Redemptions = 'redemptions',
  RoyaltiesAccrued = 'royaltiesAccrued',
  Sales = 'sales'
}

export type _Block_ = {
  __typename?: '_Block_';
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  number: Scalars['Int'];
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  __typename?: '_Meta_';
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean'];
};

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = 'allow',
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = 'deny'
}

export type PaymentTokenFieldsFragment = { __typename?: 'PaymentToken', id: string, decimals: number, acceptable: boolean, symbol: string };

export type NftFieldsFragment = { __typename?: 'Nft', id: string, tokenId: any, tokenURI: string, name: string, description: string, category: string, availabilityFrom: any, availabilityTo: any, allowedBuyer: string, duration: any, forSale: boolean, redeemed: boolean, royaltyBasisPoints: any, price: any, mintTimestamp: number, lastPurchaseTimestamp: number, owner: { __typename?: 'User', id: string }, creator: { __typename?: 'User', id: string }, currency: { __typename?: 'PaymentToken', id: string, decimals: number, acceptable: boolean, symbol: string }, history: Array<{ __typename?: 'BuyingConditionChange', price: any, forSale: boolean, allowedBuyer: string, txHash: string, timestamp: any, currency: { __typename?: 'PaymentToken', symbol: string }, owner: { __typename?: 'User', id: string } } | { __typename?: 'Redeem', txHash: string, timestamp: any, redeemedBy: { __typename?: 'User', id: string } } | { __typename?: 'Sale', price: any, txHash: string, timestamp: any, to: { __typename?: 'User', id: string }, from: { __typename?: 'User', id: string }, currency: { __typename?: 'PaymentToken', symbol: string } } | { __typename?: 'Transfer', txHash: string, timestamp: any, to: { __typename?: 'User', id: string }, from: { __typename?: 'User', id: string } }> };

export type NftsQueryVariables = Exact<{
  where?: InputMaybe<Nft_Filter>;
  orderBy?: InputMaybe<Nft_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  first: Scalars['Int'];
  skip?: InputMaybe<Scalars['Int']>;
}>;


export type NftsQuery = { __typename?: 'Query', nfts: Array<{ __typename?: 'Nft', id: string, tokenId: any, tokenURI: string, name: string, description: string, category: string, availabilityFrom: any, availabilityTo: any, allowedBuyer: string, duration: any, forSale: boolean, redeemed: boolean, royaltyBasisPoints: any, price: any, mintTimestamp: number, lastPurchaseTimestamp: number, owner: { __typename?: 'User', id: string }, creator: { __typename?: 'User', id: string }, currency: { __typename?: 'PaymentToken', id: string, decimals: number, acceptable: boolean, symbol: string }, history: Array<{ __typename?: 'BuyingConditionChange', price: any, forSale: boolean, allowedBuyer: string, txHash: string, timestamp: any, currency: { __typename?: 'PaymentToken', symbol: string }, owner: { __typename?: 'User', id: string } } | { __typename?: 'Redeem', txHash: string, timestamp: any, redeemedBy: { __typename?: 'User', id: string } } | { __typename?: 'Sale', price: any, txHash: string, timestamp: any, to: { __typename?: 'User', id: string }, from: { __typename?: 'User', id: string }, currency: { __typename?: 'PaymentToken', symbol: string } } | { __typename?: 'Transfer', txHash: string, timestamp: any, to: { __typename?: 'User', id: string }, from: { __typename?: 'User', id: string } }> }> };

export type NftSubscriptionVariables = Exact<{
  nft: Scalars['ID'];
}>;


export type NftSubscription = { __typename?: 'Subscription', nft?: { __typename?: 'Nft', id: string, tokenId: any, tokenURI: string, name: string, description: string, category: string, availabilityFrom: any, availabilityTo: any, allowedBuyer: string, duration: any, forSale: boolean, redeemed: boolean, royaltyBasisPoints: any, price: any, mintTimestamp: number, lastPurchaseTimestamp: number, owner: { __typename?: 'User', id: string }, creator: { __typename?: 'User', id: string }, currency: { __typename?: 'PaymentToken', id: string, decimals: number, acceptable: boolean, symbol: string }, history: Array<{ __typename?: 'BuyingConditionChange', price: any, forSale: boolean, allowedBuyer: string, txHash: string, timestamp: any, currency: { __typename?: 'PaymentToken', symbol: string }, owner: { __typename?: 'User', id: string } } | { __typename?: 'Redeem', txHash: string, timestamp: any, redeemedBy: { __typename?: 'User', id: string } } | { __typename?: 'Sale', price: any, txHash: string, timestamp: any, to: { __typename?: 'User', id: string }, from: { __typename?: 'User', id: string }, currency: { __typename?: 'PaymentToken', symbol: string } } | { __typename?: 'Transfer', txHash: string, timestamp: any, to: { __typename?: 'User', id: string }, from: { __typename?: 'User', id: string } }> } | null };

export type SalesSubscriptionVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Sale_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Sale_Filter>;
}>;


export type SalesSubscription = { __typename?: 'Subscription', sales: Array<{ __typename?: 'Sale', id: string, timestamp: any, price: any, royaltyReceiver: { __typename?: 'User', id: string }, currency: { __typename?: 'PaymentToken', id: string, decimals: number, acceptable: boolean, symbol: string }, nft: { __typename?: 'Nft', id: string, tokenId: any, tokenURI: string, name: string, description: string, category: string, availabilityFrom: any, availabilityTo: any, allowedBuyer: string, duration: any, forSale: boolean, redeemed: boolean, royaltyBasisPoints: any, price: any, mintTimestamp: number, lastPurchaseTimestamp: number, owner: { __typename?: 'User', id: string }, creator: { __typename?: 'User', id: string }, currency: { __typename?: 'PaymentToken', id: string, decimals: number, acceptable: boolean, symbol: string }, history: Array<{ __typename?: 'BuyingConditionChange', price: any, forSale: boolean, allowedBuyer: string, txHash: string, timestamp: any, currency: { __typename?: 'PaymentToken', symbol: string }, owner: { __typename?: 'User', id: string } } | { __typename?: 'Redeem', txHash: string, timestamp: any, redeemedBy: { __typename?: 'User', id: string } } | { __typename?: 'Sale', price: any, txHash: string, timestamp: any, to: { __typename?: 'User', id: string }, from: { __typename?: 'User', id: string }, currency: { __typename?: 'PaymentToken', symbol: string } } | { __typename?: 'Transfer', txHash: string, timestamp: any, to: { __typename?: 'User', id: string }, from: { __typename?: 'User', id: string } }> } }> };

export type ProfileNftsSubscriptionVariables = Exact<{
  user: Scalars['ID'];
}>;


export type ProfileNftsSubscription = { __typename?: 'Subscription', user?: { __typename?: 'User', createdNfts: Array<{ __typename?: 'Nft', id: string, tokenId: any, tokenURI: string, name: string, description: string, category: string, availabilityFrom: any, availabilityTo: any, allowedBuyer: string, duration: any, forSale: boolean, redeemed: boolean, royaltyBasisPoints: any, price: any, mintTimestamp: number, lastPurchaseTimestamp: number, owner: { __typename?: 'User', id: string }, creator: { __typename?: 'User', id: string }, currency: { __typename?: 'PaymentToken', id: string, decimals: number, acceptable: boolean, symbol: string }, history: Array<{ __typename?: 'BuyingConditionChange', price: any, forSale: boolean, allowedBuyer: string, txHash: string, timestamp: any, currency: { __typename?: 'PaymentToken', symbol: string }, owner: { __typename?: 'User', id: string } } | { __typename?: 'Redeem', txHash: string, timestamp: any, redeemedBy: { __typename?: 'User', id: string } } | { __typename?: 'Sale', price: any, txHash: string, timestamp: any, to: { __typename?: 'User', id: string }, from: { __typename?: 'User', id: string }, currency: { __typename?: 'PaymentToken', symbol: string } } | { __typename?: 'Transfer', txHash: string, timestamp: any, to: { __typename?: 'User', id: string }, from: { __typename?: 'User', id: string } }> }>, ownedNfts: Array<{ __typename?: 'Nft', id: string, tokenId: any, tokenURI: string, name: string, description: string, category: string, availabilityFrom: any, availabilityTo: any, allowedBuyer: string, duration: any, forSale: boolean, redeemed: boolean, royaltyBasisPoints: any, price: any, mintTimestamp: number, lastPurchaseTimestamp: number, owner: { __typename?: 'User', id: string }, creator: { __typename?: 'User', id: string }, currency: { __typename?: 'PaymentToken', id: string, decimals: number, acceptable: boolean, symbol: string }, history: Array<{ __typename?: 'BuyingConditionChange', price: any, forSale: boolean, allowedBuyer: string, txHash: string, timestamp: any, currency: { __typename?: 'PaymentToken', symbol: string }, owner: { __typename?: 'User', id: string } } | { __typename?: 'Redeem', txHash: string, timestamp: any, redeemedBy: { __typename?: 'User', id: string } } | { __typename?: 'Sale', price: any, txHash: string, timestamp: any, to: { __typename?: 'User', id: string }, from: { __typename?: 'User', id: string }, currency: { __typename?: 'PaymentToken', symbol: string } } | { __typename?: 'Transfer', txHash: string, timestamp: any, to: { __typename?: 'User', id: string }, from: { __typename?: 'User', id: string } }> }> } | null };

export const PaymentTokenFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PaymentTokenFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PaymentToken"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}},{"kind":"Field","name":{"kind":"Name","value":"acceptable"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}}]} as unknown as DocumentNode<PaymentTokenFieldsFragment, unknown>;
export const NftFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NftFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Nft"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"tokenId"}},{"kind":"Field","name":{"kind":"Name","value":"tokenURI"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"creator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"availabilityFrom"}},{"kind":"Field","name":{"kind":"Name","value":"availabilityTo"}},{"kind":"Field","name":{"kind":"Name","value":"allowedBuyer"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"forSale"}},{"kind":"Field","name":{"kind":"Name","value":"redeemed"}},{"kind":"Field","name":{"kind":"Name","value":"royaltyBasisPoints"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"currency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PaymentTokenFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mintTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"lastPurchaseTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"history"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"txHash"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Redeem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"redeemedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BuyingConditionChange"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"currency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"forSale"}},{"kind":"Field","name":{"kind":"Name","value":"allowedBuyer"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Sale"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"to"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"from"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"currency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Transfer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"to"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"from"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}},...PaymentTokenFieldsFragmentDoc.definitions]} as unknown as DocumentNode<NftFieldsFragment, unknown>;
export const NftsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Nfts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Nft_filter"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Nft_orderBy"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderDirection"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nfts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NftFields"}}]}}]}},...NftFieldsFragmentDoc.definitions]} as unknown as DocumentNode<NftsQuery, NftsQueryVariables>;
export const NftDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"Nft"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"nft"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nft"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"nft"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NftFields"}}]}}]}},...NftFieldsFragmentDoc.definitions]} as unknown as DocumentNode<NftSubscription, NftSubscriptionVariables>;
export const SalesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"Sales"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Sale_orderBy"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderDirection"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Sale_filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sales"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"royaltyReceiver"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"currency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PaymentTokenFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nft"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NftFields"}}]}}]}}]}},...PaymentTokenFieldsFragmentDoc.definitions,...NftFieldsFragmentDoc.definitions]} as unknown as DocumentNode<SalesSubscription, SalesSubscriptionVariables>;
export const ProfileNftsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"ProfileNfts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"user"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"user"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdNfts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NftFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ownedNfts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NftFields"}}]}}]}}]}},...NftFieldsFragmentDoc.definitions]} as unknown as DocumentNode<ProfileNftsSubscription, ProfileNftsSubscriptionVariables>;