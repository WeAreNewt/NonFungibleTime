import React from 'react';
import discord from '../../images/discord-logo.png';
import twitter from '../../images/twitter-logo.png';
import github from '../../images/github-logo.png';
import etherscan from '../../images/etherscan-logo.png';
import { useAppDataProvider } from '../../lib/providers/app-data-provider';
import { Link } from 'react-router-dom';

interface FooterLink {
  title: string;
  to: string;
  icon?: string;
  alt?: string;
}

const textLinks: FooterLink[] = [
  {
    title: 'About',
    to: 'https://wearenewt.xyz/roadmap/non-fungible-time',
  },
  {
    title: 'Privacy Policy',
    to: '/privacy-policy',
  },
  {
    title: 'Terms & Conditions',
    to: '/terms-and-conditions',
  },
  {
    title: 'Report bugs',
    to: 'https://discord.com/channels/909763209056112651/922568003311243324',
  },
  {
    title: 'Request features',
    to: 'https://discord.com/channels/909763209056112651/913088754418348072',
  },
];

export default function Footer() {
  const { networkConfig } = useAppDataProvider();
  const logoLinks: FooterLink[] = [
    {
      title: 'Discord',
      to: 'https://discord.gg/newt',
      icon: discord,
      alt: 'Discord',
    },
    {
      title: 'Twitter',
      to: 'https://twitter.com/wearenewt',
      icon: twitter,
      alt: 'Twitter',
    },
    {
      title: 'Github',
      to: 'https://github.com/WeAreNewt/NonFungibleTime',
      icon: github,
      alt: 'Github',
    },
    {
      title: 'Etherscan',
      to: networkConfig.blockExplorer + '/address/' + networkConfig.collectionAddress,
      icon: etherscan,
      alt: 'Etherscan',
    },
  ];

  return (
    <footer className="w-full text-white bg-gray-800 dark:bg-gray-900">
      <div className="flex flex-col lg:flex-row p-2 lg:px-20 md:py-6">
        <section className="flex items-center justify-center lg:justify-start w-full lg:w-3/4 h-full">
          <ul className="flex flex-col sm:flex-row sm:space-x-8 lg:space-x-10 items-center">
            {textLinks.map((link) => {
              const outerLink = link.to.substring(0, 5) === 'https'
              return outerLink ? 
              (
                <li key={link.title}>
                  <a
                    className="hover:text-slate-300"
                    href={link.to}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.title}
                  </a>
                </li>
              ) :
              (
                <li key={link.title}>
                  <Link 
                    to={link.to}
                    title={link.title}
                    className="hover:text-slate-300"
                  >
                    {link.title}
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
        <section className="flex flex-row items-center justify-center lg:justify-end space-x-10 w-full lg:w-1/4 h-full mt-3 lg:mt-0">
          {logoLinks.map((logo) => {
            return (
              <a href={logo.to} key={logo.to} target="_blank" rel="noopener noreferrer">
                <img
                  className="min-w-[30px] w-[30px]"
                  key={logo.alt}
                  src={logo.icon}
                  alt={logo.alt}
                />
              </a>
            );
          })}
        </section>
      </div>
    </footer>
  );
}
