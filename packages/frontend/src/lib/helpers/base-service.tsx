import 'reflect-metadata';
import { BigNumber as BigNumberJs } from 'bignumber.js';
import { Provider } from '@ethersproject/providers';
import { BigNumber, Contract, PopulatedTransaction, providers, Signer } from 'ethers';
import { ChainId } from '../config';

export interface ContractsFactory {
  connect: (address: string, signerOrProvider: Signer | Provider) => Contract;
}

export const DEFAULT_NULL_VALUE_ON_TX = BigNumber.from(0).toHexString();

export type GasRecommendationType = Record<
  string,
  {
    limit: string;
    recommended: string;
  }
>;

export type tEthereumAddress = string;

// TO-DO: Add protocol actions and gas limit suggestions
export enum ProtocolAction {
  default = 'default',
}

export const gasLimitRecommendations: GasRecommendationType = {
  [ProtocolAction.default]: {
    limit: '',
    recommended: '',
  },
};

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

const DEFAULT_SURPLUS = 30; // 30%
// polygon gas estimation is very off for some reason
const POLYGON_SURPLUS = 60; // 60%

export const estimateGas = async (
  tx: transactionType,
  provider: providers.Provider,
  gasSurplus?: number
): Promise<BigNumber> => {
  const estimatedGas = await provider.estimateGas(tx);
  return estimatedGas.add(estimatedGas.mul(gasSurplus ?? DEFAULT_SURPLUS).div(100));
};

export const estimateGasByNetwork = async (
  tx: transactionType,
  provider: providers.Provider,
  gasSurplus?: number
): Promise<BigNumber> => {
  const estimatedGas = await provider.estimateGas(tx);
  const providerNework: providers.Network = await provider.getNetwork();

  if (providerNework.chainId === ChainId.polygon) {
    return estimatedGas.add(estimatedGas.mul(POLYGON_SURPLUS).div(100));
  }

  return estimatedGas.add(estimatedGas.mul(gasSurplus ?? DEFAULT_SURPLUS).div(100));
};

export type paramsType = {
  index: number;
  field: string | undefined;
};

export const isEthAddressMetadataKey = Symbol('ethAddress');
export const isPositiveMetadataKey = Symbol('isPositive');
export const isPositiveOrMinusOneMetadataKey = Symbol('isPositiveOrMinusOne');

export function isEthAddress(field?: string) {
  return function (target: any, propertyKey: string | symbol, parameterIndex: number): void {
    const existingPossibleAddresses: paramsType[] =
      Reflect.getOwnMetadata(isEthAddressMetadataKey, target, propertyKey) || [];

    existingPossibleAddresses.push({
      index: parameterIndex,
      field,
    });

    Reflect.defineMetadata(isEthAddressMetadataKey, existingPossibleAddresses, target, propertyKey);
  };
}

export function isPositiveAmount(field?: string) {
  return function (target: any, propertyKey: string | symbol, parameterIndex: number): void {
    const params: paramsType[] =
      Reflect.getOwnMetadata(isPositiveMetadataKey, target, propertyKey) || [];

    params.push({ index: parameterIndex, field });

    Reflect.defineMetadata(isPositiveMetadataKey, params, target, propertyKey);
  };
}

export function isPositiveOrMinusOneAmount(field?: string) {
  return function (target: any, propertyKey: string | symbol, parameterIndex: number): void {
    const params: paramsType[] =
      Reflect.getOwnMetadata(isPositiveOrMinusOneMetadataKey, target, propertyKey) || [];

    params.push({ index: parameterIndex, field });

    Reflect.defineMetadata(isPositiveOrMinusOneMetadataKey, params, target, propertyKey);
  };
}

export const valueToWei = (value: string, decimals: number): string => {
  return new BigNumberJs(value).shiftedBy(decimals).toFixed(0);
};
export const SUPER_BIG_ALLOWANCE_NUMBER =
  '11579208923731619542357098500868790785326998466564056403945758400791';

export type TransactionGenerationMethod = {
  rawTxMethod: () => Promise<PopulatedTransaction>;
  from: tEthereumAddress;
  value?: string;
  gasSurplus?: number;
  action?: ProtocolAction;
};

export type GasType = {
  gasLimit: string | undefined;
  gasPrice: string;
};
export type GasResponse = (force?: boolean) => Promise<GasType | null>;

export type transactionType = {
  value?: string;
  from?: string;
  to?: string;
  nonce?: number;
  gasLimit?: BigNumber;
  gasPrice?: BigNumber;
  data?: string;
  chainId?: number;
};

export enum eEthereumTxType {
  ERC20_APPROVAL = 'ERC20_APPROVAL',
  COLLECTION_ACTION = 'COLLECTION_ACTION',
}

export type EthereumTransactionTypeExtended = {
  txType: eEthereumTxType;
  tx: () => Promise<transactionType>;
  gas: GasResponse;
};

export default class BaseService<T extends Contract> {
  readonly contractInstances: Record<string, T>;

  readonly contractFactory: ContractsFactory;

  readonly provider: providers.Provider;

  constructor(provider: providers.Provider, contractFactory: ContractsFactory) {
    this.contractFactory = contractFactory;
    this.provider = provider;
    this.contractInstances = {};
  }

  public getContractInstance = (address: tEthereumAddress): T => {
    if (!this.contractInstances[address]) {
      this.contractInstances[address] = this.contractFactory.connect(address, this.provider) as T;
    }

    return this.contractInstances[address];
  };

  readonly generateTxCallback =
    ({
      rawTxMethod,
      from,
      value,
      gasSurplus,
      action,
    }: TransactionGenerationMethod): (() => Promise<transactionType>) =>
    async () => {
      const txRaw: PopulatedTransaction = await rawTxMethod();

      const tx: transactionType = {
        ...txRaw,
        from,
        value: value ?? DEFAULT_NULL_VALUE_ON_TX,
      };

      tx.gasLimit = await estimateGasByNetwork(tx, this.provider, gasSurplus);

      if (
        action &&
        gasLimitRecommendations[action] &&
        tx.gasLimit.lte(BigNumber.from(gasLimitRecommendations[action].limit))
      ) {
        tx.gasLimit = BigNumber.from(gasLimitRecommendations[action].recommended);
      }

      return tx;
    };

  readonly generateTxPriceEstimation =
    (
      txs: EthereumTransactionTypeExtended[],
      txCallback: () => Promise<transactionType>,
      action: string = ProtocolAction.default
    ): GasResponse =>
    async (force = false) => {
      try {
        const gasPrice = await this.provider.getGasPrice();
        const hasPendingApprovals = txs.find((tx) => tx.txType === eEthereumTxType.ERC20_APPROVAL);
        if (!hasPendingApprovals || force) {
          const { gasLimit, gasPrice: gasPriceProv }: transactionType = await txCallback();
          if (!gasLimit) {
            // If we don't recieve the correct gas we throw a error
            throw new Error('Transaction calculation error');
          }

          return {
            gasLimit: gasLimit.toString(),
            gasPrice: gasPriceProv ? gasPriceProv.toString() : gasPrice.toString(),
          };
        }

        return {
          gasLimit: gasLimitRecommendations[action].recommended,
          gasPrice: gasPrice.toString(),
        };
      } catch (error: unknown) {
        console.error('Calculate error on calculate estimation gas price.', error);
        return null;
      }
    };
}
