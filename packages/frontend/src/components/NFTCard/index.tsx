import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDataProvider } from '../../lib/providers/app-data-provider';
import { EnsState, NFT } from '../../types';
import { CategoryDisplay } from '../Category';
import { PriceDisplay } from '../PriceDisplay';
import { UserDetail } from '../UserDetail';

interface NftCardProps {
  nft: NFT;
}

export default function NFTCard({ nft }: NftCardProps) {
  const { lookupAddress, ensRegistry } = useAppDataProvider()
  const [ensStatus, setEnsStatus] = useState<EnsState>(
    {
      loading: false,
      name: ensRegistry[nft.creator.id],
    }
  );
  const navigate = useNavigate();
  const mintDatetime = new Date(nft.mintTimestamp * 1000);
  const mintDateString = mintDatetime.toLocaleString('en-us', { dateStyle: 'medium' });

  // If user has no ens name in cache, set loading to true and lookup with mainnet provider
  useEffect(() => {
    let cancel = false;
    const lookup = async (address: string) => {
      // Prevent memory leak if component beocomes unmounted whlie fetching
      if (cancel) return;
      const name = await lookupAddress(address);
      setEnsStatus({
        loading: false,
        name,
      })
    }
    // If name is not set, fetch from cache
    // If address is not in cache and not currently loading, lookup with mainnet providr
    if (!ensStatus.name) {
      if (ensRegistry[nft.creator.id]) {
        setEnsStatus({
          loading: false,
          name: ensRegistry[nft.creator.id],
        })
      } else if (!ensStatus.loading) {
        setEnsStatus({
          ...ensStatus,
          loading: true,
        })
        lookup(nft.creator.id);
      }
    }
    return () => {
      cancel = true;
    }
  }, [ensRegistry, ensStatus, lookupAddress, nft.creator.id])

  return (
    <div
      className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-5 cursor-pointer space-y-2"
      onClick={() =>
        navigate('/nft/' + nft.tokenId, {
          state: {
            nft,
          },
        })
      }
    >
      <UserDetail address={nft.creator.id} ensName={ensStatus.name !== "NA" ? ensStatus.name : undefined} caption={mintDateString} />
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
