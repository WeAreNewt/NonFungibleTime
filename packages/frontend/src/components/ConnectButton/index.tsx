import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { formatEns, formatEthAddress } from '../../lib/helpers/format';
import { useAppDataProvider } from '../../lib/providers/app-data-provider';
import { useViewportProvider } from '../../lib/providers/viewport-provider';
import { useWeb3, isMetamask } from '../../lib/providers/web3-provider';
import ConnectModal from '../ConnectModal';
import Davatar from '@davatar/react';

export default function AddressInfo() {
  const { account, isCorrectChain, requestToSwitchChain } = useWeb3();
  const { ensName, disconnectWallet } = useAppDataProvider();
  const [isOpen, setIsOpen] = useState(false);
  const [activeProfile, setActiveProfile] = useState<string>('');
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const navigate = useNavigate();
  const { width } = useViewportProvider();
  const location = useLocation();

  useEffect(() => {
    if (account) {
      // If account changes while viewing your own profile, change to the new accounts profile
      if (account !== activeProfile) {
        setActiveProfile(account);
        navigate('/profile/' + account);
      }
      if (location.pathname === '/profile/mint/') {
        // Bring user directly to mint modal if /mint flag is added to url
        navigate('/profile/' + (ensName && ensName !== 'NA' ? ensName : account) + '/mint/');
      } else if (location.pathname === '/profile/' + account || location.pathname === '/profile/') {
        // Switch profile url to include ensName if applicable
        navigate('/profile/' + (ensName && ensName !== 'NA' ? ensName : account));
      }
    }
  }, [account, activeProfile, ensName, location.pathname, navigate]);

  // Cutoff for mobile abbreviated text
  const threshold = 620;

  const onClickModalOpen = () => {
    if (account) {
      if (isMetamask() && !isCorrectChain) requestToSwitchChain();
      else setIsOpen(!isOpen);
    } else setConnectModalOpen(true);
  };

  return (
    <div>
      <ConnectModal open={connectModalOpen} setOpen={setConnectModalOpen} />
      <button
        onClick={onClickModalOpen}
        className="w-full flex items-center justify-center px-6 py-1 border border-transparent text-base font-semibold rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-2 md:text-lg md:px-8 cursor-pointer"
      >
        {account ? (
          isCorrectChain ? (
            <div className="flex items-center space-x-2">
              <Davatar address={account.toLowerCase()} size={25} generatedAvatarType="blockies" />
              <div>
                {ensName && ensName !== 'NA'
                  ? formatEns(ensName, 15)
                  : formatEthAddress(account.toLowerCase())}
              </div>
            </div>
          ) : (
            'Wrong Network'
          )
        ) : width < threshold ? (
          'Connect'
        ) : (
          'Connect Wallet'
        )}
      </button>
      {isOpen && (
        <button
          className="absolute top-100 w-full flex items-center justify-center px-6 py-1 border text-base font-semibold rounded-md  hover:bg-slate-200 md:py-2 md:text-lg md:px-8 border-1 border-black bg-white text-black cursor-pointer"
          onClick={() => {
            disconnectWallet();
            setIsOpen(false);
          }}
        >
          Disconnect
        </button>
      )}
    </div>
  );
}
