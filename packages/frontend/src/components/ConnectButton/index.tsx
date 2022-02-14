import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { formatEthAddress } from '../../lib/helpers/format';
import { useWeb3, WalletType } from '../../lib/providers/web3-provider';

export default function AddressInfo() {
  const { connect, account, isCorrectChain, active, requestToSwitchChain, disconnect } = useWeb3();
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate();
  const location = useLocation();

  // If user connects wallet while on disconnected profile screen, redirect to their profile
  useEffect(() => {
    if (account) {
      if (location.pathname === '/profile/') {
        navigate('/profile/' + account)
      } else if (location.pathname === '/profile/mint/') {
        navigate('/profile/' + account + '/mint/')
      }
    }
  }, [account, location.pathname, navigate])

  const onClick = async () => {
    try {
      if (active) {
        if (!isCorrectChain) {
          requestToSwitchChain();
          return;
        } else {
          setIsOpen(!isOpen)
        }
      } else {
        // For now, defaults to injected provider
        connect(WalletType.Values.injected);
      }
    } catch (err) {
      // TODO: Add error toaster
      alert('Error on connecting wallet: ' + (err as Error).message);
    }
  };
  return (
    <div>
      <button onClick={onClick} className="w-full flex items-center justify-center px-6 py-1 border border-transparent text-base font-semibold rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-2 md:text-lg md:px-8 cursor-pointer">
        {account
          ? isCorrectChain
            ? formatEthAddress(account)
            : 'Wrong Network'
          : 'Connect Wallet'}
      </button>
      {isOpen && <button className="absolute top-100 w-full flex items-center justify-center px-6 py-1 border text-base font-semibold rounded-md  hover:bg-slate-200 md:py-2 md:text-lg md:px-8 border-1 border-black bg-white text-black cursor-pointer" onClick={() => { disconnect(); setIsOpen(false) }}>Disconnect</button>}
    </div>
  );
}
