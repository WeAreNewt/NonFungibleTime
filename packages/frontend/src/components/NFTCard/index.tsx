import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NFT } from '../../types';
import { CategoryDisplay } from '../Category';
import { PriceDisplay } from '../PriceDisplay';
import { UserDetail } from '../UserDetail';

interface NftCardProps {
  nft: NFT;
}

export default function NFTCard({ nft }: NftCardProps) {
  const navigate = useNavigate();
  const mintDatetime = new Date(nft.mintTimestamp * 1000);
  const mintDateString = mintDatetime.toLocaleString('en-us', { dateStyle: 'medium' });

  return (
    <div
      className="bg-white dark:bg-black rounded-lg shadow-lg p-5 cursor-pointer space-y-2 dark:border dark:border-slate-500"
      onClick={() =>
        navigate('/nft/' + nft.tokenId, {
          state: {
            nft,
          },
        })
      }
    >
      <UserDetail address={nft.creator.id} caption={mintDateString} />
      {/** Tag */}
      <CategoryDisplay>{nft.category ? nft.category : 'Other'}</CategoryDisplay>
      {/** NFT Description */}
      <div className="text-xl leading-7 font-semibold  dark:text-white text-black ">
        {' '}
        {nft.name}
      </div>
      <div className="text-base leading-6 text-gray-500 font-normal line-clamp-4 ">
        {nft.description}
      </div>
      {/** Pricing / Status */}
      {nft.forSale ?
        <PriceDisplay amount={nft.price} token={nft.currency} /> : <div className=" dark:text-white text-lg leading-7 font-semibold text-gray-900">
          Not for sale
        </div>}
    </div>
  );
}
