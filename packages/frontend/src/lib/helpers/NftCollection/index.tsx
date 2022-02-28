import { NonFungibleTimeCollection } from './typechain/NonFungibleTimeCollection';
import { NonFungibleTimeCollection__factory } from './typechain/factory/NonFungibleTimeCollection__factory';
import { BigNumber, providers } from 'ethers';
import BaseService from '../base-service';
import {
  eEthereumTxType,
  EthereumTransactionTypeExtended,
  transactionType,
  DEFAULT_NULL_VALUE_ON_TX,
  isEthAddress,
} from '../base-service';
import { ERC20Service, ERC20ServiceInterface } from '../ERC20';
import { MAX_ALLOWANCE, ZERO_ADDRESS } from '../constants';

export type MintParamsType = {
  userAddress: string;
  name: string;
  description: string;
  category: string;
  availabilityFrom: number;
  availabilityTo: number;
  duration: number;
  royaltyBasisPoints: number;
};

export type BuyTokenParamsType = {
  userAddress: string;
  tokenId: number;
  currency: string;
  price: BigNumber;
};

export type ChangeBuyingConditionsParamsType = {
  userAddress: string;
  tokenId: number;
  currency: string;
  price: BigNumber;
  allowedBuyer: string;
  forSale: boolean;
};

export type ChangeRoyaltyReceiverParamsType = {
  userAddress: string;
  tokenId: string;
  royaltyReceiver: string;
};

export type RedeemParamsType = {
  userAddress: string;
  tokenId: number;
};

export type TokensParamsType = {
  tokenId: number;
};

export interface TokenInfo {
  availabilityFrom: BigNumber;
  availabilityTo: BigNumber;
  duration: BigNumber;
  price: BigNumber;
  royaltyBasisPoints: BigNumber;
  minter: string;
  royaltyReceiver: string;
  currency: string;
  allowedBuyer: string;
  redeemed: boolean;
  forSale: boolean;
  name: string;
  description: string;
  category: string;
  0: BigNumber;
  1: BigNumber;
  2: BigNumber;
  3: BigNumber;
  4: BigNumber;
  5: string;
  6: string;
  7: string;
  8: string;
  9: boolean;
  10: boolean;
  11: string;
  12: string;
  13: string;
}

export interface NftCollectionInterface {
  mint: (args: MintParamsType) => EthereumTransactionTypeExtended[];
  buyToken: (args: BuyTokenParamsType) => Promise<EthereumTransactionTypeExtended[]>;
  changeBuyingConditions: (
    args: ChangeBuyingConditionsParamsType
  ) => EthereumTransactionTypeExtended[];
  changeRoyaltyReceiver: (
    args: ChangeRoyaltyReceiverParamsType
  ) => EthereumTransactionTypeExtended[];
  redeem: (args: RedeemParamsType) => EthereumTransactionTypeExtended[];
  tokens: (args: TokensParamsType) => Promise<TokenInfo>;
}

