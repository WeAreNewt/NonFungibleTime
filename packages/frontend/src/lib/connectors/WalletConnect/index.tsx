import { IWCEthRpcConnectionOptions } from '@walletconnect/types';
import Web3WalletConnectProvider from '@walletconnect/web3-provider';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { ConnectorUpdate } from '@web3-react/types';
import { IEthereumProvider } from 'eip1193-provider';

interface IWalletConnectConnectorArguments extends IWCEthRpcConnectionOptions {
  supportedChainIds?: number[];
}

type Web3WalletConnectEthereumProvider = Web3WalletConnectProvider & IEthereumProvider;

export class UserRejectedRequestError extends Error {
  public constructor() {
    super();
    this.name = this.constructor.name;
    this.message = 'The user rejected the request.';
  }
}

export function resetWalletConnector(connector: AbstractConnector) {
  if (connector && connector instanceof WalletConnectConnector) {
    connector.walletConnectProvider = null;
  }
}
function getSupportedChains({
  supportedChainIds,
  rpc,
}: IWalletConnectConnectorArguments): number[] | undefined {
  if (supportedChainIds) {
    return supportedChainIds;
  }

  return rpc ? Object.keys(rpc).map((k) => Number(k)) : undefined;
}

/**
 * Modified version of: https://github.com/NoahZinsmeister/web3-react/blob/v6/packages/walletconnect-connector/src/index.ts
 * Uses @walletconnect/web3-provider instead of @walletconnect/ethereum-provider to workaround message signing.
 */
export class WalletConnectConnector extends AbstractConnector {
  public walletConnectProvider: Web3WalletConnectEthereumProvider | null = null;
  private readonly config: IWalletConnectConnectorArguments;

  constructor(config: IWalletConnectConnectorArguments) {
    super({ supportedChainIds: getSupportedChains(config) });

    this.config = config;

    this.handleChainChanged = this.handleChainChanged.bind(this);
    this.handleAccountsChanged = this.handleAccountsChanged.bind(this);
    this.handleDisconnect = this.handleDisconnect.bind(this);
  }

  private handleChainChanged(chainId: number | string): void {
    this.emitUpdate({ chainId });
  }

  private handleAccountsChanged(accounts: string[]): void {
    this.emitUpdate({ account: accounts[0] });
  }

  private handleDisconnect(): void {
    this.emitDeactivate();
  }

  public async activate(): Promise<ConnectorUpdate> {
    if (!this.walletConnectProvider) {
      this.walletConnectProvider = new Web3WalletConnectProvider(
        this.config,
      ) as Web3WalletConnectEthereumProvider;
    }

    this.walletConnectProvider.on('chainChanged', this.handleChainChanged.bind(this));
    this.walletConnectProvider.on('accountsChanged', this.handleAccountsChanged.bind(this));
    this.walletConnectProvider.on('disconnect', this.handleDisconnect.bind(this));

    const account = await this.walletConnectProvider
      .enable()
      .then((accounts: string[]): string => accounts[0] as string)
      .catch((error: Error) => {
        // TODO ideally this would be a better check
        if (error.message === 'User closed modal') {
          throw new UserRejectedRequestError();
        }

        return null;
      });

    return { provider: this.walletConnectProvider, account };
  }

  public async getProvider(): Promise<Web3WalletConnectEthereumProvider | null> {
    return this.walletConnectProvider;
  }

  public async getAccount(): Promise<null | string> {
    if (this.walletConnectProvider) {
      return Promise.resolve(this.walletConnectProvider.accounts).then(
        (accounts: string[]): string => accounts[0] as string,
      );
    }
    return null;
  }

  public getChainId(): Promise<string | number> {
    return Promise.resolve(this.walletConnectProvider?.chainId || '0');
  }

  public deactivate() {
    if (this.walletConnectProvider) {
      this.walletConnectProvider.removeListener('disconnect', this.handleDisconnect.bind(this));
      this.walletConnectProvider.removeListener('chainChanged', this.handleChainChanged.bind(this));
      this.walletConnectProvider.removeListener(
        'accountsChanged',
        this.handleAccountsChanged.bind(this),
      );
      void this.walletConnectProvider.disconnect();
    }
  }

  public async close() {
    this.emitDeactivate();
  }
}
