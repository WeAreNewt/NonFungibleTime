import React, { useEffect, useState } from 'react'
import { FaShareAlt, FaChevronCircleLeft, FaSpinner } from 'react-icons/fa'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppDataProvider } from '../../lib/providers/app-data-provider'
import { Dialog } from '@headlessui/react'
import { NFTProps } from '../../types'
import { PaymentToken } from '../../lib/graphql'
import { ZERO_ADDRESS, isEthAddress } from '../../lib/helpers/base-service'
import { BuyTokenParamsType, ChangeBuyingConditionsParamsType, RedeemParamsType } from '../../lib/helpers/NftCollection'
import { BigNumber } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import { formatUnits, parseUnits } from 'ethers/lib/utils'


interface NftState {
    nft?: NFTProps
}

interface BuyingConditions {
    forSale: boolean;
    price: number;
    currency: PaymentToken;
    whitelistedBuyer: string;
}

export default function NFTDetails() {
    const { currentAccount, nftCollectionService } = useAppDataProvider();
    const [owner, setOwner] = useState<Boolean>(false);
    const location = useLocation();
    const { library: provider } = useWeb3React()
    const state = location.state as NftState;
    const [nft, setNft] = useState<NFTProps>();
    const [uri, setURI] = useState<string>();
    const [formError, setFormError] = useState<string | undefined>(undefined)
    const [buyingConditions, setBuyingConditions] = useState<BuyingConditions>({} as BuyingConditions);
    const [ownerSelectedMode, setOwnerSelectedMode] = useState<string>("update");
    const [shareProfileModalOpen, setShareProfileModalOpen] = useState<boolean>(false)
    const navigate = useNavigate();
    const path = location.pathname.split('/');
    const baseUrl = "https://elated-kalam-a67780.netlify.app"; // Preview Deploy

    const fetchURI = async (nft: NFTProps) => {
        const response = await fetch(nft.tokenURI);
        const data = await response.json();
        setURI(data.image);
    }



    // Trigger buy transaction (+ approval if required)
    const buy = async () => {
        if (nft && currentAccount) {
            const input: BuyTokenParamsType = { userAddress: currentAccount, tokenId: nft.tokenId, currency: nft.currency.id, price: BigNumber.from(nft.cost) }
            setFormError(undefined);
            const txs = await nftCollectionService.buyToken(input)
            const tx = txs[0]
            const extendedTxData = await tx.tx();
            const { from, ...txData } = extendedTxData;
            const signer = provider.getSigner(from);
            const txResponse = await signer.sendTransaction({
                ...txData,
                value: txData.value ? BigNumber.from(txData.value) : undefined,
            });
            console.log(txResponse)
        } else {
            setFormError('No wallet connected')
        }
    }

    // Trigger redeem transaction
    const redeem = async () => {
        if (nft && currentAccount) {
            const input: RedeemParamsType = { userAddress: currentAccount, tokenId: nft.tokenId }
            setFormError(undefined);
            const txs = await nftCollectionService.redeem(input)
            const tx = txs[0]
            const extendedTxData = await tx.tx();
            const { from, ...txData } = extendedTxData;
            const signer = provider.getSigner(from);
            const txResponse = await signer.sendTransaction({
                ...txData,
                value: txData.value ? BigNumber.from(txData.value) : undefined,
            });
            console.log(txResponse)
        } else {
            setFormError('No wallet connected')
        }
    }

    // Trigger changeBuyingConditions transaction
    const changeBuyingConditions = async () => {
        if (nft && currentAccount && buyingConditions) {
            if (isEthAddress(buyingConditions.whitelistedBuyer)) {
                const formattedPrice = parseUnits(buyingConditions.price.toString(), buyingConditions.currency.decimals);
                const input: ChangeBuyingConditionsParamsType = { userAddress: currentAccount, tokenId: nft.tokenId, currency: buyingConditions.currency.id, price: formattedPrice, allowedBuyer: buyingConditions.whitelistedBuyer, forSale: buyingConditions.forSale }
                console.log(input)
                setFormError(undefined);
                const txs = await nftCollectionService.changeBuyingConditions(input)
                const tx = txs[0]
                const extendedTxData = await tx.tx();
                const { from, ...txData } = extendedTxData;
                const signer = provider.getSigner(from);
                const txResponse = await signer.sendTransaction({
                    ...txData,
                    value: txData.value ? BigNumber.from(txData.value) : undefined,
                });
                console.log(txResponse)
            } else {
                setFormError('Whitelisted buyer is not a valid ethereum address')
            }
        } else {
            setFormError('No wallet connected')
        }
    }

    // Get NFT data from state parameters or subgraph query
    useEffect(() => {
        if (state && state.nft) {
            setNft(state.nft);
            state.nft.owner === currentAccount ? setOwner(true) : setOwner(false);
        } else {
            // If no NFT is passed (not accessing from profile or marketplace link), fetch from GQl
            console.log("NO NFT PASSSED")
        }
    }, [path, currentAccount, state])

    // Render token svg
    useEffect(() => {
        if (nft) {
            fetchURI(nft);
            // All of these fields will come from nft once fetching from subgraph
            setBuyingConditions({
                forSale: nft.forSale,
                price: nft.cost,
                currency: {
                    acceptable: true,
                    decimals: 18,
                    id: ZERO_ADDRESS,
                    symbol: nft.currency.symbol,
                },
                whitelistedBuyer: "0x0000000000000000000000000000000000000000",
            })
        }
    }, [nft])

    // Hard-coded for now, will come from app-data-provider
    const availableCurrencies: Record<string, PaymentToken> = {
        'MATIC': {
            acceptable: true,
            id: ZERO_ADDRESS,
            symbol: 'MATIC',
            decimals: 18
        }
    }

    // Styling for owner buttons
    const selected = "items-center justify-center px-6 py-1 border border-transparent text-base font-semibold rounded-md text-white bg-indigo-600 hover:bg-gray-500 md:py-2 md:text-lg md:px-8 cursor-pointer"
    const unselected = "items-center justify-center px-6 py-1 border border-transparent text-base font-semibold rounded-md text-black bg-white hover:bg-gray-500 md:py-2 md:text-lg md:px-8 cursor-pointer"

    if (!nft) {
        return <FaSpinner />
    } else {
        return (
            <div className="h-full text-black dark:text-white">
                <FaChevronCircleLeft onClick={() => navigate(-1)} className=" cursor-pointer" />
                <div className="flex flex-row">
                    {/** Column 1: NFT Image + buy/sell/redeem options */}
                    <div className="basis-1/3">
                        <div className="flex-col justify-evenly w-full">
                            <div className="w-full bg-white rounded-md border border-gray-300">
                                <img alt="token uri" src={uri} className="p-3" />
                            </div>
                            {/** If redeemed -> show redeemed message
                             *   if not redeemed -> display panel based on nft ownership 
                             *      if not owner -> display purchase panel or not for sale
                             *      if owner -> display panel to toggle between redeem or change selling options
                             * */}
                            {
                                nft.redeemed ? <div>This NFT has been redeemed</div> : !owner ?
                                    (nft.forSale ? <div>
                                        Price
                                        <div >{formatUnits(nft.cost.toString(), 18)} {nft.currency.symbol}</div>
                                        <div className="items-center justify-center px-6 py-1 border border-transparent text-base font-semibold rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-2 md:text-lg md:px-8 cursor-pointer" onClick={() => buy()}>
                                            Buy Now
                                        </div>
                                        <div className="text-red-500 text-center">
                                            {formError}
                                        </div>
                                    </div> : <div>This NFT is not for sale</div>) :
                                    <div className="flex flex-col p-5">
                                        <div className="flex flex-row">
                                            <div className={ownerSelectedMode === 'update' ? selected : unselected} onClick={() => setOwnerSelectedMode("update")}>
                                                Update Selling Options
                                            </div>
                                            <div className={ownerSelectedMode === 'redeem' ? selected : unselected} onClick={() => setOwnerSelectedMode("redeem")}>
                                                Redeem
                                            </div>
                                        </div>
                                        {
                                            ownerSelectedMode === 'redeem' ?
                                                <div className="flex flex-col">
                                                    <div>This NFT has not yet been redeemed. Note: This is a one time action and cannot be reversed</div>
                                                    <div className="items-center justify-center px-6 py-1 border border-transparent text-base font-semibold rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-2 md:text-lg md:px-8 cursor-pointer" onClick={() => redeem()}>
                                                        Redeem
                                                    </div>
                                                </div> :
                                                <div className="flex flex-col">
                                                    {/** For sale toggle */}
                                                    <label className="relative flex justify-between items-center p-2 text-xl">
                                                        For Sale
                                                        <input type="checkbox" className="absolute left-1/2 -translate-x-1/2 w-full h-full peer appearance-none rounded-md cursor-pointer" checked={buyingConditions.forSale} onChange={() => { setBuyingConditions({ ...buyingConditions, forSale: !buyingConditions.forSale }) }} />
                                                        <span className="w-16 h-10 flex items-center flex-shrink-0 ml-4 p-1 bg-gray-300 rounded-full duration-300 ease-in-out peer-checked:bg-indigo-600 after:w-8 after:h-8 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-6 cursor-pointer"></span>
                                                    </label>
                                                    {/** Price and currency */}
                                                    <div className='flex flex-row'>
                                                        <label className="relative flex justify-between items-center p-2 text-xl">
                                                            Price
                                                            <input className="text-black" type="number" onChange={(e) => { setBuyingConditions({ ...buyingConditions, price: Number(e.target.value) }) }} />
                                                        </label>
                                                        <label className="relative flex justify-between items-center p-2 text-xl">
                                                            Currency
                                                            <select className="text-black" onChange={(e) => { setBuyingConditions({ ...buyingConditions, currency: availableCurrencies[e.target.value] }) }} >
                                                                {Object.entries(availableCurrencies).map(currency => <option key={currency[0]}>{currency[0]}</option>)}
                                                            </select>
                                                        </label>
                                                    </div>
                                                    {/** Whitelist buyer */}
                                                    <label className="relative flex justify-between items-center p-2 text-xl">
                                                        Whitelist Buyer Address
                                                        <input className="text-black" type="text" onChange={(e) => { setBuyingConditions({ ...buyingConditions, whitelistedBuyer: e.target.value }) }} placeholder='Reserve NFT for a single buyer' />
                                                    </label>
                                                    <div className="items-center justify-center px-6 py-1 border border-transparent text-base font-semibold rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-2 md:text-lg md:px-8 cursor-pointer" onClick={() => changeBuyingConditions()}>
                                                        Update
                                                    </div>
                                                </div>
                                        }
                                        <div className="text-red-500 text-center">
                                            {formError}
                                        </div>
                                    </div>
                            }
                        </div>
                    </div>

                    {/** Column 2: NFT Details */}
                    <div className="basis-2/3">
                        {/** Title and Category */}
                        <div className="flex flex-row justify-between p-5">
                            <div className="flex-start">
                                <div className="flex flex-col">
                                    <div >{nft.title}</div>
                                    <div >{nft.category}</div>
                                </div>
                            </div>
                            {/** Share Profile */}
                            <div className="flex-end">
                                <div className="flex flex-row justify-evenly">
                                    <div className="items-center justify-center px-6 py-1 border border-gray text-base font-semibold rounded-md text-black bg-white hover:bg-gray-400 md:py-2 md:text-lg md:px-8 cursor-pointer" onClick={() => setShareProfileModalOpen(true)}>
                                        <FaShareAlt /> Share
                                    </div>
                                    {/** Share Profile Modal */}
                                    <Dialog open={shareProfileModalOpen} onClose={() => setShareProfileModalOpen(false)} className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">

                                            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

                                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>


                                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                                    <div className="sm:flex sm:items-start">
                                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                                            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                                                Share
                                                            </h3>
                                                            <div className="mt-2">
                                                                <div>
                                                                    <label htmlFor="profile-link" className="block text-sm font-medium text-gray-700">Profile Link</label>
                                                                    <div className="mt-1 relative rounded-md shadow-sm">
                                                                        <input disabled={true} type="text" name="profile-link" id="price" className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md" placeholder={baseUrl + location.pathname} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                                    <button type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm" onClick={() => { navigator.clipboard.writeText(baseUrl + location.pathname) }}>
                                                        Copy URL
                                                    </button>
                                                    <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" onClick={() => setShareProfileModalOpen(false)}>
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
                        <div className="flex flex-row p-5">
                            <div className="flex-start">
                                <div className="flex flex-col">
                                    <div >Created By</div>
                                    <div className="flex flex-row">
                                        <div >{nft.creator}</div>
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <div >Owned By</div>
                                    <div className="flex flex-row">
                                        <div>{nft.owner}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col p-5">
                            <div >Description</div>
                            <div >{nft.description}</div>
                        </div>
                        <div className="text-black dark:text-white p-5">Details</div>
                        <div className="flex flex-col p-5">
                            <div >Duration</div>
                            <div >{nft.duration.toString()} hours</div>
                        </div>
                        <div className="flex flex-row p-5">
                            <div className="flex flex-col">
                                <div >Availability From</div>
                                <div >{nft.availablilityFrom}</div>
                            </div>
                            <div className="flex flex-col p-5">
                                <div >Availability To</div>
                                <div >{nft.availabilityTo}</div>
                            </div>
                        </div>
                        <div className="flex flex-col p-5">
                            <div >Royalties</div>
                            <div >{nft.royaltyPercentage.toString()} %</div>
                        </div>
                    </div >
                </div>
            </div >
        )
    }
}

