import { useSubscription } from '@apollo/client';
import React from 'react';
import { FaSpinner } from 'react-icons/fa';
import NFTCard from '../../components/NFTCard';
import { NFTGrid } from '../../components/NFTGrid';
import { NftsDocument } from '../../lib/graphql/index';
import { NFT } from '../../types';

export default function Marketplace() {
  const { data, loading } = useSubscription(NftsDocument);
  const nfts: NFT[] | undefined = data && data.nfts ? data.nfts : undefined;

  return (
    <div className="bg-slate-100 dark:bg-black">
      <div className="flex flex-col max-w-7xl m-auto p-10">
        <div className="flex flex-row justify-between">
          {/** Marketplace Header */}
          <div className="w-1/2 justify-items-start">
            <div className="items-center text-gray-900 dark:text-white text-4xl font-extrabold">
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
        {loading || !nfts ? (
          <FaSpinner />
        ) : (
          <NFTGrid>
            {nfts.map((nft, index) => {
              return <NFTCard key={index} nft={nft} />;
            })}
          </NFTGrid>
        )}

        {/** NFT Display */}
      </div>
    </div>
  );
}
