import React, { useEffect } from 'react'
import { FaShareAlt } from 'react-icons/fa'
import NFTCard from '../../components/NFTCard'
import { Category, NFTProps } from '../../types'
import { useAppDataProvider } from '../../lib/providers/app-data-provider'
import { NftCollectionService } from '../../lib/helpers/NftCollection'
import { BigNumber, providers } from 'ethers'
import { useWeb3React } from '@web3-react/core'

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

interface FetchTokenDataParams {
    collectionService: NftCollectionService;
    userAddress: string;
    provider: providers.Web3Provider;
}
async function mint({ collectionService, userAddress, provider }: FetchTokenDataParams) {

    const txs = await collectionService.mint({ userAddress, name: 'Frontend Test', description: 'Test Description', category: 'Test', availabilityFrom: 1, availabilityTo: 2, duration: 1, royaltyBasisPoints: 100 })
    const tx = txs[0]
    const extendedTxData = await tx.tx();
    const { from, ...txData } = extendedTxData;
    const signer = provider.getSigner(from);
    const txResponse = await signer.sendTransaction({
        ...txData,
        value: txData.value ? BigNumber.from(txData.value) : undefined,
    });
}

export default function Profile() {
    const { nftCollectionService, currentAccount } = useAppDataProvider();
    const { library: provider } = useWeb3React();
    console.log("CURRENT ACCOUNT");
    console.log(currentAccount)

    useEffect(() => {
        mint({ collectionService: nftCollectionService, userAddress: currentAccount ? currentAccount : '', provider });
    })
    return (
        <div className="flex h-full flex-col overflow-hidden">
            <div className="basis-1/4">
                <div className="p-10 flex flex-row justify-between">
                    {/** Profile Header */}
                    <div className="w-1/4 p-5 justify-items-start">
                        <div className="flex flex-row justify-evenly">
                            {/** Avatar/Blockie */}
                            <img alt="ens avatar" src="https://lh3.googleusercontent.com/nbLoKXUB707PZ2iBQ6JBVE8Ytu6Wms5HwiM3_Ssvi0LuAKS-CYU1mcdjr6naiyiaSY_FyYZHAdJWQ3emrHcff_k6-ZKPIKyMpCZN=w600" />
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

