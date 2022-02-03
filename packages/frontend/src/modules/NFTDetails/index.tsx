import React, { useEffect, useState } from 'react'
import { FaShareAlt, FaChevronCircleLeft } from 'react-icons/fa'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppDataProvider } from '../../lib/providers/app-data-provider'
import { Category, NFTProps } from '../../types'
import { Dialog } from '@headlessui/react'
import { useWeb3React } from '@web3-react/core'

interface NFT {
    name: string;
    description: string;
    category: string;
    duration: number;
    availabilityTo: number;
    availabilityFrom: number;
    royalty: number;
    owner: string;
}

interface NFTDetailsParams {
    activeNft?: NFT;
}

export default function NFTDetails({ activeNft }: NFTDetailsParams) {
    const { currentAccount, nftCollectionService } = useAppDataProvider();
    const { library: provider } = useWeb3React();
    const [owner, setOwner] = useState<Boolean>(true);
    const [nft, setNft] = useState<NFT>();
    const [shareProfileModalOpen, setShareProfileModalOpen] = useState<boolean>(false)
    const location = useLocation();
    const navigate = useNavigate();
    const path = location.pathname.split('/');
    const baseUrl = "https://elated-kalam-a67780.netlify.app"; // Preview Deploy

    useEffect(() => {
        if (nft) {
            nft.owner === currentAccount ? setOwner(true) : setOwner(false);
        } else {
            // If no NFT is passed (not accessing from profile or marketplace link), fetch from GQl
        }
    }, [path, currentAccount, nft])


    return (
        <div className="flex h-full flex-col overflow-hidden">
            <FaChevronCircleLeft onClick={() => navigate(-1)} />
            <div className="basis-1/4">
                <div className="p-10 flex flex-row justify-between">
                    {/** Column 1: NFT Image + buy/sell/redeem options */}
                    <div className="flex-col">
                        {/** Profile Header */}
                        <div className="w-1/4 p-5 justify-items-start">
                            <div className="flex flex-row justify-evenly">
                                {/** Avatar/Blockie */}
                                <img alt="ens avatar" src="https://lh3.googleusercontent.com/nbLoKXUB707PZ2iBQ6JBVE8Ytu6Wms5HwiM3_Ssvi0LuAKS-CYU1mcdjr6naiyiaSY_FyYZHAdJWQ3emrHcff_k6-ZKPIKyMpCZN=w600" />
                                {/** ENS Name/Address */}
                                <div className="text-black dark:text-white">{path[2]}</div>
                            </div>
                        </div>
                    </div>

                    {/** Column 2: NFT Details */}
                    <div className="flex-col">
                        {/** Share Profile */}
                        <div className="w-1/4 p-5 justify-items-end">
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
                    </div >
                </div>
            </div>
        </div >
    )
}

