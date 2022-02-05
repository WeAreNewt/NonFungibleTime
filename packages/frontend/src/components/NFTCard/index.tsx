import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NFT } from '../../types';
import { CategoryDisplay } from '../Category';
import { PriceDisplay } from '../PriceDisplay';
import { UserDetail } from '../UserDetail';

interface NftCardProps {
  nft: NFT;
}

export default function NFTCard({
  nft
}: NftCardProps) {
  const navigate = useNavigate();
  return (
    <div
      className="bg-white dark:bg-black rounded-lg shadow-lg p-5 cursor-pointer space-y-2 dark:border dark:border-slate-500"
      onClick={() =>
        navigate('/details/' + nft.tokenId, {
          state: {
            nft
          },
        })
      }
    >

      <UserDetail address={nft.creator.id} caption={'Dec 16, 2021'} />
      {/** Tag */}
      <CategoryDisplay>{nft.work}</CategoryDisplay>
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
