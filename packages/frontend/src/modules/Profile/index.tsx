import React, { useEffect, useState } from 'react';
import { FaShareAlt, FaSpinner } from 'react-icons/fa';
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
import { useQuery } from '@apollo/client';
import makeBlockie from 'ethereum-blockies-base64';
import DatePicker from 'react-datepicker';
import classnames from 'classnames';
import ConnectButton from '../../components/ConnectButton';
import 'react-datepicker/dist/react-datepicker.css';
import { Input, Label, Select } from '../../components/Forms';

interface MintNftParams {
  name: string;
  description: string;
  category: string;
  duration: number;
  availabilityTo: number;
  availabilityFrom: number;
  royalty: number;
}

type ButtonProps = Pick<
  React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
  'onClick'
>;

const ShareProfileButton = (props: ButtonProps) => {
  return (
    <button
      className="bg-white hover:bg-gray-100 text-gray-700 font-medium py-2 px-4 border border-gray-300 rounded flex items-center gap-2 cursor-pointer w-full min-w-fit"
      {...props}
    >
      <FaShareAlt /> Share Profile
    </button>
  );
};

const MintNewButtton = (props: ButtonProps) => {
  return (
    <button
      className="py-2 px-4 border border-transparent font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer w-full min-w-fit"
      {...props}
    >
      Mint new
    </button>
  );
};

export default function Profile() {
 
  const { currentAccount, nftCollectionService, userData, loadingUserData } = useAppDataProvider();
  const { library: provider, account } = useWeb3React();

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
      user: owner ? '' : path[2].toLowerCase(),
    },
  });
  const categories = ["Minted", "Owned"]
  const user: User | undefined = owner ? userData : (data && data.user) ? data.user : undefined
  const userLoading: boolean = owner ? loadingUserData : loading;
  const [nftsShown, setNftsShown] = useState<NFT[]>(user?.createdNfts ? user?.createdNfts : [])
  const toggleClass = ' transform translate-x-5';
  useEffect(() => {
    if (user?.createdNfts && toggleIndex === 0) {
      setNftsShown(user.createdNfts);
    }
    if (user?.ownedNfts && toggleIndex === 1) {
      setNftsShown(user.ownedNfts)
    }
  }, [user, toggleIndex]);

  const onChangeTab = (index: number) => {
    if (index === 0) {
      setToggleIndex(0)
      setNftsShown(user?.createdNfts ? user?.createdNfts : [] as NFT[])
    }
    else {
      setToggleIndex(1)
      setNftsShown(user?.ownedNfts? user?.ownedNfts : [] as NFT[])
    }
  }
  const renderNFTs = () => {
    const copy = `No ${categories[toggleIndex].toLowerCase()} NFTs for this address.`
    return (
    //if no wallet
    !account ? <ConnectButton/> : 
    //if no nfts 
    !nftsShown.length ? <div
    className='text-xl text-center font-medium text-blue-700 '
  >
    {copy}
  </div> :
     <NFTGrid>
            {nftsShown.map((nft, index) => {
              return <NFTCard key={index} nft={nft} />;
            })}
          </NFTGrid>
    )
  }
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
          setFormError('availabilityTo must be greater than availablilityFrom + duration');
        }
      } else {
        setFormError('Name, Description, Category, and Duration are required fields');
      }
    } else {
      setFormError('No account connected');
    }
  };
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
                <ShareProfileButton onClick={() => setShareProfileModalOpen(true)} />
                {/** Mint */}
                {owner && <MintNewButtton onClick={() => setMintModalOpen(true)} />}
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

                    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ">
                      <div className="bg-white px-10 pt-10 pb-4">
                        <div className="flex">
                          <div className="mt-3 text-center sm:mt-0  sm:text-left w-full  space-y-5">
                            <h3
                              className="text-lg leading-6 font-medium text-gray-900"
                              id="modal-title"
                            >
                              Mint Time NFT
                            </h3>
                            <div className="">
                              <div>
                                <Label htmlFor="name">Name</Label>
                                <Input
                                  name="name"
                                  id="name"
                                  placeholder="Name for your service..."
                                  value={formNft.name}
                                  onChange={(e) => setFormNft({ ...formNft, name: e.target.value })}
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
                                  {Object.values(Category).map((category, index) => (
                                    <option key={index}>{category}</option>
                                  ))}
                                </Select>
                              </div>
                              <div className="w-1/2">
                                <label className="block text-sm font-medium text-gray-700">
                                  Number Of Hours
                                </label>
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
                                className="md:w-14 md:h-7 w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer"
                                onClick={() => {
                                  setFormNft({
                                    ...formNft,
                                    availabilityFrom:
                                      formNft.availabilityFrom === 0
                                        ? Math.floor(
                                            Date.now() / 1000 - ((Date.now() / 1000) % 3600)
                                          )
                                        : 0,
                                  });
                                }}
                              >
                                <div
                                  className={
                                    'bg-white md:w-6 md:h-6 h-5 w-5 rounded-full shadow-md transform' +
                                    (formNft.availabilityFrom === 0 ? null : toggleClass)
                                  }
                                />
                              </div>
                              {formNft.availabilityFrom !== 0 ? (
                                <DatePicker
                                  selected={new Date(formNft.availabilityFrom * 1000)}
                                  onChange={(date) =>
                                    setFormNft({
                                      ...formNft,
                                      availabilityFrom: date
                                        ? Math.floor(date.getTime() / 1000)
                                        : 0,
                                    })
                                  }
                                />
                              ) : (
                                <></>
                              )}
                            </div>
                            <div>
                              <Label>End Of Availablility (optional)</Label>
                              <div
                                className="md:w-14 md:h-7 w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer"
                                onClick={() => {
                                  setFormNft({
                                    ...formNft,
                                    availabilityTo:
                                      formNft.availabilityTo === 0
                                        ? Math.floor(
                                            Date.now() / 1000 - ((Date.now() / 1000) % 3600)
                                          )
                                        : 0,
                                  });
                                }}
                              >
                                <div
                                  className={
                                    'bg-white md:w-6 md:h-6 h-5 w-5 rounded-full shadow-md transform' +
                                    (formNft.availabilityTo === 0 ? null : toggleClass)
                                  }
                                />
                              </div>

                              {formNft.availabilityTo !== 0 ? (
                                <DatePicker
                                  selected={new Date(formNft.availabilityTo * 1000)}
                                  onChange={(date) =>
                                    setFormNft({
                                      ...formNft,
                                      availabilityTo: date ? Math.floor(date.getTime() / 1000) : 0,
                                    })
                                  }
                                />
                              ) : (
                                <></>
                              )}
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
                          ? 'dark:text-white border-b-2 border-indigo-600 dark:text-white'
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
          {userLoading ? <FaSpinner /> : renderNFTs()}
        </div>
      </div>
    </div>
  );
}
