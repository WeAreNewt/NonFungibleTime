import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import ScreenWrapper from './components/ScreenWrapper';
import { Home } from './modules/Home';
import Profile from './modules/Profile';
import Marketplace from './modules/Marketplace';
import Details from './modules/NFTDetails';
import TermsAndConditions from './modules/TermsAndConditions';
import PrivacyPolicy from './modules/PrivacyPolicy';
import { Web3DataProvider } from './lib/providers/web3-provider';
import { AppDataProvider } from './lib/providers/app-data-provider';
import { Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';
import { ThemeProvider } from './ThemeContext';
import { createApolloClient } from './apollo/client';
import { ApolloProvider } from '@apollo/client';
import { ErrorBoundary } from './ErrorBoundary';
import { ChainId, networkConfigs } from './lib/config';
import { ViewportProvider } from './lib/providers/viewport-provider';

function getWeb3Library(provider: any): ethers.providers.Web3Provider {
  return new ethers.providers.Web3Provider(provider);
}

const chainId =
  process.env.REACT_APP_SELECTED_ENVIRONMENT === 'production' ? ChainId.polygon : ChainId.mumbai;

const apolloClient = createApolloClient({
  httpUri: networkConfigs[chainId].subgraphHttpLink,
  wsUri: networkConfigs[chainId].subgraphWsLink,
});

function App() {
  return (
    <ErrorBoundary>
      <ApolloProvider client={apolloClient}>
        <ThemeProvider>
          <Web3ReactProvider getLibrary={getWeb3Library}>
            <Web3DataProvider>
              <AppDataProvider>
                <BrowserRouter>
                  <ViewportProvider>
                    <ScreenWrapper>
                      <Routes>
                        <Route path="/" element={<Home />} key="home" />
                        <Route path="/profile/*" element={<Profile />} key="profile" />
                        <Route path="/marketplace" element={<Marketplace />} key="marketplace" />
                        <Route path="/nft/*" element={<Details />} key="details" />
                        <Route
                          path="/terms-and-conditions"
                          element={<TermsAndConditions />}
                          key="terms-and-conditions"
                        />
                        <Route
                          path="/privacy-policy"
                          element={<PrivacyPolicy />}
                          key="privacy-policy"
                        />
                      </Routes>
                    </ScreenWrapper>
                  </ViewportProvider>
                </BrowserRouter>
              </AppDataProvider>
            </Web3DataProvider>
          </Web3ReactProvider>
        </ThemeProvider>
      </ApolloProvider>
    </ErrorBoundary>
  );
}

export default App;
