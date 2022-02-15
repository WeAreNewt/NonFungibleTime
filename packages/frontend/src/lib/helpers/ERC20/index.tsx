import { BigNumber, providers } from 'ethers';
import BaseService from '../base-service';
import {
  eEthereumTxType,
  EthereumTransactionTypeExtended,
  tEthereumAddress,
  transactionType,
  isEthAddress,
  isPositiveAmount,
  isPositiveOrMinusOneAmount,
  valueToWei,
} from '../base-service';

import { ERC20 } from './typechain/ERC20';
import { ERC20__factory } from './typechain/factory/ERC20__factory';
import { ZERO_ADDRESS } from '../constants';
import { formatEther } from 'ethers/lib/utils';

export interface ERC20ServiceInterface {
  decimalsOf: (token: DecimalsOfType) => Promise<number>;
  isApproved: (args: ApproveType) => Promise<boolean>;
  approve: (args: ApproveType) => EthereumTransactionTypeExtended;
}

export type ApproveType = {
  user: tEthereumAddress;
  token: tEthereumAddress;
  spender: tEthereumAddress;
  amount: string;
};

export type DecimalsOfType = {
  token: tEthereumAddress;
};

export type BalanceOfType = {
  token: tEthereumAddress;
  user: tEthereumAddress;
};

export class ERC20Service extends BaseService<ERC20> implements ERC20ServiceInterface {
  readonly tokenDecimals: Record<string, number>;

  constructor(provider: providers.Provider) {
    super(provider, ERC20__factory);
    this.tokenDecimals = {};

    this.approve = this.approve.bind(this);
    this.isApproved = this.isApproved.bind(this);
    this.decimalsOf = this.decimalsOf.bind(this);
  }

  public approve(
    @isEthAddress('user')
    @isEthAddress('token')
    @isEthAddress('spender')
    @isPositiveAmount('amount')
    { user, token, spender, amount }: ApproveType
  ): EthereumTransactionTypeExtended {
    const erc20Contract: ERC20 = this.getContractInstance(token);

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () => erc20Contract.populateTransaction.approve(spender, amount),
      from: user,
    });

    return {
      tx: txCallback,
      txType: eEthereumTxType.ERC20_APPROVAL,
      gas: this.generateTxPriceEstimation([], txCallback),
    };
  }

  public async isApproved(
    @isEthAddress('user')
    @isEthAddress('token')
    @isEthAddress('spender')
    @isPositiveOrMinusOneAmount('amount')
    { user, token, spender, amount }: ApproveType
  ): Promise<boolean> {
    if (token.toLowerCase() === ZERO_ADDRESS.toLowerCase()) return true;
    const decimals = await this.decimalsOf({ token });
    const erc20Contract: ERC20 = this.getContractInstance(token);
    const allowance: BigNumber = await erc20Contract.allowance(user, spender);
    const amountBNWithDecimals: BigNumber =
      amount === '-1'
        ? BigNumber.from(MAX_ALLOWANCE)
        : BigNumber.from(valueToWei(amount, decimals));
    return allowance.gte(amountBNWithDecimals);
  }

  public async decimalsOf(
    @isEthAddress('token')
    { token }: DecimalsOfType
  ): Promise<number> {
    if (token.toLowerCase() === ZERO_ADDRESS.toLowerCase()) return 18;
    if (!this.tokenDecimals[token]) {
      const erc20Contract = this.getContractInstance(token);
      this.tokenDecimals[token] = await erc20Contract.decimals();
    }

    return this.tokenDecimals[token];
  }

  public async balanceOf(
    @isEthAddress('user')
    { token, user }: BalanceOfType
  ): Promise<number> {
    const erc20Contract = this.getContractInstance(token);
    const bnBalance = await erc20Contract.balanceOf(user);
    return Number(formatEther(bnBalance));
  }
}
function MAX_ALLOWANCE(MAX_ALLOWANCE: any): BigNumber {
  throw new Error('Function not implemented.');
}

