import { useQuery, useSubscription } from '@apollo/client';
import { ethers, providers } from 'ethers';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { RiskSeverity, User } from '../../types';
import { NetworkConfig, networkConfigs } from '../config';
import { PaymentToken, PaymentTokensDocument, ProfileNftsDocument } from '../graphql';
import { ZERO_ADDRESS } from '../helpers/constants';
import { NftCollectionService } from '../helpers/NftCollection';
import { useWeb3 } from './web3-provider';
import { Buffer } from 'buffer';


export interface AppDataContextType {
  networkConfig: NetworkConfig;
  jsonRpcProvider: providers.Provider;
  currentAccount?: string;
  nftCollectionService: NftCollectionService;
  userData: User | undefined;
  loadingUserData: boolean;
  availablePaymentTokens: Record<string, PaymentToken>;
  trmRisk: RiskSeverity | undefined;
}

const AppDataContext = React.createContext<AppDataContextType>({} as AppDataContextType);

const trmUrl = 'https://api.trmlabs.com/public/v2/screening/addresses'


export const AppDataProvider: React.FC = ({ children }) => {
  const { account, chainId } = useWeb3();
  const [trmRisk, setTrmRisk] = useState<RiskSeverity | undefined>(undefined);


  // On user address change, run TRM screening
  const trmScreening = useCallback(async () => {
    try {
      const response = await fetch(trmUrl, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + Buffer.from(`${process.env.REACT_APP_TRM_USERNAME}:${process.env.REACT_APP_TRM_PASSWORD}`).toString('base64')
        },
        body: JSON.stringify([
          {
            address: account,
            chain: 'ethereum',
          }
        ])
      })
      const trm = await response.json();
      console.log(trm);
      const screening = trm.data as string[];
      if (screening.includes(RiskSeverity.SEVERE)) {
        setTrmRisk(RiskSeverity.SEVERE);
      } else {
        setTrmRisk(undefined);
      }
      console.log(screening);
    } catch (error) {
      console.log(`Error fetching TRM screening: ${error}`)
    }
  }, [account])


  useEffect(() => {
    if (account) {
      trmScreening();
    }
  }, [account, trmScreening])


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


  // Refresh every 5 minutes
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
    availablePaymentTokens = Object.assign({}, ...paymentTokenData.paymentTokens.map((token) => (
      { [token.symbol]: token }
    )))
  }

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
        trmRisk,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppDataProvider = () => useContext(AppDataContext);
