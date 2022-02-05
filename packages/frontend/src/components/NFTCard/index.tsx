import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatEthAddress } from '../../lib/helpers/format';
import { NFTProps } from '../../types';
import { CategoryDisplay } from '../Category';
import { PriceDisplay } from '../PriceDisplay';
import { UserDetail } from '../UserDetail';

export default function NFTCard({
  address,
  name,
  avatar,
  category,
  title,
  description,
  cost,
  currency,
  tokenId,
  owner,
  tokenURI,
  creator,
  availabilityTo,
  availablilityFrom,
  duration,

  royaltyPercentage,
  redeemed,
  forSale,
}: NFTProps) {
  const navigate = useNavigate();
  return (
    <div
      className="bg-white dark:bg-black rounded-lg shadow-lg p-5 cursor-pointer space-y-2"
      onClick={() =>
        navigate('/details/' + tokenId, {
          state: {
            nft: {
              address,
              name,
              avatar,
              category,
              title,
              description,
              cost,
              currency,
              tokenId,
              owner,
              tokenURI,
              creator,
              availabilityTo,
              availablilityFrom,
              duration,
              royaltyPercentage,
              redeemed,
              forSale,
            },
          },
        })
      }
    >
      {/* TODO: Add creation dateq */}
      <UserDetail name={name || formatEthAddress(address)} caption={'Dec 16, 2021'} />
      {/** Tag */}
      <CategoryDisplay>{category}</CategoryDisplay>
      {/** NFT Description */}
      <div className="text-xl leading-7 font-semibold  dark:text-white text-black "> {title}</div>
      <div className="text-base leading-6 text-gray-500 font-normal line-clamp-4 ">
        {description}
      </div>
      {/** Pricing */}
      <PriceDisplay amount={cost} currency={currency} />
    </div>
  );
}
