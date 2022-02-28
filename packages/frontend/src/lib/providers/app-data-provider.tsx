import { useQuery, useSubscription } from '@apollo/client';
import { ethers, providers } from 'ethers';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { User } from '../../types';
import { ChainId, NetworkConfig, networkConfigs } from '../config';
import { PaymentToken, PaymentTokensDocument, ProfileNftsDocument } from '../graphql';
import { ZERO_ADDRESS } from '../helpers/constants';
import { NftCollectionService } from '../helpers/NftCollection';
import { useWeb3 } from './web3-provider';

export interface AppDataContextType {
  networkConfig: NetworkConfig;
  jsonRpcProvider: providers.Provider;
  mainnetProvider: providers.Provider; // isolated provider for mainnet, for resolving ens names
  nftCollectionService: NftCollectionService;
  currentAccount: string | undefined;
  userData: User | undefined; // created and collected nfts for user's connected wallet
  ensName: string | undefined; // ens name for user's connected wallet
  loadingUserData: boolean;
  availablePaymentTokens: Record<string, PaymentToken>;
  disconnectWallet: () => void;
  ensRegistry: Record<string, string>; // dictionary of ens responses
  lookupAddress: (address: string) => Promise<string>; // trigger ens lookup if address is not in registry
}

const AppDataContext = React.createContext<AppDataContextType>({} as AppDataContextType);

export const AppDataProvider: React.FC = ({ children }) => {
  const { account, chainId, disconnect } = useWeb3();
  const [ensName, setEnsName] = useState<string | undefined>(undefined);
  const [ensLoading, setEnsLoading] = useState<boolean>(false);
  const [ensRegistry, setEnsRegistry] = useState<Record<string, string>>({});

  // Provider setup for active network
  const config = networkConfigs[chainId];
  const rpcUrls = config.rpcUrls ? config.rpcUrls : [''];
  const jsonRpcProvider = new ethers.providers.StaticJsonRpcProvider(rpcUrls[0], chainId);
  let fallbackProvider: providers.Provider | undefined;
  if (rpcUrls.length > 1) {
    fallbackProvider = new ethers.providers.StaticJsonRpcProvider(rpcUrls[1]);
  }
  const provider: providers.Provider = fallbackProvider
    ? new providers.FallbackProvider([jsonRpcProvider, fallbackProvider])
    : jsonRpcProvider;

  // Setup batch provider for mainnet to reduce rpc calls for batch ENS lookups
  const mainnetConfig = networkConfigs[ChainId.mainnet];
  const mainnetProvider = useMemo<providers.Provider>(() => {
    const mainnetRpcUrls = mainnetConfig.rpcUrls ? mainnetConfig.rpcUrls : [''];
    const mainnetBaseProvider = new ethers.providers.JsonRpcBatchProvider(mainnetRpcUrls[0]);
    let mainnetFallbackProvider: providers.Provider | undefined;
    if (mainnetRpcUrls.length > 1) {
      mainnetFallbackProvider = new ethers.providers.StaticJsonRpcProvider(mainnetRpcUrls[1]);
    }
    return mainnetFallbackProvider
      ? new providers.FallbackProvider([mainnetBaseProvider, mainnetFallbackProvider])
      : mainnetBaseProvider;
  }, [mainnetConfig]);

  // load cache from localStorage on first page load
  useEffect(() => {
    const registry = window.localStorage.getItem('ensRegistry');
    if (registry) {
      setEnsRegistry(JSON.parse(registry ? registry : ''));
    }
  }, [])

  // Set ens name for user's connected wallet
  useEffect(() => {
    const lookupAddress = async (address: string) => {
      const name = await mainnetProvider.lookupAddress(address);
      setEnsLoading(false);
      const newRegistry = ensRegistry;
      newRegistry[address.toLowerCase()] = name ? name : address.toLowerCase();
      window.localStorage.setItem('ensRegistry', JSON.stringify(newRegistry));
      setEnsRegistry(newRegistry);
    }

    if (account) {
      if (!ensRegistry[account.toLowerCase()] && !ensLoading) {
        setEnsLoading(true);
        lookupAddress(account)
      }
      if (ensRegistry[account.toLowerCase()] !== account.toLowerCase()) {
        setEnsName(ensRegistry[account.toLowerCase()]);
      }
    }
  }, [account, ensLoading, ensRegistry, mainnetProvider])

  // Service for interacting with NFT collection contract
  const nftCollectionService = new NftCollectionService(
    provider,
    networkConfigs[chainId].collectionAddress
  );

  // Fetch created and collected NFT for user's connected wallet
  const { data, loading } = useSubscription(ProfileNftsDocument, {
    variables: {
      user: account ? account.toLowerCase() : '',
    },
  });
  const userData = data && data.user ? data.user : undefined;

  // Array of tokens which can be set as payment for time NFTs, Refresh every 5 minutes
  const { data: paymentTokenData } = useQuery(PaymentTokensDocument, {
    pollInterval: 300000,
  });

  // Hardcoded default
  let availablePaymentTokens: Record<string, PaymentToken> = {
    MATIC: {
      acceptable: true,
      id: ZERO_ADDRESS,
      symbol: 'MATIC',
      decimals: 18,
    },
  };

  if (paymentTokenData) {
    availablePaymentTokens = Object.assign(
      {},
      ...paymentTokenData.paymentTokens.map((token) => ({ [token.symbol]: token }))
    );
  }

  const disconnectWallet = () => {
    disconnect();
    setEnsName(undefined);
  };

  // Lookup ens name for address on mainnet
  const lookupAddress = async (address: string) => {
    const name = await mainnetProvider.lookupAddress(address)
    const newRegistry = ensRegistry;
    newRegistry[address.toLowerCase()] = name ? name : "NA";
    window.localStorage.setItem('ensRegistry', JSON.stringify(newRegistry));
    setEnsRegistry(newRegistry);
    return ensRegistry[address];
  };

  return (
    <AppDataContext.Provider
      value={{
        networkConfig: networkConfigs[chainId],
        jsonRpcProvider: provider,
        mainnetProvider,
        currentAccount: account,
        nftCollectionService,
        userData,
        ensName,
        loadingUserData: loading,
        availablePaymentTokens,
        disconnectWallet,
        lookupAddress,
        ensRegistry,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppDataProvider = () => useContext(AppDataContext);
