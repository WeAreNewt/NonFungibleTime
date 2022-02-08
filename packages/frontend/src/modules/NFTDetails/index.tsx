import { Dialog } from '@headlessui/react';
import { useWeb3React } from '@web3-react/core';
import { BigNumber } from 'ethers';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import React, { useEffect, useState } from 'react';
import { FaShareAlt, FaSpinner } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, ButtonVariant } from '../../components/Button';
import { CategoryDisplay } from '../../components/Category';
import { FieldLabel } from '../../components/FieldLabel';
import { PriceDisplay } from '../../components/PriceDisplay';
import { UserDetail } from '../../components/UserDetail';
import { PaymentToken } from '../../lib/graphql';
import { isEthAddress, ZERO_ADDRESS } from '../../lib/helpers/base-service';
import {
  BuyTokenParamsType,
  ChangeBuyingConditionsParamsType,
  RedeemParamsType,
} from '../../lib/helpers/NftCollection';
import { useAppDataProvider } from '../../lib/providers/app-data-provider';
import { NFT } from '../../types';

interface NftState {
  nft?: NFT;
}

interface BuyingConditions {
  forSale: boolean;
  price: number;
  currency: PaymentToken;
  whitelistedBuyer: string;
}

function HeadingSeparator({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb-5 border-b border-b-gray-200 mb-5">
      <h3 className="text-lg leading-7 font-semibold ">{children}</h3>
    </div>
  );
}