export class NftCollectionService
  extends BaseService<NonFungibleTimeCollection>
  implements NftCollectionInterface
{
  readonly collectionAddress: string;
  readonly erc20Service: ERC20ServiceInterface;

  constructor(provider: providers.Provider, collectionAddress?: string) {
    super(provider, NonFungibleTimeCollection__factory);

    this.collectionAddress = collectionAddress ?? '';
    this.erc20Service = new ERC20Service(provider);
  }

  public mint(
    @isEthAddress('userAddress')
    {
      userAddress,
      name,
      description,
      category,
      availabilityFrom,
      availabilityTo,
      duration,
      royaltyBasisPoints,
    }: MintParamsType
  ): EthereumTransactionTypeExtended[] {
    const collectionContract = this.getContractInstance(this.collectionAddress);
    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        collectionContract.populateTransaction.mint(
          name,
          description,
          category,
          availabilityFrom,
          availabilityTo,
          duration,
          royaltyBasisPoints
        ),
      from: userAddress,
      value: DEFAULT_NULL_VALUE_ON_TX,
    });

    return [
      {
        tx: txCallback,
        txType: eEthereumTxType.COLLECTION_ACTION,
        gas: this.generateTxPriceEstimation([], txCallback),
      },
    ];
  }

  public async buyToken(
    @isEthAddress('userAddress')
    { userAddress, tokenId }: BuyTokenParamsType
  ): Promise<EthereumTransactionTypeExtended[]> {
    const collectionContract = this.getContractInstance(this.collectionAddress);
    const token = await collectionContract.tokens(tokenId);
    const currency = token[7];
    const price = token[3];
    // No approval required and amount passed through value for purchases with base tokens (ETH, MATIC, etc.)
    if (currency === ZERO_ADDRESS) {
      const txCallback: () => Promise<transactionType> = this.generateTxCallback({
        rawTxMethod: async () => collectionContract.populateTransaction.buy(tokenId),
        from: userAddress,
        value: price.toString(),
      });

      return [
        {
          tx: txCallback,
          txType: eEthereumTxType.COLLECTION_ACTION,
          gas: this.generateTxPriceEstimation([], txCallback),
        },
      ];
    } else {
      const txs: EthereumTransactionTypeExtended[] = [];

      // Check if collection is approved to spend the purchase currency
      const { isApproved, approve }: ERC20ServiceInterface = this.erc20Service;

      const approved = await isApproved({
        token: currency,
        user: userAddress,
        spender: this.collectionAddress,
        amount: price.toString(),
      });

      if (!approved) {
        const approveTx: EthereumTransactionTypeExtended = approve({
          user: userAddress,
          token: currency,
          spender: this.collectionAddress,
          amount: MAX_ALLOWANCE,
        });
        txs.push(approveTx);
      }

      const txCallback: () => Promise<transactionType> = this.generateTxCallback({
        rawTxMethod: async () => collectionContract.populateTransaction.buy(tokenId),
        from: userAddress,
        value: DEFAULT_NULL_VALUE_ON_TX,
      });

      txs.push({
        tx: txCallback,
        txType: eEthereumTxType.COLLECTION_ACTION,
        gas: this.generateTxPriceEstimation([], txCallback),
      });

      return txs;
    }
  }

  public changeBuyingConditions(
    @isEthAddress('userAddress')
    @isEthAddress('currency')
    {
      userAddress,
      tokenId,
      currency,
      price,
      allowedBuyer,
      forSale,
    }: ChangeBuyingConditionsParamsType
  ): EthereumTransactionTypeExtended[] {
    const collectionContract = this.getContractInstance(this.collectionAddress);
    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        collectionContract.populateTransaction.changeBuyingConditions(
          tokenId,
          currency,
          price,
          allowedBuyer,
          forSale
        ),
      from: userAddress,
      value: DEFAULT_NULL_VALUE_ON_TX,
    });

    return [
      {
        tx: txCallback,
        txType: eEthereumTxType.COLLECTION_ACTION,
        gas: this.generateTxPriceEstimation([], txCallback),
      },
    ];
  }

  public changeRoyaltyReceiver(
    @isEthAddress('userAddress')
    @isEthAddress('royaltyReceiver')
    { userAddress, tokenId, royaltyReceiver }: ChangeRoyaltyReceiverParamsType
  ): EthereumTransactionTypeExtended[] {
    const collectionContract = this.getContractInstance(this.collectionAddress);
    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        collectionContract.populateTransaction.changeRoyaltyReceiver(tokenId, royaltyReceiver),
      from: userAddress,
      value: DEFAULT_NULL_VALUE_ON_TX,
    });

    return [
      {
        tx: txCallback,
        txType: eEthereumTxType.COLLECTION_ACTION,
        gas: this.generateTxPriceEstimation([], txCallback),
      },
    ];
  }

  public redeem(
    @isEthAddress('userAddress')
    { userAddress, tokenId }: RedeemParamsType
  ): EthereumTransactionTypeExtended[] {
    const collectionContract = this.getContractInstance(this.collectionAddress);
    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () => collectionContract.populateTransaction.redeem(tokenId),
      from: userAddress,
      value: DEFAULT_NULL_VALUE_ON_TX,
    });

    return [
      {
        tx: txCallback,
        txType: eEthereumTxType.COLLECTION_ACTION,
        gas: this.generateTxPriceEstimation([], txCallback),
      },
    ];
  }

  public tokens({ tokenId }: TokensParamsType): Promise<TokenInfo> {
    const collectionContract = this.getContractInstance(this.collectionAddress);
    return collectionContract.tokens(tokenId);
  }
}
