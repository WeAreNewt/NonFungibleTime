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
  const { lookupAddress, ensRegistry } = useAppDataProvider();
  const [ensStatus, setEnsStatus] = useState<EnsState>({
    loading: false,
    name: undefined,
  });
  const navigate = useNavigate();
  const mintDatetime = new Date(nft.mintTimestamp * 1000);
  const mintDateString = mintDatetime.toLocaleString('en-us', { dateStyle: 'medium' });

  // Use name in ensRegistry hashmap, or lookupAddress if not found
  useEffect(() => {
    let cancel = true;
    const lookup = async (address: string) => {
      const name = await lookupAddress(address);
      if (cancel) return;
      setEnsStatus({
        loading: false,
        name,
      });
    };
    // Only fetch if name has not been set and is not currently loading
    if (!ensStatus.name && !ensStatus.loading) {
      if (ensRegistry[nft.creator.id]) {
        setEnsStatus({
          loading: false,
          name: ensRegistry[nft.creator.id],
        });
      } else {
        setEnsStatus({
          ...ensStatus,
          loading: true,
        });
        lookup(nft.creator.id);
      }
    }
    return () => {
      cancel = true;
    };
  }, [ensRegistry, ensStatus, lookupAddress, nft.creator.id]);

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
      <UserDetail
        address={nft.creator.id}
        ensName={ensStatus.name !== nft.creator.id ? ensStatus.name : undefined}
        caption={mintDateString}
      />
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
      {nft.forSale ? (
        <PriceDisplay amount={nft.price} token={nft.currency} />
      ) : (
        <div className=" dark:text-white text-lg leading-7 font-semibold text-gray-900">
          Not for sale
        </div>
      )}
    </div>
  );
}
