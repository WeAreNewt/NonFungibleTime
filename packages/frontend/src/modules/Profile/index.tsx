import React, { useEffect, useState } from 'react';
import ClockSpinner from '../../images/clock-loader.webp';
import { useLocation, useNavigate } from 'react-router-dom';
import NFTCard from '../../components/NFTCard';
import { useAppDataProvider } from '../../lib/providers/app-data-provider';
import { NFT, User } from '../../types';
import { Tab } from '@headlessui/react';
import { NFTGrid } from '../../components/NFTGrid';
import { ProfileNftsDocument } from '../../lib/graphql';
import { useSubscription } from '@apollo/client';
import classnames from 'classnames';
import ConnectButton from '../../components/ConnectButton';
import 'react-datepicker/dist/react-datepicker.css';
import { isAddress } from 'ethers/lib/utils';
import { ZERO_ADDRESS } from '../../lib/helpers/constants';
import { ProfileHeader } from '../../components/ProfileHeader';

interface ProfileNameState {
  loadingAddress: boolean;
  address: string | undefined;
  loadingName: boolean;
  name: string | undefined;
}

export default function Profile() {
  const { currentAccount, userData, loadingUserData, mainnetProvider, ensName, lookupAddress, ensRegistry } =
    useAppDataProvider();
  const navigate = useNavigate();
  const [owner, setOwner] = useState<boolean>(true);
  const [toggleIndex, setToggleIndex] = useState<number>(0);
  const [nameStatus, setNameStatus] = useState<ProfileNameState>(
    {
      loadingAddress: false,
      loadingName: false,
      name: undefined,
      address: undefined,
    }
  );
  const [mintPathSet, setMintPathSet] = useState<boolean>(false);
  const [resolveError, setResolveError] = useState<string | undefined>(undefined); // If pathname is not an address or valid ens name
  const location = useLocation();
  const path = location.pathname.split('/');
  const accountName = path[2] ? path[2] : '';

  // Determine is connected wallet is profile owner
  // Resolve and set profile ens name and/or address based on pathname
  useEffect(() => {
    // ensName -> address
    const resolveName = async (name: string) => {
      const address = await mainnetProvider.resolveName(name);
      if (address) {
        setNameStatus({
          loadingAddress: false,
          loadingName: false,
          name,
          address,
        })
        setResolveError(undefined);
      } else {
        setNameStatus({
          ...nameStatus,
          loadingName: false,
          loadingAddress: false,
        })
        setResolveError(`Cannot resolve ens name ${name}`)
      }
    }

    // address -> ensName
    const lookup = async (address: string) => {
      const name = await lookupAddress(address);
      setNameStatus({
        ...nameStatus,
        loadingName: false,
        name,
      })
    }

    // determine if connected wallet is profile owner
    if (accountName.toLowerCase() === currentAccount?.toLowerCase() || accountName.toLowerCase() === ensName?.toLowerCase()) {
      setOwner(true);
    } else {
      setOwner(false);
    }

    // if user is profile owner and mint is added to pathname, open mint modal
    if (owner && path[3] === 'mint') {
      navigate('/profile/' + (ensName ? ensName : currentAccount ? currentAccount : ''))
      setMintPathSet(true)
    }

    // set profile address based on pathname or resolve from ens
    if (!nameStatus.address && !resolveError) {
      if (isAddress(accountName)) {
        setResolveError(undefined);
        const address = accountName.toLowerCase()
        setNameStatus({
          ...nameStatus,
          address,
          loadingAddress: false,
        })
      } else if (!nameStatus.loadingAddress) {
        // if path is not an address and not already loading, treat path as an ens name and attempt to resolve
        setNameStatus({
          ...nameStatus,
          loadingAddress: true,
        })
        resolveName(accountName);
      }
    }

    // if ens name is not set and not already loading, lookup address in ensRegistry or lookup if not found
    if (nameStatus.address && !nameStatus.name) {
      if (ensRegistry[nameStatus.address]) {
        setNameStatus({
          ...nameStatus,
          name: ensRegistry[nameStatus.address],
        })
      } else if (!nameStatus.loadingName) {
        setNameStatus({
          ...nameStatus,
          loadingName: true,
        })
        lookup(nameStatus.address);
      }
    }
  }, [accountName, currentAccount, ensName, ensRegistry, lookupAddress, mainnetProvider, nameStatus, navigate, owner, path, resolveError])

  // If user is the profile owner, use data from app provider
  // Otherwise fetch data from subgraph
  let sanitizedUser = '';
  if (!owner && nameStatus.address) {
    sanitizedUser = nameStatus.address.toLowerCase()
  }
  const { data, loading, error } = useSubscription(ProfileNftsDocument, {
    variables: {
      user: sanitizedUser,
    },
  });

  const categories = ['Created', 'Collected'];
  // Use app-data-provider for pre-loaded data if user if profile owner, otherwise use separate subscription
  const user: User | undefined = owner ? userData : (data && data.user ? data.user : undefined);
  const userLoading: boolean = owner ? loadingUserData : loading;
  const [nftsShown, setNftsShown] = useState<NFT[]>([]);

  useEffect(() => {
    if (user?.createdNfts || user?.ownedNfts) {
      if (toggleIndex === 0) {
        const filtered = user.createdNfts.filter(nft => nft.owner.id !== ZERO_ADDRESS);
        setNftsShown(filtered.sort((nftA, nftB) => nftA.mintTimestamp > nftB.mintTimestamp ? -1 : 1));
      }
      if (toggleIndex === 1) {
        const filtered = user.ownedNfts.filter(nft => nft.owner.id !== ZERO_ADDRESS);
        setNftsShown(filtered.sort((nftA, nftB) => nftA.mintTimestamp > nftB.mintTimestamp ? -1 : 1));
      }
    }
    else {
      setNftsShown([])
    }
  }, [user, toggleIndex]);

  const onChangeTab = (index: number) => {
    if (index === 0) {
      setToggleIndex(0);
    } else {
      setToggleIndex(1);
    }
  };
  const renderNFTs = () => {
    const copy = `No ${categories[toggleIndex].toLowerCase()} NFTs for this address.`;
    return (
      !nftsShown.length ? (
        <div className="text-xl text-center font-medium text-blue-700 ">{copy}</div>
      ) : (
        <NFTGrid>
          {nftsShown.map((nft, index) => {
            return <NFTCard key={index} nft={nft} />;
          })}
        </NFTGrid>
      )
    );
  };

  // If user does not have a wallet connected and is not viewing another profile, only display wallet connect button
  // Any other pathname is treated as a profile address
  if (location.pathname === '/profile/') {
    return (
      <div className="h-screen">
        <div className="w-full text-center mx-auto align-middle">
          <div className="text-black dark:text-white font-bold text-xl p-20">
            No Wallet Connected
          </div>
          <div className="w-1/3 mx-auto">
            <ConnectButton />
          </div>
        </div>
      </div>)
  }

  // Display error or loading screens
  if (!user || !nameStatus.address) {
    if (error) {
      return <div className="h-screen">
        <div className="w-1/3 text-center mx-auto align-middle">
          <div className="text-red font-bold text-xl p-20">
            An Error occured: {error.toString()}
          </div>
        </div>
      </div>
    } else if (resolveError) {
      return <div className="h-screen">
        <div className="w-1/3 text-center mx-auto align-middle">
          <div className="text-red font-bold text-xl p-20">
            An Error occured: {resolveError}
          </div>
        </div>
      </div>
    } else if (loadingUserData || nameStatus.loadingAddress) {
      return <div className="w-full md:w-1/5 mx-auto p-4 pb-0">
        <img alt="clock spinner" src={ClockSpinner} width={50} height={50} className="mx-auto" />
      </div>;
    } else if (!accountName || !nameStatus.address || !isAddress(nameStatus.address)) {
      return (<div className="h-screen">
        <div className="w-1/3 text-center mx-auto align-middle">
          <div className="text-black dark:text-white font-bold text-xl p-20">
            Invalid ETH Address or ENS name
          </div>
        </div>
      </div>)
    }
  }

  // If the path contains a valid ethereum address or ens name, display profile data
  return (
    <div className="bg-slate-100 dark:bg-gray-800">
      <div className="flex flex-col max-w-7xl m-auto">
        <div className="p-4 md:p-10">
          <ProfileHeader profileAddress={nameStatus.address ? nameStatus.address : ''} profileENS={nameStatus.name !== nameStatus.address ? nameStatus.name : undefined} owner={owner} mintPathSet={mintPathSet} />
          <Tab.Group onChange={(index) => onChangeTab(index)}>
            <Tab.List>
              {categories.map((category) => {
                return (
                  <Tab
                    key={category}
                    className={({ selected }) =>
                      classnames(
                        'w-4/12  py-5 text-sm leading-2 font-medium text-blue-700 mb-10',
                        selected
                          ? 'dark:text-white border-b-2 border-indigo-600'
                          : 'dark:text-white hover:bg-white/[0.12] hover:dark:text-white'
                      )
                    }
                  >
                    {category}
                  </Tab>
                );
              })}
            </Tab.List>
          </Tab.Group>
          {userLoading ? <div className="w-full md:w-1/5 mx-auto p-4 pb-0">
            <img alt="clock spinner" src={ClockSpinner} width={50} height={50} className="mx-auto" />
          </div> : renderNFTs()}
        </div>
      </div >
    </div >
  );
}
