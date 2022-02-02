import React from 'react'
import { Link } from 'react-router-dom'
import { useAppDataProvider } from '../../lib/providers/app-data-provider'
import LandingPageClock from '../../images/LandingPageClock.jpg';

export const Home = () => {
    const { currentAccount } = useAppDataProvider();
    return (
        <div className="flex justify-between">
            <div className="w-1/2 flex flex-col p-5">
                <div>
                    <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                        <div className="sm:text-center lg:text-left">
                            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                                <span className="block xl:inline">Earn money</span>
                                <span className="block text-indigo-600">on your time</span>
                            </h1>
                            <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                <div className="rounded-md shadow">
                                    <Link to={'/profile/' + currentAccount} className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                                        Mint Time NFT
                                    </Link>
                                </div>
                                <div className="mt-3 sm:mt-0 sm:ml-3">
                                    <Link to={'/marketplace'} className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10">
                                        Explore Marketplace
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </main>

                </div>
            </div >
            <div className="w-1/2">
                <img className="w-full object-cover" src={LandingPageClock} alt="landing page clock" />
            </div>
        </div >
    )
}
