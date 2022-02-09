import React, { useEffect, useState } from 'react';
import { FaExternalLinkAlt, FaRegWindowClose, FaShareAlt, FaSpinner } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import NFTCard from '../../components/NFTCard';
import { useAppDataProvider } from '../../lib/providers/app-data-provider';
import { Category, NFT, User } from '../../types';
import { Dialog, Tab } from '@headlessui/react';
import { BigNumber } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { MintParamsType } from '../../lib/helpers/NftCollection';
import { NFTGrid } from '../../components/NFTGrid';
import { ProfileNftsDocument } from '../../lib/graphql';
import { useSubscription } from '@apollo/client';
import makeBlockie from 'ethereum-blockies-base64';
import DatePicker from 'react-datepicker';
import classnames from 'classnames';
import ConnectButton from '../../components/ConnectButton';
import 'react-datepicker/dist/react-datepicker.css';
import { Input, Label, Select } from '../../components/Forms';
import { TransactionResponse } from '@ethersproject/providers';
import { Button, ButtonVariant } from '../../components/Button';
import classNames from 'classnames';
import { isAddress } from 'ethers/lib/utils';

interface MintNftParams {
  name: string;
  description: string;
  category: string;
  duration: number;
  availabilityTo: number;
  availabilityFrom: number;
  royalty: number;
}

interface TxStatus {
  submitted: boolean;
  confirmed: boolean;
  txHash?: string;
}

