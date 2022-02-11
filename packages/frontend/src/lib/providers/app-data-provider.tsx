import { useSubscription } from '@apollo/client';
import { ethers, providers } from 'ethers';
import React, { useContext } from 'react';
import { User } from '../../types';
import { NetworkConfig, networkConfigs } from '../config';
import { PaymentToken, ProfileNftsDocument } from '../graphql';
import { ZERO_ADDRESS } from '../helpers/constants';
import { NftCollectionService } from '../helpers/NftCollection';
import { useWeb3 } from './web3-provider';

export interface AppDataContextType {
  networkConfig: NetworkConfig;
  jsonRpcProvider: providers.Provider;
  currentAccount?: string;
  nftCollectionService: NftCollectionService;
  userData: User | undefined;
  loadingUserData: boolean;
  availablePaymentTokens: Record<string, PaymentToken>;
}

const AppDataContext = React.createContext<AppDataContextType>({} as AppDataContextType);

export const AppDataProvider: React.FC = ({ children }) => {
  const { account, chainId } = useWeb3();

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
  const nftCollectionService = new NftCollectionService(
    provider,
    networkConfigs[chainId].collectionAddress
  );

  const { data, loading } = useSubscription(ProfileNftsDocument, {
    variables: {
      user: account ? account.toLowerCase() : '',
    },
  });
  const userData = data && data.user ? data.user : undefined;


  // Hard-coded for now, will come from subgraph
  const availablePaymentTokens: Record<string, PaymentToken> = {
    MATIC: {
      acceptable: true,
      id: ZERO_ADDRESS,
      symbol: 'MATIC',
      decimals: 18,
    },
  };

  return (
    <AppDataContext.Provider
      value={{
        networkConfig: networkConfigs[chainId],
        jsonRpcProvider: provider,
        currentAccount: account,
        nftCollectionService,
        userData,
        loadingUserData: loading,
        availablePaymentTokens,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppDataProvider = () => useContext(AppDataContext);
