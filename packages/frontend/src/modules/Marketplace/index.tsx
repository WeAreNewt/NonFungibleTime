import { useQuery } from '@apollo/client';
import React, { useEffect, useMemo, useState } from 'react';
import useInView from 'react-cool-inview';
import ClockSpinner from '../../images/clock-loader.webp';
import CategoryFilter from '../../components/CategoryFilter';
import NFTCard from '../../components/NFTCard';
import { NFTGrid } from '../../components/NFTGrid';
import { NftsDocument, Nft_Filter, Nft_OrderBy, OrderDirection } from '../../lib/graphql/index';
import { NFT } from '../../types';
import { Switch } from '@headlessui/react';

const PAGE_SIZE = 12;

interface filters  {
category: string;
forSale: boolean;
redeemed: boolean
}

const defaultFilter = {category: 'Show All', forSale: true, redeemed: true}


export default function Marketplace() {
 
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [filters, setFilters] = useState<filters>(defaultFilter);
  const {category, forSale, redeemed} = filters;
  const whereArg = useMemo<Nft_Filter | undefined>(() => {
    if (category === 'Show All') return {owner_not: "0x0000000000000000000000000000000000000000",forSale,redeemed} as Nft_Filter
    
    return {
      owner_not: "0x0000000000000000000000000000000000000000",category,forSale,redeemed
    };
  }, [category,forSale,redeemed]);

  const { data, loading, fetchMore, refetch } = useQuery(NftsDocument, {
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
    refetch()
  }, [category,forSale,redeemed,refetch]);

  
  const nfts: NFT[] = data && data.nfts ? data.nfts : [];
  const [nftsShown, setNftsShown] = useState<NFT[]>(nfts);

  useEffect(() => {
    data && data.nfts ? setNftsShown(data.nfts) : setNftsShown([])
  }, [data]);

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
          <div className="w-full mr-10 md:w-1/3 justify-items-end ">
            <CategoryFilter onSelect={(category) => {setFilters({...filters,category})
             
            }} selected={category} />
          </div>
          <div className="flex mt-2 flex-row md:w-1/3 justify-items-end">
            <p className="mr-4 mt-0.5 ">For sale</p>
              
           <Switch
        checked={forSale}
        onChange={()=> {setFilters({...filters,forSale: !forSale})
        
      }
      }
        className={`${forSale? 'bg-indigo-900' : 'bg-indigo-700'}
          relative inline-flex flex-shrink-0 h-[30px] w-[66px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
      >
        <span
          aria-hidden="true"
          className={`${forSale ? 'translate-x-9' : 'translate-x-0'}
            pointer-events-none inline-block h-[26px] w-[26px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
        />
      </Switch>

          </div>
      <div className="flex mt-2 flex-row md:w-1/3 justify-items-end">
            <p className="mr-4 mt-0.5 ">Redeemed </p>
              
           <Switch
        checked={redeemed}
        onChange={()=> {
          setFilters({...filters,redeemed: !redeemed})
         
      }}
        className={`${redeemed? 'bg-indigo-900' : 'bg-indigo-700'}
          relative inline-flex flex-shrink-0 h-[30px] w-[66px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
      >
        <span
          aria-hidden="true"
          className={`${redeemed ? 'translate-x-9' : 'translate-x-0'}
            pointer-events-none inline-block h-[26px] w-[26px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
        />
      </Switch>

          </div>
        </div>
        {loading || !nfts ? (
          <div className="w-1/5 mx-auto p-4 pb-0">
            <img alt="clock spinner" src={ClockSpinner} width={50} height={50} />
          </div>

        ) : (
          <>
            <NFTGrid>
              {nftsShown.map((nft, index) => {
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
