import React from 'react';
import { formatUnits } from 'ethers/lib/utils';
import { useNavigate } from 'react-router-dom';
import { NFT } from '../../types';
import { PriceDisplay } from '../PriceDisplay';

interface NftCardProps {
  nft: NFT;
}

export default function NFTCard({
  nft
}: NftCardProps) {
  const navigate = useNavigate();
  return (
    <div
      className="bg-white dark:bg-black rounded-lg shadow-lg p-5 cursor-pointer space-y-2"
      onClick={() =>
        navigate('/details/' + nft.tokenId, {
          state: {
            nft
          },
        })
      }
    >
      <div className="flex gap-2 items-center">
        <div className="rounded-full bg-slate-400 w-9 h-9"></div>
        <div className="flex flex-col">
          <div className="text-gray-800 leading-5 text-sm"> {nft.name}</div>
          <div className="text-gray-500 leading-5 text-sm"> Some date</div>
        </div>
      </div>

      {/** Tag */}
      <div className="bg-blue-100 text-blue-800 px-2 py-1  text-xs rounded-xl inline-block  dark:text-white">
        {nft.work}
      </div>
      {/** NFT Description */}
      <div className="text-xl leading-7 font-semibold  dark:text-white text-black "> {nft.name}</div>
      <div className="text-base leading-6 text-gray-500 font-normal line-clamp-4 ">
        {nft.description}
      </div>
      {/** Pricing */}
      <PriceDisplay amount={nft.price} currency={nft.currency} />
    </div>
  );
}