export default function Profile() {
  const { currentAccount, nftCollectionService, userData, loadingUserData, networkConfig } =
    useAppDataProvider();
  const { library: provider } = useWeb3React();
  const [owner, setOwner] = useState<Boolean>(true);
  const [formError, setFormError] = useState<string | undefined>(undefined);
  const [toggleIndex, setToggleIndex] = useState<number>(0);
  const [formNft, setFormNft] = useState<MintNftParams>({
    name: '',
    description: '',
    category: '',
    duration: 1,
    availabilityTo: 0,
    availabilityFrom: 0,
    royalty: 0,
  });
  const [mintModalOpen, setMintModalOpen] = useState<boolean>(false);
  const [shareProfileModalOpen, setShareProfileModalOpen] = useState<boolean>(false);
  const [mintTxStatus, setMintTxStatus] = useState<TxStatus>({
    submitted: false,
    confirmed: false,
  });
  const location = useLocation();
  const path = location.pathname.split('/');
  const baseUrl = 'https://elated-kalam-a67780.netlify.app'; // Preview Deploy

  useEffect(() => {
    if (path[2] === currentAccount) {
      setOwner(true);
    } else {
      setOwner(false);
    }
  }, [path, currentAccount]);

  // If user is the profile owner, use data from app provider
  // Otherwise fetch data from subgraph
  const { data, loading } = useSubscription(ProfileNftsDocument, {
    variables: {
      user: owner ? '' : path[2].toLowerCase(),
    },
  });
  const categories = ['Minted', 'Owned'];
  const user: User | undefined = owner ? userData : data && data.user ? data.user : undefined;
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
      setNftsShown(user?.createdNfts ? user?.createdNfts : ([] as NFT[]));
    } else {
      setToggleIndex(1);
      setNftsShown(user?.ownedNfts ? user?.ownedNfts : ([] as NFT[]));
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
  const mintNft = async () => {
    if (currentAccount) {
      if (formNft.duration > 0 && formNft.name && formNft.description && formNft.category) {
        if (
          formNft.availabilityTo === 0 ||
          formNft.availabilityFrom === 0 ||
          (formNft.availabilityTo > formNft.availabilityFrom &&
            formNft.duration * 3600 <= formNft.availabilityTo - formNft.availabilityFrom)
        ) {
          if (formNft.royalty <= 100) {
            const input: MintParamsType = {
              userAddress: currentAccount,
              name: formNft.name,
              description: formNft.description,
              category: formNft.category,
              availabilityFrom: formNft.availabilityFrom,
              availabilityTo: formNft.availabilityTo,
              duration: formNft.duration * 3600, // in seconds
              royaltyBasisPoints: formNft.royalty * 100, // out of 10000
            };
            setFormError(undefined);
            const txs = await nftCollectionService.mint(input);
            const tx = txs[0];
            const extendedTxData = await tx.tx();
            const { from, ...txData } = extendedTxData;
            const signer = provider.getSigner(from);
            const txResponse: TransactionResponse = await signer.sendTransaction({
              ...txData,
              value: txData.value ? BigNumber.from(txData.value) : undefined,
            });
            setMintTxStatus({ ...mintTxStatus, submitted: true });
            const receipt = await txResponse.wait(1);
            setMintTxStatus({ ...mintTxStatus, confirmed: true, txHash: receipt.transactionHash });
          } else {
            setFormError('Royalty must be between 1 and 100');
          }
        } else {
          setFormError('availabilityTo must be greater than availablilityFrom + duration');
        }
      } else {
        setFormError('Name, Description, Category, and Duration are required fields');
      }
    } else {
      setFormError('No account connected');
    }
  };

  // If user does not have a wallet connected and is not viewing another profile, only display wallet connect button
  if (!currentAccount && !isAddress(path[2])) {
    return <div className="h-screen">
      <div className="w-1/3 text-center mx-auto align-middle">
        <div className="text-black dark:text-white font-bold text-xl p-20">
          No Wallet Connected
        </div>
        <div className="w-1/3 mx-auto">
          <ConnectButton />
        </div>
      </div>
    </div>
  }

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
                  src={makeBlockie(path[2])}
                  className="rounded-full w-40"
                />
                {/** ENS Name/Address */}
                <div className="text-black dark:text-white">{path[2]}</div>
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
                      setMintTxStatus({ submitted: false, confirmed: false, txHash: undefined });
                    }}
                  >
                    Mint new
                  </Button>
                )}
                {/** Mint Modal */}
                <Dialog
                  open={mintModalOpen}
                  onClose={() => setMintModalOpen(false)}
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
                      <div className="bg-white p-10">
                        <div className="flex">
                          <div className="w-full space-y-5">
                            <div className="flex flex-row justify-between">
                              <h3
                                className="text-lg leading-6 font-semibold text-gray-900"
                                id="modal-title"
                              >
                                Mint Time NFT
                              </h3>
                              <div className="cursor-pointer text-xl" onClick={() => setMintModalOpen(false)}>
                                <FaRegWindowClose className="hover:text-red-500" />
                              </div>
                            </div>

                            {mintTxStatus.submitted ? (
                              <div className="text-center flex-col p-4">
                                <div className="font-semibold">Transaction Submitted</div>
                                <FaSpinner className="text-indigo-600 text-xl animate-spin inline-block" />
                              </div>
                            ) : mintTxStatus.confirmed ? (
                              <div className="text-center flex-col">
                                <div className="font-semibold">Transaction Confirmed</div>
                                <div className="pt-4">
                                  <a target="_blank" rel="noopener noreferrer" className="cursor-pointer p-5" href={networkConfig.blockExplorer + '/tx/' + mintTxStatus.txHash}>
                                    View Transaction <FaExternalLinkAlt className="inline-block" />
                                  </a>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-5">
                                <div className="">
                                  <div>
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                      name="name"
                                      id="name"
                                      placeholder="Name for your service..."
                                      value={formNft.name}
                                      onChange={(e) =>
                                        setFormNft({ ...formNft, name: e.target.value })
                                      }
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label htmlFor="description">Description</Label>
                                  <Input
                                    type="text"
                                    name="description"
                                    id="description"
                                    placeholder="Describe your service..."
                                    value={formNft.description}
                                    onChange={(e) =>
                                      setFormNft({ ...formNft, description: e.target.value })
                                    }
                                  />
                                </div>
                                <div className="flex gap-4">
                                  <div className="w-1/2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select
                                      id="category"
                                      name="category"
                                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full py-2 placeholder-gray-400 border-gray-300 rounded-md"
                                      value={formNft.category}
                                      onChange={(e) =>
                                        setFormNft({ ...formNft, category: e.target.value })
                                      }
                                    >
                                      <option key={''}>-</option>
                                      {Object.values(Category).sort().map((category, index) => (
                                        <option key={index}>{category}</option>
                                      ))}
                                    </Select>
                                  </div>
                                  <div className="w-1/2">
                                    <Label>Number Of Hours</Label>
                                    <Input
                                      type="number"
                                      name="numhours"
                                      id="numhours"
                                      placeholder="Add time..."
                                      value={formNft.duration}
                                      onChange={(e) =>
                                        setFormNft({ ...formNft, duration: Number(e.target.value) })
                                      }
                                    />
                                  </div>
                                </div>

                                <div>
                                  <Label>Beginning Of Availability (optional)</Label>

                                  <div
                                    className={classNames("md:w-14 md:h-7 w-12 h-6 flex items-center rounded-full p-1 cursor-pointer", { "bg-gray-300": formNft.availabilityFrom === 0 }, { "bg-green-300": formNft.availabilityFrom !== 0 })}
                                    onClick={() => {
                                      setFormNft({
                                        ...formNft,
                                        availabilityFrom:
                                          formNft.availabilityFrom === 0
                                            ? Math.floor(
                                              Date.now() / 1000 - ((Date.now() / 1000) % 300)
                                            )
                                            : 0,
                                      });
                                    }}
                                  >
                                    <div
                                      className={
                                        classNames('bg-white md:w-6 md:h-6 h-5 w-5 rounded-full shadow-md transform', { 'transform translate-x-6': formNft.availabilityFrom !== 0 })
                                      }
                                    />
                                  </div>

                                  <DatePicker
                                    className={classNames('my-2', { 'cursor-pointer': formNft.availabilityFrom !== 0 })}
                                    selected={formNft.availabilityFrom !== 0 ? new Date(formNft.availabilityFrom * 1000) : undefined}
                                    placeholderText='ANY'
                                    onChange={(date) =>
                                      setFormNft({
                                        ...formNft,
                                        availabilityFrom: date
                                          ? Math.floor(date.getTime() / 1000)
                                          : 0,
                                      })
                                    }
                                    disabled={formNft.availabilityFrom === 0}
                                  />

                                </div>
                                <div>
                                  <Label>End Of Availablility (optional)</Label>
                                  <div
                                    className={classNames("md:w-14 md:h-7 w-12 h-6 flex items-center rounded-full p-1 cursor-pointer", { "bg-gray-300": formNft.availabilityTo === 0 }, { "bg-green-300": formNft.availabilityTo !== 0 })}
                                    onClick={() => {
                                      setFormNft({
                                        ...formNft,
                                        availabilityTo:
                                          formNft.availabilityTo === 0
                                            ? Math.floor(
                                              Date.now() / 1000 - ((Date.now() / 1000) % 300)
                                            )
                                            : 0,
                                      });
                                    }}
                                  >
                                    <div
                                      className={
                                        classNames('bg-white md:w-6 md:h-6 h-5 w-5 rounded-full shadow-md transform', { 'transform translate-x-6': formNft.availabilityTo !== 0 })
                                      }
                                    />
                                  </div>


                                  <DatePicker
                                    className={classNames('my-2', { 'cursor-pointer': formNft.availabilityTo !== 0 })}
                                    selected={formNft.availabilityTo !== 0 ? new Date(formNft.availabilityTo * 1000) : undefined}
                                    placeholderText='ANY'
                                    onChange={(date) =>
                                      setFormNft({
                                        ...formNft,
                                        availabilityTo: date
                                          ? Math.floor(date.getTime() / 1000)
                                          : 0,
                                      })
                                    }
                                    disabled={formNft.availabilityTo === 0}
                                  />

                                </div>

                                <div>
                                  <Label className="block text-sm font-medium text-gray-700">
                                    Royalties (%)
                                  </Label>
                                  <Input
                                    type="number"
                                    name="royalty"
                                    id="royalty"
                                    placeholder="Your share of secondary sales (%)"
                                    value={formNft.royalty}
                                    onChange={(e) =>
                                      setFormNft({ ...formNft, royalty: Number(e.target.value) })
                                    }
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-red-500 text-center">{formError}</div>
                        <div className="bg-white sm:flex sm:flex-row-reverse pt-5">
                          {!mintTxStatus.submitted && !mintTxStatus.confirmed && (
                            <button
                              type="button"
                              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm"
                              onClick={() => mintNft()}
                            >
                              Mint
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog>

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
                                    placeholder={baseUrl + location.pathname}
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
                            navigator.clipboard.writeText(baseUrl + location.pathname);
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
          {userLoading ? <FaSpinner className="text-indigo-600 text-xl animate-spin inline-block" /> : renderNFTs()}
        </div>
      </div >
    </div >
  );
}
