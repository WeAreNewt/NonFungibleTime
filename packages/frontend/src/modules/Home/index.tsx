import React from 'react';
import { Link } from 'react-router-dom';
import { useAppDataProvider } from '../../lib/providers/app-data-provider';
import LandingPageClock from '../../images/LandingPageClock.png';

export const Home = () => {
  const { currentAccount } = useAppDataProvider();
  return (
    <div className="flex">
      <div className="w-full md:w-1/2 2xl:w-2/3 flex flex-col p-5">
        <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
          <div className="text-center sm:text-left">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl ">
              <span className="block xl:inline">Earn money</span>
              <span className="block text-indigo-600">on your time</span>
            </h1>
            <div>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">Mint your time as NFTs on the Polygon network. Sell your time to interested parties. Purchase other people’s time.</p>
            </div>
            <div className="mt-5 sm:mt-8 sm:flex  sm:justify-center lg:justify-start">
              <div className="rounded-md shadow">
                <Link
                  to={'/profile/' + currentAccount + '/mint/'}
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-sm md:px-5 lg:text-lg"
                >
                  Mint Time NFT
                </Link>
              </div>
              <div className="mt-3 sm:mt-0 sm:ml-3">
                <Link
                  to={'/marketplace'}
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-300 md:py-4 md:text-sm lg:text-lg md:px-5"
                >
                  Explore Marketplace
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>

      <div
        className="w-1/2 hidden md:block  h-full"
        style={{
          backgroundImage: `url(${LandingPageClock})`,
          // To keep the clock in the center, subtract 80px (size of the navbar)
          height: 'calc(100vh - 81px)',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      ></div>
    </div>
  );
};
