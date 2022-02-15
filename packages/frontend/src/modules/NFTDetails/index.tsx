import { useSubscription } from '@apollo/client';
import { Dialog } from '@headlessui/react';
import { formatUnits } from 'ethers/lib/utils';
import React, { useEffect, useState } from 'react';
import { FaExternalLinkAlt, FaRegWindowClose, FaShareAlt } from 'react-icons/fa';
import ClockSpinner from '../../images/clock-loader.webp';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, ButtonVariant } from '../../components/Button';
import { CategoryDisplay } from '../../components/Category';
import { FieldLabel } from '../../components/FieldLabel';
import { UserDetail } from '../../components/UserDetail';
import { NftDocument } from '../../lib/graphql';
import { useAppDataProvider } from '../../lib/providers/app-data-provider';
import { NFT } from '../../types';
import { BuyPanel } from '../../components/BuyPanel';
import { RedeemPanel } from '../../components/RedeemPanel';
import { BuyingConditionChangePanel } from '../../components/BuyingConditionChangePanel';
import { MaxUint256, ZERO_ADDRESS } from '../../lib/helpers/constants';
import Tooltip from '../../components/Tooltip';
import { TokenIcon } from '@aave/aave-ui-kit';

interface NftState {
  nft?: NFT;
}

export interface TxStatus {
  submitted: boolean;
  confirmed: boolean;
  txHash?: string;
  action: string;
}

function HeadingSeparator({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb-5 border-b border-b-gray-200 mb-5">
      <h3 className="text-lg leading-7 font-semibold ">{children}</h3>
    </div>
  );
}

