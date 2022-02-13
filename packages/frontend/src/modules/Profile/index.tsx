import React, { useEffect, useState } from 'react';
import { FaShareAlt } from 'react-icons/fa';
import ClockSpinner from '../../images/clock-loader.webp';
import { useLocation, useNavigate } from 'react-router-dom';
import NFTCard from '../../components/NFTCard';
import { useAppDataProvider } from '../../lib/providers/app-data-provider';
import { NFT, User } from '../../types';
import { Dialog, Tab } from '@headlessui/react';
import { NFTGrid } from '../../components/NFTGrid';
import { ProfileNftsDocument } from '../../lib/graphql';
import { useSubscription } from '@apollo/client';
import makeBlockie from 'ethereum-blockies-base64';
import classnames from 'classnames';
import ConnectButton from '../../components/ConnectButton';
import 'react-datepicker/dist/react-datepicker.css';
import { Button, ButtonVariant } from '../../components/Button';
import MintModal from '../../components/MintModal';
import { isAddress } from 'ethers/lib/utils';

export default function Profile() {
  const { currentAccount, userData, loadingUserData, } =
    useAppDataProvider();
  const navigate = useNavigate();
  const [owner, setOwner] = useState<Boolean>(true);
  const [toggleIndex, setToggleIndex] = useState<number>(0);
  const [mintModalOpen, setMintModalOpen] = useState<boolean>(false);
  const [shareProfileModalOpen, setShareProfileModalOpen] = useState<boolean>(false);
  const location = useLocation();
  const path = location.pathname.split('/');
  const accountName = path[2] ? path[2] : '';

  useEffect(() => {
    if (accountName.toLowerCase() === currentAccount?.toLowerCase()) {
      setOwner(true);
    } else {
      setOwner(false);
    }
    if (path[3] === 'mint') {
      navigate('/profile/' + (currentAccount ? currentAccount : ''))
      setMintModalOpen(true)
    }
  }, [path, currentAccount, navigate, accountName]);

  // If user is the profile owner, use data from app provider
  // Otherwise fetch data from subgraph
  let sanitizedUser = ''
  if (!owner && isAddress(accountName)) {
    sanitizedUser = accountName.toLowerCase();
  }
  const { data, loading, error } = useSubscription(ProfileNftsDocument, {
    variables: {
      user: sanitizedUser,
      where:{ owner_not: "0x0000000000000000000000000000000000000000" }
    },
  });
  const categories = ['Minted', 'Owned'];
  // Use app-data-provider for pre-loaded data if user if profile owner, otherwise use separate subscription
  const user: User | undefined = owner ? userData : (data && data.user ? data.user : undefined);
  const userLoading: boolean = owner ? loadingUserData : loading;
  const [nftsShown, setNftsShown] = useState<NFT[]>(user?.createdNfts ? user?.createdNfts : []);
  useEffect(() => {
    if (user?.createdNfts && toggleIndex === 0) {
      setNftsShown(user.createdNfts);
    }
    if (user?.ownedNfts && toggleIndex === 1) {
      setNftsShown(user.ownedNfts);
    }
  }, [user, toggleIndex]);

  const onChangeTab = (index: number) => {
    if (index === 0) {
      setToggleIndex(0);
      setNftsShown(user?.createdNfts ? user?.createdNfts : []);
    } else {
      setToggleIndex(1);
      setNftsShown(user?.ownedNfts ? user?.ownedNfts : []);
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
        <div className="w-1/3 text-center mx-auto align-middle">
          <div className="text-black dark:text-white font-bold text-xl p-20">
            No Wallet Connected
          </div>
          <div className="w-1/3 mx-auto">
            <ConnectButton />
          </div>
        </div>
      </div>)
  }

  // If there is no user, data is either errored, loading, or no data
  // If there is no data and the pathname is a valid address, ithis block is skipped and the profile is displayed as empty
  if (!user) {
    if (error) {
      return <div className="h-screen">
        <div className="w-1/3 text-center mx-auto align-middle">
          <div className="text-red font-bold text-xl p-20">
            An Error occured: {error.toString()}
          </div>
        </div>
      </div>
    } else if (loadingUserData) {
      return <div className="w-1/5 mx-auto p-4 pb-0">
        <img alt="clock spinner" src={ClockSpinner} width={50} height={50} />
      </div>;
    } else if (!accountName || !isAddress(accountName)) {
      return (<div className="h-screen">
        <div className="w-1/3 text-center mx-auto align-middle">
          <div className="text-black dark:text-white font-bold text-xl p-20">
            Invalid ETH Address
          </div>
        </div>
      </div>)
    }
  }

  // If the path contains a valid ethereum address, display profile data
  return (
    <div className="bg-slate-100 dark:bg-black">
      <div className="flex flex-col max-w-7xl m-auto">
        <div className="p-4 md:p-10">
          <div className="flex flex-col gap-4 md:flex-row justify-between items-center">
            {/** Profile Header */}
            <div className="w-full md:w-1/4  justify-items-start ">
              <div className="flex flex-row items-center gap-4">
                {/** Avatar/Blockie */}
                <img
                  alt="blockie or ens avatar"
                  src={makeBlockie(accountName)}
                  className="rounded-full w-40"
                />
                {/** ENS Name/Address */}
                <div className="text-black dark:text-white">{accountName}</div>
              </div>
            </div>
            {/** Share Profile */}
            <div className="flex md:px-5 w-full md:justify-end ">
              <div className="flex gap-4 flex-1 md:flex-initial  ">
                <Button
                  variant={ButtonVariant.SECONDARY}
                  onClick={() => setShareProfileModalOpen(true)}
                >
                  <FaShareAlt /> Share Profile
                </Button>
                {/** Mint */}
                {owner && (
                  <Button
                    onClick={() => {
                      setMintModalOpen(true);
                    }}
                  >
                    Mint new
                  </Button>
                )}
                {/** Mint Modal */}
                <MintModal open={mintModalOpen} onClose={() => setMintModalOpen(false)} />
                {/** Share Profile Modal */}
                <Dialog
                  open={shareProfileModalOpen}
                  onClose={() => setShareProfileModalOpen(false)}
                  className="fixed z-10 inset-0 overflow-y-auto"
                  aria-labelledby="modal-title"
                  role="dialog"
                  aria-modal="true"
                >
                  <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div
                      className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                      aria-hidden="true"
                    ></div>

                    <span
                      className="hidden sm:inline-block sm:align-middle sm:h-screen"
                      aria-hidden="true"
                    >
                      &#8203;
                    </span>

                    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                      <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                            <h3
                              className="text-lg leading-6 font-medium text-gray-900"
                              id="modal-title"
                            >
                              Share Profile
                            </h3>
                            <div className="mt-2">
                              <div>
                                <label
                                  htmlFor="profile-link"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Profile Link
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                  <input
                                    disabled={true}
                                    type="text"
                                    name="profile-link"
                                    id="price"
                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                                    placeholder={window.location.href}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                          type="button"
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm"
                          onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                          }}
                        >
                          Copy URL
                        </button>
                        <button
                          type="button"
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                          onClick={() => setShareProfileModalOpen(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </Dialog>
              </div>
            </div>
          </div>
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
          {userLoading ? <div className="w-1/5 mx-auto p-4 pb-0">
            <img alt="clock spinner" src={ClockSpinner} width={50} height={50} />
          </div> : renderNFTs()}
        </div>
      </div >
    </div >
  );
}
