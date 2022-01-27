import React, { useCallback, useEffect } from 'react';

import { useWeb3React, Web3ReactProvider } from '@web3-react/core';

import { InjectedConnector } from '@web3-react/injected-connector';
import { Web3Provider } from '@ethersproject/providers';
import { AbstractConnector } from '@web3-react/abstract-connector';
import * as z from 'zod';

const WALLET_TYPE_STORAGE_KEY = 'WALLET_TYPE';

export const WalletType = z.enum(['injected']);
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type WalletType = z.infer<typeof WalletType>;

export const injected = new InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42] });

export const connectors: Record<WalletType, AbstractConnector> = {
  injected,
  // Add more supported connectors
};

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

export const useWeb3 = () => {
  const { chainId, account, activate } = useWeb3React<Web3Provider>();

  const connect = useCallback(
    async (walletType: WalletType) => {
      switch (walletType) {
        case WalletType.Values.injected:
          await activate(injected);
          localStorage.setItem(WALLET_TYPE_STORAGE_KEY, walletType);
          break;
        default:
          throw new Error('Wallet not supported');
      }
    },
    [activate]
  );

  useEffect(() => {
    const previouslyConnectedWalletType = localStorage.getItem(
      WALLET_TYPE_STORAGE_KEY
    ) as WalletType;
    if (
      previouslyConnectedWalletType &&
      WalletType.parse(previouslyConnectedWalletType) &&
      connectors[previouslyConnectedWalletType]
    ) {
      connect(previouslyConnectedWalletType);
    }
  }, [connect]);

  return {
    connect,
    account,
  };
};

export const Provider: React.FC = ({ children }) => {
  return <Web3ReactProvider getLibrary={getLibrary}>{children}</Web3ReactProvider>;
};
