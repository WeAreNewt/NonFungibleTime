import React from 'react';
import { Link } from 'react-router-dom';
import AddressInfo from '../AddressInfo';

interface Navigation {
    link: string;
    title: string;
}

export default function Menu() {

    // Navbar Links
    const navigation: Navigation[] = [
        {
            link: '/profile',
            title: 'Profile',
        },
        {
            link: '/marketplace',
            title: 'Marketplace',
        },
        {
            link: 'https://discord.gg/newt',
            title: 'Discord',
        },
        {
            link: 'https://github.com/wearenewt/tokenized-time',
            title: 'Code'
        }
    ];


    return (
        <nav>
            <div className="mx-auto border-b-2 border-gray-200 flex justify-between items-center">
                <div className="pl-8 items-center">
                    <Link to="/" >
                        <div className="text-4xl mx-auto">⏰</div>
                    </Link>
                </div>



                <ul className="flex pr-8 space-x-7 items-center">
                    {navigation.map((link, index) => {
                        return (
                            <li
                                className="text-lg text-black cursor-pointer"
                                key={index}
                            >
                                {link.link.substring(0, 5) === 'https' ? <a href={link.link}>{link.title}</a> : <Link
                                    to={link.link}
                                    title={link.title}
                                >{link.title}</Link>}

                            </li>
                        )
                    })}
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 m-9 border border-blue-700 rounded">
                        {/**   <MarketSwitcher /> */}
                        <AddressInfo />
                    </button>
                </ul>




            </div>

        </nav>
    );
}
