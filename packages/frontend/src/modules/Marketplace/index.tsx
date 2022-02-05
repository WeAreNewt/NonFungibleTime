import { useQuery } from '@apollo/client';
import React from 'react';
import NFTCard from '../../components/NFTCard';
import { NFTGrid } from '../../components/NFTGrid';
import { SalesDocument } from '../../lib/graphql/index';
import { ZERO_ADDRESS } from '../../lib/helpers/base-service';
import { Category, NFTProps } from '../../types';

const sampleNFTs: NFTProps[] = [
  {
    address: '0x2DC2791962219Ad52460107a09522Bb2B4e6fFDe',
    name: 'soliditychad.eth',
    category: Category.business,
    title: 'Test 1',
    description: "Here's a test NFT on my account",
    cost: 1,
    currency: {
      id: ZERO_ADDRESS,
      symbol: 'ETH',
      decimals: 18,
      acceptable: true,
    },
    tokenId: 0,
    owner: '0x0',
    tokenURI: '',
    creator: 'soliditychad.eth',
    duration: 2,
    availabilityTo: 'May 12, 2022 9:00 EST',
    availablilityFrom: 'May 15, 2022 9:00 EST',
    royaltyPercentage: 5,
    redeemed: false,
    forSale: true,
  },
  {
    address: '0x2DC2791962219Ad52460107a09522Bb2B4e6fFDe',
    name: 'soliditychad.eth',
    category: Category.business,
    title: 'Test 2',
    description:
      "Here's another test NFT on my account. Quis in Lorem id enim minim commodo. Enim veniam ad nostrud labore duis. Quis laboris mollit culpa id ad. Aliqua magna veniam ut laboris fugiat non anim ea quis aliquip ad occaecat ea. In amet Lorem laborum sunt.Reprehenderit ut enim exercitation nisi ad eu amet sunt ipsum ex do duis ea proident. Cillum sit ut ullamco laborum minim proident ipsum fugiat elit sunt. Eiusmod enim do commodo proident ullamco. Quis amet consectetur qui est irure sunt proident sint irure et amet. ",
    cost: 5,
    currency: {
      id: ZERO_ADDRESS,
      symbol: 'ETH',
      decimals: 18,
      acceptable: true,
    },
    tokenId: 1,
    owner: '0x1',
    tokenURI: '',
    creator: 'soliditychad.eth',
    duration: 2,
    availabilityTo: 'May 12, 2022 9:00 EST',
    availablilityFrom: 'May 15, 2022 9:00 EST',
    royaltyPercentage: 5,
    redeemed: false,
    forSale: true,
  },
  {
    address: '0x2DC2791962219Ad52460107a09522Bb2B4e6fFDe',
    name: 'soliditychad.eth',
    category: Category.business,
    title: 'Test 3',
    description: "Here's a test NFT on my account",
    cost: 1,
    currency: {
      id: ZERO_ADDRESS,
      symbol: 'ETH',
      decimals: 18,
      acceptable: true,
    },
    tokenId: 2,
    owner: '0x2',
    tokenURI: '',
    creator: 'soliditychad.eth',
    duration: 2,
    availabilityTo: 'May 12, 2022 9:00 EST',
    availablilityFrom: 'May 15, 2022 9:00 EST',
    royaltyPercentage: 5,
    redeemed: false,
    forSale: true,
  },
  {
    address: '0x2DC2791962219Ad52460107a09522Bb2B4e6fFDe',
    name: 'soliditychad.eth',
    category: Category.business,
    title: 'Test 4',
    description: "Here's another test NFT on my account",
    cost: 5,
    currency: {
      id: ZERO_ADDRESS,
      symbol: 'ETH',
      decimals: 18,
      acceptable: true,
    },
    tokenId: 3,
    owner: '0x3',
    tokenURI: '',
    creator: 'soliditychad.eth',
    duration: 2,
    availabilityTo: 'May 12, 2022 9:00 EST',
    availablilityFrom: 'May 15, 2022 9:00 EST',
    royaltyPercentage: 5,
    redeemed: false,
    forSale: true,
  },
  {
    address: '0x2DC2791962219Ad52460107a09522Bb2B4e6fFDe',
    name: 'soliditychad.eth',
    category: Category.business,
    title: 'Test 5',
    description: "Here's a test NFT on my account",
    cost: 1,
    currency: {
      id: ZERO_ADDRESS,
      symbol: 'ETH',
      decimals: 18,
      acceptable: true,
    },
    tokenId: 4,
    owner: '0x4',
    tokenURI: '',
    creator: 'soliditychad.eth',
    duration: 2,
    availabilityTo: 'May 12, 2022 9:00 EST',
    availablilityFrom: 'May 15, 2022 9:00 EST',
    royaltyPercentage: 5,
    redeemed: false,
    forSale: true,
  },
  {
    address: '0x2DC2791962219Ad52460107a09522Bb2B4e6fFDe',
    name: 'soliditychad.eth',
    category: Category.business,
    title: 'Test 6',
    description: "Here's another test NFT on my account",
    cost: 5,
    currency: {
      id: ZERO_ADDRESS,
      symbol: 'ETH',
      decimals: 18,
      acceptable: true,
    },
    tokenId: 5,
    owner: '0x5',
    tokenURI: '',
    creator: 'soliditychad.eth',
    duration: 2,
    availabilityTo: 'May 12, 2022 9:00 EST',
    availablilityFrom: 'May 15, 2022 9:00 EST',
    royaltyPercentage: 5,
    redeemed: false,
    forSale: true,
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
  console.log('loading', loading);
  console.log('error', error);

  return (
    <div className="flex flex-col max-w-7xl m-auto p-10">
      <div className="flex flex-row justify-between">
        {/** Marketplace Header */}
        <div className="w-1/2 justify-items-start">
          <div className="items-center text-gray-900 text-4xl font-extrabold">
            Explore marketplace
          </div>
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
      <NFTGrid>
        {sampleNFTs.map((nft) => {
          return <NFTCard {...nft} />;
        })}
      </NFTGrid>

      {/** NFT Display */}
    </div>
  );
}
