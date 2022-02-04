import React, { useEffect, useState } from 'react'
import { FaShareAlt, FaChevronCircleLeft, FaSpinner } from 'react-icons/fa'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppDataProvider } from '../../lib/providers/app-data-provider'
import { Dialog } from '@headlessui/react'
import { NFTProps } from '../../types'


interface NftState {
    nft?: NFTProps
}

export default function NFTDetails() {
    const { currentAccount } = useAppDataProvider();
    const [owner, setOwner] = useState<Boolean>(true);
    const location = useLocation();
    const state = location.state as NftState;
    const [nft, setNft] = useState<NFTProps>();
    const [uri, setURI] = useState<string>();
    const [shareProfileModalOpen, setShareProfileModalOpen] = useState<boolean>(false)
    const navigate = useNavigate();
    const path = location.pathname.split('/');
    const baseUrl = "https://elated-kalam-a67780.netlify.app"; // Preview Deploy

    const fetchURI = async (nft: NFTProps) => {
        const response = await fetch(nft.tokenURI);
        const data = await response.json();
        setURI(data.image);
    }

    const buy = () => {
        // Trigger purchase (+ approval if required)
    }


    useEffect(() => {
        if (state && state.nft) {
            setNft(state.nft);
            state.nft.owner === currentAccount ? setOwner(true) : setOwner(false);
        } else {
            // If no NFT is passed (not accessing from profile or marketplace link), fetch from GQl
            console.log("NO NFT PASSSED")
        }
    }, [path, currentAccount, state])

    // Render URI
    useEffect(() => {
        if (nft) {
            fetchURI(nft);
        }
    }, [nft])

    if (!nft) {
        return <FaSpinner />
    } else {
        console.log(nft)
        return (
            <div className="h-full">
                <FaChevronCircleLeft onClick={() => navigate(-1)} className="text-black dark:text-white cursor-pointer" />
                <div className="flex flex-row">
                    {/** Column 1: NFT Image + buy/sell/redeem options */}
                    <div className="basis-1/3">
                        <div className="flex-col justify-evenly w-full">
                            <div className="w-full bg-white rounded-md border border-gray-300">
                                <img alt="token uri" src={uri} className="p-3" />
                            </div>
                            {/** Buy or Sell/Redeem */}
                            {!owner ? <div className="text-black dark:text-white">
                                Price
                                <div className="text-black dark:text-white">{nft.cost.toString()} {nft.currencySymbol}</div>
                                <div className="items-center justify-center px-6 py-1 border border-transparent text-base font-semibold rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-2 md:text-lg md:px-8 cursor-pointer" onClick={() => buy()}>
                                    Buy Now
                                </div>
                            </div> : <div className="w-1/4 p-5 justify-items-start flex-1">
                                <div className="flex flex-row justify-evenly w-full">
                                    <div className="w-full bg-white rounded-md border border-gray-300">
                                        <img alt="token uri" src={uri} className="p-3" />
                                        <img alt="token uri" src={uri} className="p-3" />
                                    </div>
                                </div>
                            </div>}
                        </div>
                    </div>

                    {/** Column 2: NFT Details */}
                    <div className="basis-2/3">
                        {/** Title and Category */}
                        <div className="flex flex-row justify-between p-5">
                            <div className="flex-start">
                                <div className="flex flex-col">
                                    <div className="text-black dark:text-white">{nft.title}</div>
                                    <div className="text-black dark:text-white">{nft.category}</div>
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
                                    <div className="text-black dark:text-white">Created By</div>
                                    <div className="flex flex-row">
                                        <img src={nft.avatar} alt="creator avatar" />
                                        <div>{nft.creator}</div>
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <div className="text-black dark:text-white">Owned By</div>
                                    <div className="flex flex-row">
                                        <img src={nft.avatar} alt="owner avatar" />
                                        <div>{nft.owner}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col p-5">

                            <div className="text-black dark:text-white">Description</div>
                            <div className="text-black dark:text-white">{nft.description}</div>
                        </div>
                        <div className="text-black dark:text-white p-5">Details</div>
                        <div className="flex flex-col p-5">
                            <div className="text-black dark:text-white">Duration</div>
                            <div className="text-black dark:text-white">{nft.duration.toString()} hours</div>
                        </div>
                        <div className="flex flex-row p-5">
                            <div className="flex flex-col">
                                <div className="text-black dark:text-white">Availability From</div>
                                <div className="text-black dark:text-white">{nft.availablilityFrom}</div>
                            </div>
                            <div className="flex flex-col p-5">
                                <div className="text-black dark:text-white">Availability To</div>
                                <div className="text-black dark:text-white">{nft.availabilityTo} hours</div>
                            </div>
                        </div>
                        <div className="flex flex-col p-5">
                            <div className="text-black dark:text-white">Royalties</div>
                            <div className="text-black dark:text-white">{nft.royaltyPercentage.toString()} %</div>
                        </div>
                    </div >
                </div>
            </div >
        )
    }
}

