import React, { useEffect, useState } from 'react';
import { FaShareAlt, FaSpinner } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import NFTCard from '../../components/NFTCard';
import { useAppDataProvider } from '../../lib/providers/app-data-provider';
import { Category, User } from '../../types';
import { Dialog } from '@headlessui/react';
import { BigNumber } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { MintParamsType } from '../../lib/helpers/NftCollection';
import { NFTGrid } from '../../components/NFTGrid';
import { ProfileNftsDocument } from '../../lib/graphql';
import { useQuery } from '@apollo/client';
import makeBlockie from 'ethereum-blockies-base64';


interface MintNftParams {
  name: string;
  description: string;
  category: string;
  duration: number;
  availabilityTo: number;
  availabilityFrom: number;
  royalty: number;
}

export default function Profile() {
  const { currentAccount, nftCollectionService, userData, loadingUserData } = useAppDataProvider();
  const { library: provider } = useWeb3React();
  const [owner, setOwner] = useState<Boolean>(true);
  const [formError, setFormError] = useState<string | undefined>(undefined);
  const [formNft, setFormNft] = useState<MintNftParams>({
    name: '',
    description: '',
    category: '',
    duration: 0,
    availabilityTo: 0,
    availabilityFrom: 0,
    royalty: 0,
  });
  const [mintModalOpen, setMintModalOpen] = useState<boolean>(false);
  const [shareProfileModalOpen, setShareProfileModalOpen] = useState<boolean>(false);
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
  const { data, loading } = useQuery(ProfileNftsDocument, {
    variables: {
      user: owner ? '' : path[2].toLowerCase()
    },
  });
  const user: User | undefined = owner ? userData : (data && data.user) ? data.user : undefined
  const userLoading: boolean = owner ? loadingUserData : loading;

  const mintNft = async () => {
    if (currentAccount) {
      if (formNft.availabilityFrom < formNft.availabilityTo) {
        if (
          formNft.duration > 0 &&
          formNft.availabilityTo > 0 &&
          formNft.availabilityFrom > 0 &&
          formNft.royalty > 0
        ) {
          if (formNft.royalty <= 100) {
            const input: MintParamsType = {
              userAddress: currentAccount,
              name: formNft.name,
              description: formNft.description,
              category: formNft.category,
              availabilityFrom: formNft.availabilityFrom,
              availabilityTo: formNft.availabilityTo,
              duration: formNft.duration,
              royaltyBasisPoints: formNft.royalty * 100,
            };
            setFormError(undefined);
            const txs = await nftCollectionService.mint(input);
            const tx = txs[0];
            const extendedTxData = await tx.tx();
            const { from, ...txData } = extendedTxData;
            const signer = provider.getSigner(from);
            const txResponse = await signer.sendTransaction({
              ...txData,
              value: txData.value ? BigNumber.from(txData.value) : undefined,
            });
            console.log(txResponse);
            // TO-DO: Handle Submitted and Executed response
          } else {
            setFormError('Royalty must be between 1 and 100');
          }
        } else {
          setFormError('All numeric fields must be positive');
        }
      } else {
        setFormError('End timestamp must be greater than beginning timestamp');
      }
    } else {
      setFormError('No account connected');
    }
  };

  return (
    <div className="flex flex-col max-w-7xl m-auto">
      <div className="p-10">
        <div className="flex flex-row justify-between">
          {/** Profile Header */}
          <div className="w-1/4 justify-items-start mb-5">
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
          <div className="w-1/4 p-5 justify-items-end">
            <div className="flex flex-row justify-evenly">
              <div
                className="items-center justify-center px-6 py-1 border border-gray text-base font-semibold rounded-md text-black bg-white hover:bg-gray-400 md:py-2 md:text-lg md:px-8 cursor-pointer"
                onClick={() => setShareProfileModalOpen(true)}
              >
                <FaShareAlt /> Share Profile
              </div>
              {/** Mint */}
              {owner ? (
                <div
                  className="items-center justify-center px-6 py-1 border border-transparent text-base font-semibold rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-2 md:text-lg md:px-8 cursor-pointer"
                  onClick={() => setMintModalOpen(true)}
                >
                  Mint New
                </div>
              ) : (
                <></>
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
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:items-start">
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                          <h3
                            className="text-lg leading-6 font-medium text-gray-900"
                            id="modal-title"
                          >
                            Mint Time NFT
                          </h3>
                          <div className="mt-2">
                            <div>
                              <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Name
                              </label>
                              <div className="mt-1 relative rounded-md shadow-sm">
                                <input
                                  type="text"
                                  name="name"
                                  id="name"
                                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                                  placeholder="Name for your service..."
                                  value={formNft.name}
                                  onChange={(e) => setFormNft({ ...formNft, name: e.target.value })}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="mt-2">
                            <div>
                              <label
                                htmlFor="description"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Description
                              </label>
                              <div className="mt-1 relative rounded-md shadow-sm">
                                <input
                                  type="text"
                                  name="description"
                                  id="description"
                                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 h-5 sm:text-sm border-gray-300 rounded-md"
                                  placeholder="Describe your service..."
                                  value={formNft.description}
                                  onChange={(e) =>
                                    setFormNft({ ...formNft, description: e.target.value })
                                  }
                                />
                              </div>
                            </div>
                          </div>
                          <div className="mt-2">
                            <div className="flex">
                              <div>
                                <label
                                  htmlFor="category"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Category
                                </label>
                                <select
                                  id="category"
                                  name="category"
                                  className="focus:ring-indigo-500 focus:border-indigo-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md"
                                  value={formNft.category}
                                  onChange={(e) =>
                                    setFormNft({ ...formNft, category: e.target.value })
                                  }
                                >
                                  {Object.keys(Category).map(category => <option>{category}</option>)}
                                </select>
                              </div>
                              <div>
                                <label
                                  htmlFor="numhours"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Number Of Hours
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                  <input
                                    type="number"
                                    name="numhours"
                                    id="numhours"
                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 h-5 sm:text-sm border-gray-300 rounded-md"
                                    placeholder="Add time..."
                                    value={formNft.duration}
                                    onChange={(e) =>
                                      setFormNft({ ...formNft, duration: Number(e.target.value) })
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-2">
                            <div>
                              <label
                                htmlFor="availabilityFrom"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Beginning Of Availability
                              </label>
                              <div className="mt-1 relative rounded-md shadow-sm">
                                <input
                                  type="number"
                                  name="availabilityFrom"
                                  id="availablilityFrom"
                                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 h-5 sm:text-sm border-gray-300 rounded-md"
                                  placeholder="UNIX Timestamp (temporary)"
                                  value={formNft.availabilityFrom}
                                  onChange={(e) =>
                                    setFormNft({
                                      ...formNft,
                                      availabilityFrom: Number(e.target.value),
                                    })
                                  }
                                />
                              </div>
                            </div>
                          </div>
                          <div className="mt-2">
                            <div>
                              <label
                                htmlFor="availabilityTo"
                                className="block text-sm font-medium text-gray-700"
                              >
                                End Of Availablility
                              </label>
                              <div className="mt-1 relative rounded-md shadow-sm">
                                <input
                                  type="number"
                                  name="availabilityTo"
                                  id="availablilityTo"
                                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 h-5 sm:text-sm border-gray-300 rounded-md"
                                  placeholder="UNIX Timestamp (temporary)"
                                  value={formNft.availabilityTo}
                                  onChange={(e) =>
                                    setFormNft({
                                      ...formNft,
                                      availabilityTo: Number(e.target.value),
                                    })
                                  }
                                />
                              </div>
                            </div>
                          </div>
                          <div className="mt-2">
                            <div>
                              <label
                                htmlFor="royalty"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Royalties
                              </label>
                              <div className="mt-1 relative rounded-md shadow-sm">
                                <input
                                  type="number"
                                  name="royalty"
                                  id="royalty"
                                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 h-5 sm:text-sm border-gray-300 rounded-md"
                                  placeholder="Your share of secondary sales (%)"
                                  value={formNft.royalty}
                                  onChange={(e) =>
                                    setFormNft({ ...formNft, royalty: Number(e.target.value) })
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-red-500 text-center">{formError}</div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                      <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={() => mintNft()}
                      >
                        Mint
                      </button>
                      <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={() => setMintModalOpen(false)}
                      >
                        Cancel
                      </button>
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
        {userLoading || !user ? <FaSpinner /> : <NFTGrid>
          {user.ownedNfts.map((nft, index) => {
            return <NFTCard key={index} nft={nft} />;
          })}
        </NFTGrid>}
      </div>
    </div>
  );
}
