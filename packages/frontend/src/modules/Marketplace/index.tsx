import { useQuery } from '@apollo/client';
import React, { useEffect, useMemo, useState } from 'react';
import useInView from 'react-cool-inview';
import ClockSpinner from '../../images/clock-loader.webp';
import CategoryFilter from '../../components/CategoryFilter';
import NFTCard from '../../components/NFTCard';
import { NFTGrid } from '../../components/NFTGrid';
import { NftsDocument, Nft_Filter, Nft_OrderBy, OrderDirection } from '../../lib/graphql/index';
import { NFT } from '../../types';

const PAGE_SIZE = 12;

export default function Marketplace() {
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [category, setCategory] = useState('Show All');
  const whereArg = useMemo<Nft_Filter | undefined>(() => {
    if (category === 'Show All') return undefined;

    return {
      category,
    };
  }, [category]);

  const { data, loading, fetchMore } = useQuery(NftsDocument, {
    variables: {
      first: PAGE_SIZE,
      where: whereArg,
      orderBy: Nft_OrderBy.MintTimestamp,
      orderDirection: OrderDirection.Desc,
    },
  });

  // When category is reset, change this to true,
  // so it can recalculate if should paginate or not
  useEffect(() => {
    setCanLoadMore(true);
  }, [category]);

  const nfts: NFT[] | undefined = data && data.nfts ? data.nfts : [];

  const { observe } = useInView({
    // For better UX, we can grow the root margin so the data will be loaded earlier
    rootMargin: '40px 0px',
    // When the last item comes to the viewport
    onEnter: async ({ unobserve, observe }) => {
      // Pause observe when loading data
      unobserve();
      const result = await fetchMore({
        variables: {
          first: PAGE_SIZE,
          skip: nfts.length || 0,
        },
      });

      // If the results are not matching the page size,
      // it means we reached the end of the pagination.
      const nextItemsCount = result.data.nfts.length;
      if (nextItemsCount !== PAGE_SIZE) {
        setCanLoadMore(false);
      }

      observe();
    },
  });

  return (
    <div className="bg-slate-100 dark:bg-black p-10">
      <div className="flex flex-col max-w-7xl m-auto">
        <div className="flex flex-col gap-4 md:flex-row md:gap-0 justify-between items-center mb-10">
          {/** Marketplace Header */}
          <div className="w-full md:w-2/3 justify-items-start">
            <div className="items-center text-gray-900 dark:text-white text-4xl font-extrabold">
              Explore marketplace
            </div>
          </div>

          <div className="w-full md:w-1/3 justify-items-end ">
            <CategoryFilter onSelect={setCategory} selected={category} />
          </div>
        </div>
        {loading || !nfts ? (
          <div className="w-1/5 mx-auto p-4 pb-0">
            <img alt="clock spinner" src={ClockSpinner} width={50} height={50} />
          </div>

        ) : (
          <>
            <NFTGrid>
              {nfts.map((nft, index) => {
                return <NFTCard key={index} nft={nft} />;
              })}
            </NFTGrid>
            {canLoadMore && (
              <div
                style={{ marginTop: 20, width: '100%', padding: 20 }}
                ref={observe}
              >
                <div className="w-1/5 mx-auto p-4 pb-0">
                  <img alt="clock spinner" src={ClockSpinner} width={50} height={50} />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