export default function NFTDetails() {
  const { currentAccount, nftCollectionService } = useAppDataProvider();
  const [owner, setOwner] = useState<Boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { library: provider } = useWeb3React();
  const state = location.state as NftState;
  const [nft, setNft] = useState<NFT>();
  const [uri, setURI] = useState<string>();
  const [formError, setFormError] = useState<string | undefined>(undefined);
  const [buyingConditions, setBuyingConditions] = useState<BuyingConditions>({
    forSale: true,
    price: 0,
    currency: {
      acceptable: true,
      decimals: 18,
      id: '0x0',
      symbol: '',
    },
    whitelistedBuyer: '0x0',
  });
  const [ownerSelectedMode, setOwnerSelectedMode] = useState<string>('update');
  const [shareProfileModalOpen, setShareProfileModalOpen] = useState<boolean>(false);
  const path = location.pathname.split('/');

  const fetchURI = async (nft: NFT) => {
    const response = await fetch(nft.tokenURI);
    const data = await response.json();
    setURI(data.image);
  };

  // Trigger buy transaction (+ approval if required)
  const buy = async () => {
    if (nft && currentAccount) {
      const input: BuyTokenParamsType = {
        userAddress: currentAccount,
        tokenId: nft.tokenId,
        currency: nft.currency.id,
        price: BigNumber.from(nft.price),
      };
      setFormError(undefined);
      const txs = await nftCollectionService.buyToken(input);
      const tx = txs[0];
      const extendedTxData = await tx.tx();
      const { from, ...txData } = extendedTxData;
      const signer = provider.getSigner(from);
      const txResponse = await signer.sendTransaction({
        ...txData,
        value: txData.value ? BigNumber.from(txData.value) : undefined,
      });
      console.log(txResponse);
    } else {
      setFormError('No wallet connected');
    }
  };

  // Trigger redeem transaction
  const redeem = async () => {
    if (nft && currentAccount) {
      const input: RedeemParamsType = { userAddress: currentAccount, tokenId: nft.tokenId };
      setFormError(undefined);
      const txs = await nftCollectionService.redeem(input);
      const tx = txs[0];
      const extendedTxData = await tx.tx();
      const { from, ...txData } = extendedTxData;
      const signer = provider.getSigner(from);
      const txResponse = await signer.sendTransaction({
        ...txData,
        value: txData.value ? BigNumber.from(txData.value) : undefined,
      });
      console.log(txResponse);
    } else {
      setFormError('No wallet connected');
    }
  };

  // Trigger changeBuyingConditions transaction
  const changeBuyingConditions = async () => {
    if (nft && currentAccount && buyingConditions) {
      if (isEthAddress(buyingConditions.whitelistedBuyer)) {
        const formattedPrice = parseUnits(
          buyingConditions.price.toString(),
          buyingConditions.currency.decimals
        );
        const input: ChangeBuyingConditionsParamsType = {
          userAddress: currentAccount,
          tokenId: nft.tokenId,
          currency: buyingConditions.currency.id,
          price: formattedPrice,
          allowedBuyer: buyingConditions.whitelistedBuyer,
          forSale: buyingConditions.forSale,
        };
        console.log(input);
        setFormError(undefined);
        const txs = await nftCollectionService.changeBuyingConditions(input);
        const tx = txs[0];
        const extendedTxData = await tx.tx();
        const { from, ...txData } = extendedTxData;
        const signer = provider.getSigner(from);
        const txResponse = await signer.sendTransaction({
          ...txData,
          value: txData.value ? BigNumber.from(txData.value) : undefined,
        });
        console.log(txResponse);
      } else {
        setFormError('Whitelisted buyer is not a valid ethereum address');
      }
    } else {
      setFormError('No wallet connected');
    }
  };

  // Get NFT data from state parameters or subgraph query
  useEffect(() => {
    if (state && state.nft) {
      setNft(state.nft);
      state.nft.owner.id.toLowerCase() === currentAccount?.toLowerCase()
        ? setOwner(true)
        : setOwner(false);
    } else {
      // If no NFT is passed (not accessing from profile or marketplace link), fetch from GQl
      console.log('NO NFT PASSSED');
    }
  }, [path, currentAccount, state]);

  // Render token svg
  useEffect(() => {
    if (nft) {
      fetchURI(nft);
      // All of these fields will come from nft once fetching from subgraph
      setBuyingConditions({
        forSale: nft.forSale,
        price: Number(formatUnits(nft.price.toString(), nft.currency.decimals)),
        currency: {
          acceptable: true,
          decimals: 18,
          id: ZERO_ADDRESS,
          symbol: nft.currency.symbol,
        },
        whitelistedBuyer: '0x0000000000000000000000000000000000000000',
      });
    }
  }, [nft]);

  // Hard-coded for now, will come from app-data-provider
  const availableCurrencies: Record<string, PaymentToken> = {
    MATIC: {
      acceptable: true,
      id: ZERO_ADDRESS,
      symbol: 'MATIC',
      decimals: 18,
    },
  };

  // Styling for owner buttons
  const selected =
    'items-center justify-center px-6 py-1 border border-transparent text-base font-semibold rounded-md text-white bg-indigo-600 hover:bg-gray-500 md:py-2 md:text-lg md:px-8 cursor-pointer';
  const unselected =
    'items-center justify-center px-6 py-1 border border-transparent text-base font-semibold rounded-md text-black bg-white hover:bg-gray-500 md:py-2 md:text-lg md:px-8 cursor-pointer';

  if (!nft) {
    return <FaSpinner />;
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
            {nft.redeemed ? (
              <div>This NFT has been redeemed</div>
            ) : !owner ? (
              nft.forSale ? (
                <div>
                  <FieldLabel>Price</FieldLabel>
                  <PriceDisplay amount={nft.price} currency={nft.currency} />
                  <div
                    className="items-center justify-center px-6 py-1 border border-transparent text-base font-semibold rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-2 md:text-lg md:px-8 cursor-pointer"
                    onClick={buy}
                  >
                    Buy Now
                  </div>
                  <div className="text-red-500 text-center">{formError}</div>
                </div>
              ) : (
                <div>This NFT is not for sale</div>
              )
            ) : (
              <div className="flex flex-col p-5">
                <div className="flex flex-row">
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
                  <div className="flex flex-col">
                    <div>
                      This NFT has not yet been redeemed. Note: This is a one time action and cannot
                      be reversed
                    </div>
                    <div
                      className="items-center justify-center px-6 py-1 border border-transparent text-base font-semibold rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-2 md:text-lg md:px-8 cursor-pointer"
                      onClick={() => redeem()}
                    >
                      Redeem
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {/** For sale toggle */}
                    <label className="relative flex justify-between items-center p-2 text-xl">
                      For Sale
                      <input
                        type="checkbox"
                        className="absolute left-1/2 -translate-x-1/2 w-full h-full peer appearance-none rounded-md cursor-pointer"
                        checked={buyingConditions.forSale}
                        onChange={() => {
                          setBuyingConditions({
                            ...buyingConditions,
                            forSale: !buyingConditions.forSale,
                          });
                        }}
                      />
                      <span className="w-16 h-10 flex items-center flex-shrink-0 ml-4 p-1 bg-gray-300 rounded-full duration-300 ease-in-out peer-checked:bg-indigo-600 after:w-8 after:h-8 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-6 cursor-pointer"></span>
                    </label>
                    {/** Price and currency */}
                    <div className="flex flex-row">
                      <label className="relative flex justify-between items-center p-2 text-xl">
                        Price
                        <input
                          className="text-black"
                          type="number"
                          value={buyingConditions.price}
                          onChange={(e) => {
                            setBuyingConditions({
                              ...buyingConditions,
                              price: Number(e.target.value),
                            });
                          }}
                        />
                      </label>
                      <label className="relative flex justify-between items-center p-2 text-xl">
                        Currency
                        <select
                          className="text-black"
                          onChange={(e) => {
                            setBuyingConditions({
                              ...buyingConditions,
                              currency: availableCurrencies[e.target.value],
                            });
                          }}
                        >
                          {Object.entries(availableCurrencies).map((currency) => (
                            <option key={currency[0]}>{currency[0]}</option>
                          ))}
                        </select>
                      </label>
                    </div>
                    {/** Whitelist buyer */}
                    <label className="relative flex justify-between items-center p-2 text-xl">
                      Whitelist Buyer Address (optional)
                      <input
                        className="text-black"
                        type="text"
                        value={buyingConditions.whitelistedBuyer}
                        onChange={(e) => {
                          setBuyingConditions({
                            ...buyingConditions,
                            whitelistedBuyer: e.target.value,
                          });
                        }}
                        placeholder="Reserve NFT for a single buyer"
                      />
                    </label>
                    <div
                      className="items-center justify-center px-6 py-1 border border-transparent text-base font-semibold rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-2 md:text-lg md:px-8 cursor-pointer"
                      onClick={() => changeBuyingConditions()}
                    >
                      Update
                    </div>
                  </div>
                )}
                <div className="text-red-500 text-center">{formError}</div>
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
                  <CategoryDisplay>{nft.category ? nft.category : 'Other'}</CategoryDisplay>
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

              <div className="text-sm leading-5 text-gray-900 dark:text-gray-500">
                {nft.description}
              </div>
            </div>

            <div className="flex flex-col">
              <HeadingSeparator>Details</HeadingSeparator>
              <div className="space-y-5">
                <div>
                  <FieldLabel className="mb-2">Duration</FieldLabel>
                  <div>{nft.duration / 3600} hours</div>
                </div>
                {nft.availabilityTo !== 0 && nft.availabilityTo < Date.now() / 1000 ? (
                  <div>Out of availability range</div>
                ) : (
                  <div className="flex gap-5">
                    <div>
                      <FieldLabel className="mb-2">Availability From</FieldLabel>
                      <div>
                        {nft.availabilityFrom > Date.now() / 1000
                          ? new Date(nft.availabilityFrom * 1000).toLocaleString('en-us', {
                              dateStyle: 'long',
                            })
                          : 'Now'}
                      </div>
                    </div>
                    <div>
                      <FieldLabel className="mb-2">Availability To</FieldLabel>
                      <div>
                        {nft.availabilityTo === 0
                          ? 'No End Date'
                          : new Date(nft.availabilityTo * 1000).toLocaleString('en-us', {
                              dateStyle: 'long',
                            })}
                      </div>
                    </div>
                  </div>
                )}
                <div>
                  <FieldLabel className="mb-2">Royalities</FieldLabel>
                  <div>{(nft.royaltyBasisPoints / 100).toString()} %</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
