import { ExternalProvider, Web3Provider } from '@ethersproject/providers';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { useWeb3React, Web3ReactProvider } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import React, { useCallback, useEffect } from 'react';
import * as z from 'zod';
import { addChainParameters, Networks } from './chains';

const WALLET_TYPE_STORAGE_KEY = 'WALLET_TYPE';

export const WalletType = z.enum(['injected']);
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type WalletType = z.infer<typeof WalletType>;

export const injected = new InjectedConnector({});

export const connectors: Record<WalletType, AbstractConnector> = {
  injected,
  // Add more supported connectors
};

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

const PROTOCOL_CHAIN = Networks.POLYGON_MAINNET;

export const useWeb3 = () => {
  const { chainId, account, activate, active, connector } = useWeb3React<Web3Provider>();
  const isCorrectChain = chainId === PROTOCOL_CHAIN;

  const connect = useCallback(
    async (walletType: WalletType) => {
      switch (walletType) {
        case WalletType.Values.injected:
          await activate(injected, (error) => {
            console.log('Error: ', error);
          });
          localStorage.setItem(WALLET_TYPE_STORAGE_KEY, walletType);
          break;
        default:
          throw new Error('Wallet not supported');
      }
    },
    [activate]
  );

  const requestToSwitchChain = useCallback(
    async function () {
      const provider: ExternalProvider = await connector?.getProvider();

      if (provider?.isMetaMask) {
        await provider.request?.({
          method: 'wallet_addEthereumChain',
          params: [addChainParameters[PROTOCOL_CHAIN]],
        });
        await provider.request?.({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: PROTOCOL_CHAIN }],
        });
      }
    },
    [connector]
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
    isCorrectChain,
    active,
    requestToSwitchChain,
  };
};

export const Provider: React.FC = ({ children }) => {
  return <Web3ReactProvider getLibrary={getLibrary}>{children}</Web3ReactProvider>;
};
