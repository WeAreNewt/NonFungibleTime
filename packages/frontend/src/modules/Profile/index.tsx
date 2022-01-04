import React from 'react'
import { FaShareAlt } from 'react-icons/fa'
import NFTCard from '../../components/NFTCard'
import { Category, NFTProps } from '../../types'

const sampleNFTs: NFTProps[] = [
    {
        address: '0x2DC2791962219Ad52460107a09522Bb2B4e6fFDe',
        name: 'soliditychad.eth',
        category: Category.business,
        date: '20220402',
        title: 'Test 1',
        description: "Here's a test NFT on my account",
        cost: 1,
        currencySymbol: 'ETH',
        currencyAddress: '0x0',
    },
    {
        address: '0x2DC2791962219Ad52460107a09522Bb2B4e6fFDe',
        name: 'soliditychad.eth',
        category: Category.business,
        date: '20220402',
        title: 'Test 2',
        description: "Here's another test NFT on my account",
        cost: 5,
        currencySymbol: 'DAI',
        currencyAddress: '0x0',
    },
    {
        address: '0x2DC2791962219Ad52460107a09522Bb2B4e6fFDe',
        name: 'soliditychad.eth',
        category: Category.business,
        date: '20220402',
        title: 'Test 3',
        description: "Here's a test NFT on my account",
        cost: 1,
        currencySymbol: 'ETH',
        currencyAddress: '0x0',
    },
    {
        address: '0x2DC2791962219Ad52460107a09522Bb2B4e6fFDe',
        name: 'soliditychad.eth',
        category: Category.business,
        date: '20220402',
        title: 'Test 4',
        description: "Here's another test NFT on my account",
        cost: 5,
        currencySymbol: 'DAI',
        currencyAddress: '0x0',
    },
    {
        address: '0x2DC2791962219Ad52460107a09522Bb2B4e6fFDe',
        name: 'soliditychad.eth',
        category: Category.business,
        date: '20220402',
        title: 'Test 5',
        description: "Here's a test NFT on my account",
        cost: 1,
        currencySymbol: 'ETH',
        currencyAddress: '0x0',
    },
    {
        address: '0x2DC2791962219Ad52460107a09522Bb2B4e6fFDe',
        name: 'soliditychad.eth',
        category: Category.business,
        date: '20220402',
        title: 'Test 6',
        description: "Here's another test NFT on my account",
        cost: 5,
        currencySymbol: 'DAI',
        currencyAddress: '0x0',
    },
]

export default function Profile() {
    return (
        <div className="flex h-full flex-col overflow-hidden">
            <div className="basis-1/4">
                <div className="p-10 flex flex-row justify-between">
                    {/** Profile Header */}
                    <div className="w-1/4 p-5 justify-items-start">
                        <div className="flex flex-row justify-evenly">
                            {/** Avatar/Blockie */}
                            <img src="https://lh3.googleusercontent.com/nbLoKXUB707PZ2iBQ6JBVE8Ytu6Wms5HwiM3_Ssvi0LuAKS-CYU1mcdjr6naiyiaSY_FyYZHAdJWQ3emrHcff_k6-ZKPIKyMpCZN=w600" />
                            {/** ENS Name/Address */}
                            <div>soliditychad.eth</div>
                        </div>
                    </div>

                    {/** Share Profile */}
                    <div className="w-1/4 p-5 justify-items-end">
                        <div className="flex flex-row justify-evenly">
                            <div className="items-center justify-center px-6 py-1 border border-gray text-base font-semibold rounded-md text-black bg-white hover:bg-gray-400 md:py-2 md:text-lg md:px-8 cursor-pointer">
                                <FaShareAlt /> Share Profile
                            </div>
                            {/** Mint */}
                            <div className="items-center justify-center px-6 py-1 border border-transparent text-base font-semibold rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-2 md:text-lg md:px-8 cursor-pointer">
                                Mint New
                            </div>
                        </div>
                    </div>



                </div >
            </div>
            { /** NFT Display */}
            <div className="basis-3/4 grid grid-cols-3">
                {sampleNFTs.map((nft) => {
                    return <div className="p-10">
                        <NFTCard {...nft} />
                    </div>
                })}
            </div>

        </div >
    )
}

