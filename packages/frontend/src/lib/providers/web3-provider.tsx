import { ExternalProvider, Web3Provider } from '@ethersproject/providers';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import React, { useCallback, useContext, useEffect } from 'react';
import * as z from 'zod';
import { addChainParameters, ChainId } from '../config';

const WALLET_TYPE_STORAGE_KEY = 'WALLET_TYPE';

export const WalletType = z.enum(['injected']);
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type WalletType = z.infer<typeof WalletType>;

export const injected = new InjectedConnector({});

export const connectors: Record<WalletType, AbstractConnector> = {
  injected,
  // Add more supported connectors
};

// No network toggle for now
const PROTOCOL_CHAIN = ChainId.mumbai;

export interface Web3DataContextType {
  chainId: number;
  connect: (walletType: WalletType) => Promise<void>;
  disconnect: () => Promise<void>;
  account: string | undefined;
  isCorrectChain: boolean;
  active: boolean;
  requestToSwitchChain: () => Promise<void>;
}

const Web3DataContext = React.createContext<Web3DataContextType>({} as Web3DataContextType);

export const Web3DataProvider: React.FC = ({ children }) => {
  const { chainId, account, activate, active, connector, deactivate } = useWeb3React<Web3Provider>();
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

  const disconnect = useCallback(
   async () => {
     try {
          await deactivate()
          localStorage.removeItem(WALLET_TYPE_STORAGE_KEY);
     }
     catch {
       //todo: add error msg
       console.log("error when deactivating wallet")
     }
    },
    [deactivate]
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

  return (
    <Web3DataContext.Provider
      value={{
        connect,
        account: account ? account : undefined,
        isCorrectChain,
        active,
        requestToSwitchChain,
        chainId: PROTOCOL_CHAIN,
        disconnect,
      }}
    >
      {children}
    </Web3DataContext.Provider>
  );
};

export const useWeb3 = () => useContext(Web3DataContext);
