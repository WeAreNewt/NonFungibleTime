import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ConnectButton from '../ConnectButton';
import icon from '../../images/icon.png';
import { useLocation } from 'react-router-dom';
import Toggle from '../../ThemeToggle';
import { useAppDataProvider } from '../../lib/providers/app-data-provider';

interface Navigation {
  link: string;
  title: string;
}

export default function Navbar() {
  const { currentAccount } = useAppDataProvider();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const activePage = location.pathname.split('/')[1];

  // Navbar Links
  const navigation: Navigation[] = [
    {
      link: '/profile/' + (currentAccount ? currentAccount : ''),
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
      link: 'https://github.com/wearenewt/NonFungibleTime',
      title: 'GitHub',
    },
  ];

  return (
    <nav>
      <div className="max-w-8xl mx-auto px-1 sm:px-6 lg:px-12 light:border-b light:border-color-gray-500 bg-white dark:bg-gray-900">
        <div className="relative flex items-center justify-between h-20">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/** Mobile Menu Icon */}
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {/** Closed Menu Icon */}
              <svg
                className={menuOpen ? 'hidden h-6 w-6' : 'block h-6 w-6'}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/** Open Menu Icon */}
              <svg
                className={menuOpen ? 'block h-6 w-6' : 'hidden h-6 w-6'}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            {/** Clock Icon */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/">
                <img src={icon} alt="clock icon" width="50" height="50" />
              </Link>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/** Menu Items */}
            <div className="hidden sm:block sm:ml-6">
              <div className="flex space-x-5">
                {navigation.map((link, index) => {
                  return (
                    <div key={index}>
                      {link.link.substring(0, 5) === 'https' ? (
                        <a
                          href={link.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={
                            'text-gray-500 dark:text-white px-3 py-2 hover:underline decoration-indigo-600 decoration-4 underline-offset-8 rounded-md text-lg font-semibold'
                          }
                          aria-current={undefined}
                        >
                          {link.title}
                        </a>
                      ) : (
                        <Link
                          to={link.link}
                          title={link.title}
                          className={
                            activePage === link.title.toLowerCase()
                              ? 'text-indigo-600 px-3 py-2 rounded-md text-lg font-semibold underline decoration-indigo-600 decoration-4 underline-offset-8'
                              : 'text-gray-500 dark:text-white px-3 py-2 rounded-md text-lg hover:underline decoration-indigo-600 decoration-4 underline-offset-8 font-semibold'
                          }
                          aria-current={
                            activePage === link.title.toLowerCase() ? 'page' : undefined
                          }
                        >
                          {link.title}
                        </Link>
                      )}
                    </div>
                  );
                })}
                <Toggle />
              </div>
            </div>

            {/** Wallet */}
            <div className="ml-3 relative">
              <ConnectButton />
            </div>
          </div>
        </div>
      </div>

      <div className={menuOpen ? 'sm:hidden' : 'hidden'} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navigation.map((link, index) => {
            return (
              <div key={index}>
                {link.link.substring(0, 5) === 'https' ? (
                  <a
                    href={link.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 px-3 py-2 rounded-md text-base font-semibold"
                    aria-current={undefined}
                  >
                    {link.title}
                  </a>
                ) : (
                  <Link
                    to={link.link}
                    title={link.title}
                    className={
                      activePage === link.title.toLowerCase()
                        ? 'text-indigo-600 px-3 py-2 rounded-md text-base font-semibold'
                        : 'text-gray-500 px-3 py-2 rounded-md text-base font-semibold'
                    }
                    aria-current={activePage === link.title.toLowerCase() ? 'page' : undefined}
                  >
                    {link.title}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
