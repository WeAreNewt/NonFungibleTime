import { useQuery } from '@apollo/client';
import React from 'react';
import NFTCard from '../../components/NFTCard';
import { SalesDocument } from '../../lib/graphql/index';
import { Category, NFTProps } from '../../types';

const sampleNFTs: NFTProps[] = [
  {
    address: '0x2DC2791962219Ad52460107a09522Bb2B4e6fFDe',
    name: 'soliditychad.eth',
    category: Category.business,
    title: 'Test 1',
    description: "Here's a test NFT on my account",
    cost: 1,
    currencySymbol: 'ETH',
    currencyAddress: '0x0',
    tokenId: 0,
    owner: '0x0',
    tokenURI: '',
    creator: 'soliditychad.eth',
    duration: 2,
    availabilityTo: 'May 12, 2022 9:00 EST',
    availablilityFrom: 'May 15, 2022 9:00 EST',
    royaltyPercentage: 5,
  },
  {
    address: '0x2DC2791962219Ad52460107a09522Bb2B4e6fFDe',
    name: 'soliditychad.eth',
    category: Category.business,
    title: 'Test 2',
    description: "Here's another test NFT on my account",
    cost: 5,
    currencySymbol: 'DAI',
    currencyAddress: '0x0',
    tokenId: 1,
    owner: '0x1',
    tokenURI: '',
    creator: 'soliditychad.eth',
    duration: 2,
    availabilityTo: 'May 12, 2022 9:00 EST',
    availablilityFrom: 'May 15, 2022 9:00 EST',
    royaltyPercentage: 5,
  },
  {
    address: '0x2DC2791962219Ad52460107a09522Bb2B4e6fFDe',
    name: 'soliditychad.eth',
    category: Category.business,
    title: 'Test 3',
    description: "Here's a test NFT on my account",
    cost: 1,
    currencySymbol: 'ETH',
    currencyAddress: '0x0',
    tokenId: 2,
    owner: '0x2',
    tokenURI: '',
    creator: 'soliditychad.eth',
    duration: 2,
    availabilityTo: 'May 12, 2022 9:00 EST',
    availablilityFrom: 'May 15, 2022 9:00 EST',
    royaltyPercentage: 5,
  },
  {
    address: '0x2DC2791962219Ad52460107a09522Bb2B4e6fFDe',
    name: 'soliditychad.eth',
    category: Category.business,
    title: 'Test 4',
    description: "Here's another test NFT on my account",
    cost: 5,
    currencySymbol: 'DAI',
    currencyAddress: '0x0',
    tokenId: 3,
    owner: '0x3',
    tokenURI: '',
    creator: 'soliditychad.eth',
    duration: 2,
    availabilityTo: 'May 12, 2022 9:00 EST',
    availablilityFrom: 'May 15, 2022 9:00 EST',
    royaltyPercentage: 5,
  },
  {
    address: '0x2DC2791962219Ad52460107a09522Bb2B4e6fFDe',
    name: 'soliditychad.eth',
    category: Category.business,
    title: 'Test 5',
    description: "Here's a test NFT on my account",
    cost: 1,
    currencySymbol: 'ETH',
    currencyAddress: '0x0',
    tokenId: 4,
    owner: '0x4',
    tokenURI: '',
    creator: 'soliditychad.eth',
    duration: 2,
    availabilityTo: 'May 12, 2022 9:00 EST',
    availablilityFrom: 'May 15, 2022 9:00 EST',
    royaltyPercentage: 5,
  },
  {
    address: '0x2DC2791962219Ad52460107a09522Bb2B4e6fFDe',
    name: 'soliditychad.eth',
    category: Category.business,
    title: 'Test 6',
    description: "Here's another test NFT on my account",
    cost: 5,
    currencySymbol: 'DAI',
    currencyAddress: '0x0',
    tokenId: 5,
    owner: '0x5',
    tokenURI: '',
    creator: 'soliditychad.eth',
    duration: 2,
    availabilityTo: 'May 12, 2022 9:00 EST',
    availablilityFrom: 'May 15, 2022 9:00 EST',
    royaltyPercentage: 5,
  },
];

export default function Marketplace() {
  const { data, loading, error } = useQuery(SalesDocument, {
    variables: {
      first: 100,
    },
  });
  // TODO: Populate nft cards with sales
  console.log('data', data);
  console.log('loading', loading)
  console.log('error', error)

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="basis-1/5">
        <div className="p-10 flex flex-row justify-between">
          {/** Marketplace Header */}
          <div className="w-1/4 p-5 justify-items-start">
            <div className="items-center">Explore Marketplace</div>
          </div>

          {/** Filter, TODO: Selector instead of button*/}
          <div className="w-1/4 p-5 justify-items-end">
            <div className="items-center">
              <div className="items-center justify-center px-6 py-1 border border-gray text-base font-semibold rounded-md text-black bg-white hover:bg-gray-400 md:py-2 md:text-lg md:px-8 cursor-pointer">
                Show All
              </div>
            </div>
          </div>
        </div>
      </div>
      {/** NFT Display */}
      <div className="basis-4/5 grid grid-cols-3">
        {sampleNFTs.map((nft) => {
          return (
            <div className="p-10">
              <NFTCard {...nft} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