export default function NFTDetails() {
  const { currentAccount, networkConfig } = useAppDataProvider();
  const [owner, setOwner] = useState<Boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as NftState;
  const [uri, setURI] = useState<string>('');
  const [ownerSelectedMode, setOwnerSelectedMode] = useState<string>('update');
  const [shareProfileModalOpen, setShareProfileModalOpen] = useState<boolean>(false);
  const [txStatus, setTxStatus] = useState<TxStatus>({
    submitted: false,
    confirmed: false,
    txHash: undefined,
    action: '',
  });
  const [txStatusModalOpen, setTxStatusModalOpen] = useState<boolean>(false);
  const path = location.pathname.split('/');
  const tokenId: string | undefined = path[2];
  let tokenIdSanitized = '';
  // Ensure we are querying for an nft that could actually exist
  if (tokenId && Number(tokenId) >= 0 && Number(tokenId) < MaxUint256) {
    tokenIdSanitized = Number(tokenId).toString();
  }
  const { data, loading, error } = useSubscription(NftDocument, {
    variables: {
      nft: tokenIdSanitized
    },
  });

  // Use subscription data, or fallback to nft passed through useLocation state, or undefined
  const nft: NFT | undefined = data && data.nft ? data.nft : (state && state.nft ? state.nft : undefined);

  const fetchURI = async (nft: NFT) => {
    const response = await fetch(nft.tokenURI);
    const data = await response.json();
    setURI(data.image);
  };

  const onClose = () => {
    setTxStatus({
      submitted: false,
      confirmed: false,
      txHash: undefined,
      action: '',
    });
    setTxStatusModalOpen(false);
  }

  // Update nft ownership, svg, and buying conditions 
  useEffect(() => {
    if (nft) {
      nft.owner.id.toLowerCase() === currentAccount?.toLowerCase()
        ? setOwner(true)
        : setOwner(false);
      fetchURI(nft);
    }
  }, [nft, currentAccount]);

  useEffect(() => {
    if (txStatus.submitted) {
      setTxStatusModalOpen(true);
    }
  }, [txStatus])

  // Styling for owner buttons
  const selected =
    'font-semibold rounded-md text-white bg-indigo-600 hover:bg-gray-500 md:py-2 md:text-md md:px-8 cursor-pointer';
  const unselected =
    'font-semibold rounded-md text-black bg-white hover:bg-gray-500 md:py-2 md:text-md md:px-8 cursor-pointer';

  if (!nft) {
    if (error) {
      return <div className="h-screen">
        <div className="w-1/3 text-center mx-auto align-middle">
          <div className="text-red font-bold text-xl p-20">
            An Error occured: {error}
          </div>
        </div>
      </div>
    } else if (loading) {
      return <div className="w-1/5 mx-auto p-4 pb-0">
        <img alt="clock spinner" src={ClockSpinner} width={50} height={50} />
      </div>;
    } else {
      return <div className="h-screen">
        <div className="w-1/3 text-center mx-auto align-middle">
          <div className="text-black dark:text-white font-bold text-xl p-20">
            No NFT found with TokenId {tokenIdSanitized}
          </div>
        </div>
      </div>
    }
  } else {
    const mintDatetime = new Date(nft.mintTimestamp * 1000);
    const mintDateString = mintDatetime.toLocaleString('en-us', { dateStyle: 'medium' });
    let lastPurchaseDateString = mintDateString;
    if (nft.lastPurchaseTimestamp !== 0) {
      const lastPurchaseDatetime = new Date(nft.lastPurchaseTimestamp * 1000);
      lastPurchaseDateString = lastPurchaseDatetime.toLocaleString('en-us', {
        dateStyle: 'medium',
      });
    }
    return (
      <div className=" text-black dark:text-white p-10 bg-slate-100 dark:bg-black">
        {/* <FaChevronCircleLeft onClick={() => navigate(-1)} className=" cursor-pointer" /> */}

        <Dialog
          open={txStatusModalOpen}
          onClose={onClose}
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

            <div className="inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white p-10">
                <div className="flex">
                  <div className="w-full space-y-5">
                    <div className="flex flex-row justify-between">
                      <h3
                        className="text-lg leading-6 font-semibold text-gray-900"
                        id="modal-title"
                      >
                        {txStatus.action}
                      </h3>
                      <div className="cursor-pointer text-xl" onClick={onClose}>
                        <FaRegWindowClose className="hover:text-red-500" />
                      </div>
                    </div>

                    {txStatus.submitted ? (
                      <div className="text-center flex-col p-4">
                        <div className="font-semibold">Transaction Submitted 👀</div>
                        <div className="w-1/5 mx-auto p-4 pb-0">
                          <img alt="clock spinner" src={ClockSpinner} width={50} height={50} />
                        </div>
                      </div>
                    ) : txStatus.confirmed && (
                      <div className="text-center flex-col">
                        <div className="font-semibold">Transaction Confirmed 🥳🎉</div>
                        <div className="pt-4">
                          <a target="_blank" rel="noopener noreferrer" className="cursor-pointer p-5" href={networkConfig.blockExplorer + '/tx/' + txStatus.txHash}>
                            View Transaction <FaExternalLinkAlt className="inline-block" />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Dialog>
        <div className="flex flex-col sm:flex-row  gap-10 ">
          {/** Column 1: NFT Image + buy/sell/redeem options */}
          <div className="flex w-full sm:w-1/3 md:w-1/4 flex-col gap-5 ">
            <div className="w-full bg-white rounded-md border border-gray-300">
              <img alt="token uri" src={uri} />
            </div>
            {/** If redeemed -> show redeemed message
             *   if not redeemed -> display panel based on nft ownership
             *      if not owner -> display purchase panel or not for sale
             *      if owner -> display panel to toggle between redeem or change selling options
             * */}
            {!owner ? (
              nft.forSale ? (
                <div className="pt-4">
                  <BuyPanel nft={nft} setTxStatus={setTxStatus} />
                </div>
              ) : (
                <div className="text-center p-4 font-semibold">This NFT is not for sale</div>
              )
            ) : (
              <div className="flex flex-col p-5">
                <div className="flex flex-row justify-evenly space-x-2 pb-5">
                  <div
                    className={ownerSelectedMode === 'update' ? selected : unselected}
                    onClick={() => setOwnerSelectedMode('update')}
                  >
                    Update Selling Options
                  </div>
                  <div
                    className={ownerSelectedMode === 'redeem' ? selected : unselected}
                    onClick={() => setOwnerSelectedMode('redeem')}
                  >
                    Redeem
                  </div>
                </div>
                {ownerSelectedMode === 'redeem' ? (
                  (nft.redeemed ? <div className="text-center p-4 font-semibold">This NFT has been redeemed</div> : <RedeemPanel nft={nft} setTxStatus={setTxStatus} />)
                ) : (
                  <BuyingConditionChangePanel nft={nft} setTxStatus={setTxStatus} />
                )}
              </div>
            )}
          </div>

          {/* * Column 2: NFT Details */}
          <div className="space-y-5 w-full md:w-1/2 flex-1">
            {/** Title and Category */}
            <div className="flex flex-row justify-between">
              <div className="flex-start">
                <div className="flex flex-col">
                  <div className="text-4xl leading-10 font-extrabold mb-2">{nft.name}</div>
                  <CategoryDisplay className="self-start">
                    {nft.category ? nft.category : 'Other'}
                  </CategoryDisplay>
                </div>
              </div>
              {/** Share Profile */}
              <div className="flex-end">
                <div className="flex flex-row justify-evenly">
                  <Button
                    variant={ButtonVariant.SECONDARY}
                    onClick={() => setShareProfileModalOpen(true)}
                  >
                    <FaShareAlt /> Share
                  </Button>
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
                                Share
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
                                      value={window.location.href}
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
            {/** Creator / Owner */}
            <div className="flex max-w-xl">
              <div className="w-1/2">
                <FieldLabel className="mb-2">Created By</FieldLabel>
                <div
                  className="flex cursor-pointer"
                  onClick={() => navigate('/profile/' + nft.creator.id)}
                >
                  <UserDetail address={nft.creator.id} caption={mintDateString} />
                </div>
              </div>
              <div className="w-1/2">
                <FieldLabel className="mb-2">Owned By</FieldLabel>
                <div
                  className="flex cursor-pointer"
                  onClick={() => navigate('/profile/' + nft.owner.id)}
                >
                  <UserDetail address={nft.owner.id} caption={lastPurchaseDateString} />
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <HeadingSeparator>Description</HeadingSeparator>
              <div className="text-sm leading-5 text-gray-900 dark:text-gray-500 pb-5">
                {nft.description}
              </div>
            </div>

            <div className="flex flex-col">
              <HeadingSeparator>Details</HeadingSeparator>
              <div className="space-y-5">
                <div>
                  <FieldLabel className="mb-2 font-semibold">Duration</FieldLabel>
                  <div className="font-semibold">{nft.duration / 3600} hours</div>
                </div>
                <div className="flex gap-5">
                  <div>
                    <FieldLabel className="mb-2 font-semibold">Availability From</FieldLabel>
                    <div className="font-semibold">
                      {nft.availabilityFrom > Date.now() / 1000
                        ? new Date(nft.availabilityFrom * 1000).toLocaleString('en-us', {
                          dateStyle: 'long',
                        })
                        : 'Any'}
                    </div>
                  </div>
                  <div>
                    <FieldLabel className="mb-2 font-semibold">Availability To</FieldLabel>
                    <div className="font-semibold">
                      {nft.availabilityTo > 0
                        ? new Date(nft.availabilityTo * 1000).toLocaleString('en-us', {
                          dateStyle: 'long',
                        }) : 'Any'}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex gap-3 mb-2 align-center">
                    <FieldLabel className="font-semibold">Royalities</FieldLabel>
                    <Tooltip content="Your share of secondary sales: every time your time is resold, you receive royalties on the sale. This only applies to sales on our marketplace and any other EIP-2981 compliant marketplace" />
                  </div>
                  <div className="font-semibold">{(nft.royaltyBasisPoints / 100).toString()} %</div>
                </div>
              </div>
            </div>
            <div>
              <FieldLabel className="mb-2 font-semibold">Redeemed</FieldLabel>
              <div className="font-semibold">{nft.redeemed ? 'Yes' : 'No'}</div>
            </div>
            <div>
              <FieldLabel className="mb-2 font-semibold">Current Listing</FieldLabel>
              {nft.forSale ? <div>
                <div className="font-semibold">For Sale</div>
                <div className="font-semibold">
                  <div className="inline-block"> {formatUnits(nft.price.toString(), nft.currency.decimals)} {nft.currency.symbol}</div>
                  <TokenIcon className="inline-block align-middle pl-2 pb-1" tokenSymbol={nft.currency.symbol} width={20} height={20} />
                </div>
                <div className="font-semibold">{nft.allowedBuyer === ZERO_ADDRESS ? 'No Reserved Buyer' : 'Reserved For ' + nft.allowedBuyer}</div>
              </div> : <div className="font-semibold">Not For Sale</div>}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
