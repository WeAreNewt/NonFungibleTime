import { useQuery } from '@apollo/client';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import useInView from 'react-cool-inview';
import ClockSpinner from '../../images/clock-loader.webp';
import CategoryFilter, { ListOption } from '../../components/CategoryFilter';
import NFTCard from '../../components/NFTCard';
import { NFTGrid } from '../../components/NFTGrid';
import { NftsDocument, Nft_Filter, Nft_OrderBy, OrderDirection } from '../../lib/graphql/index';
import { NFT } from '../../types';
import { useAppDataProvider } from '../../lib/providers/app-data-provider';
import { ZERO_ADDRESS } from '../../lib/helpers/constants';
import { isAddress } from 'ethers/lib/utils';
import ToggleFilter, { ToggleState } from '../../components/ToggleFilter';
import SearchFilter, { Search } from '../../components/SearchFilter';
import { FieldLabel } from '../../components/FieldLabel';
import { Listbox, Transition } from '@headlessui/react';
import { SelectorIcon } from '@heroicons/react/solid';

const PAGE_SIZE = 12;

interface FormFilter {
  category: string;
  forSale: string;
  redeemed: string;
  searchType: Search;
  active: string;
}

const defaultFilter: FormFilter = { category: 'Show All', forSale: ToggleState.Yes, redeemed: ToggleState.All, searchType: Search.Owner, active: "" }


export default function Marketplace() {
  const { currentAccount } = useAppDataProvider();
  const allowedBuyers = [ZERO_ADDRESS];
  if (currentAccount) {
    allowedBuyers.push(currentAccount.toLowerCase())
  }
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [filters, setFilters] = useState<FormFilter>(defaultFilter);
  const [searchValue, setSearchValue] = useState<string>('')
  const [searchError, setSearchError] = useState<string | undefined>(undefined)

  const { category, forSale, redeemed } = filters;

  // Generate subgraph query filter from form selections
  const whereArg = useMemo<Nft_Filter>(() => {
    const newFilter: Nft_Filter = {
      category: filters.category !== 'Show All' ? filters.category : undefined,
      forSale: filters.forSale === ToggleState.Yes ? true : filters.forSale === ToggleState.No ? false : undefined,
      redeemed: filters.redeemed === ToggleState.Yes ? true : filters.redeemed === ToggleState.No ? false : undefined,
      owner: filters.searchType === Search.Owner && filters.active ? filters.active : undefined,
      creator: filters.searchType === Search.Creator && filters.active ? filters.active : undefined,
    }
    return (newFilter);
  }, [filters])

  const { data, loading, fetchMore, refetch } = useQuery(NftsDocument, {
    variables: {
      first: PAGE_SIZE,
      where: whereArg,
      orderBy: Nft_OrderBy.MintTimestamp,
      orderDirection: OrderDirection.Desc,
    },
  });

  // When filters resets, change this to true
  // so it can recalculate if should paginate or not
  useEffect(() => {
    setCanLoadMore(true);
    refetch()
  }, [whereArg, refetch]);

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
          <div className="w-1/3 justify-items-start">
            <div className="items-center text-gray-900 dark:text-white text-4xl font-extrabold">
              Explore marketplace
            </div>
          </div>
          <div className="w-2/3 justify-items-end">
            <div className="flex flex-row w-full justify-around">
              <div className="w-full p-2">
                <FieldLabel>Category</FieldLabel>
                <CategoryFilter onSelect={(category) => {
                  setFilters({ ...filters, category });
                }} selected={category} />
              </div>

              <div className="w-2/3 p-2">
                <FieldLabel>For Sale</FieldLabel>
                <ToggleFilter onSelect={(forSale) => {
                  setFilters({ ...filters, forSale });
                }} selected={forSale} />
              </div>
              <div className="w-2/3 p-2">
                <FieldLabel>Redeemed</FieldLabel>
                <ToggleFilter onSelect={(redeemed) => {
                  setFilters({ ...filters, redeemed });
                }} selected={redeemed} />
              </div>
              <div className="w-full p-2">
                <FieldLabel>Search</FieldLabel>
                <SearchFilter
                  onChange={(searchValue) => {
                    setSearchValue(searchValue)
                    if (isAddress(searchValue)) {
                      setFilters({ ...filters, active: searchValue.toLowerCase() })
                      setSearchError(undefined)
                    } else {
                      searchValue.length > 0 ? setSearchError('Not a valid ethereum address') : setSearchError(undefined)
                      setFilters({ ...filters, active: '' })
                    }
                  }} selected={searchValue} searchType={filters.searchType}
                  error={searchError ? searchError : undefined}
                />
              </div>
              <div className="w-2/3 p-2">
                <FieldLabel>Search For</FieldLabel>
                <Listbox value={filters.searchType} onChange={(searchType) => {
                  setFilters({ ...filters, searchType });
                }}>
                  <div className="relative mt-1">
                    <Listbox.Button className="relative border border-gray-300 w-full py-2 px-4  text-left font-medium bg-white rounded-lg  cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
                      <span className="block truncate">{filters.searchType}</span>
                      <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <SelectorIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
                      </span>
                    </Listbox.Button>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {
                          Object.keys(Search).map((search, index) => {
                            return (
                              <ListOption key={index} value={search} label={search} />
                            )
                          })}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
              </div>
            </div>
          </div>

        </div>
        <div className="flex-auto h-10 text-sm text-slate-500">
			A quick way to find the right talent for any project
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
    </div >
  );
}
