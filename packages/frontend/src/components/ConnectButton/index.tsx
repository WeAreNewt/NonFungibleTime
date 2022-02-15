import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { formatEthAddress } from '../../lib/helpers/format';
import { useWeb3 } from '../../lib/providers/web3-provider';
import ConnectModal from '../ConnectModal';

export default function AddressInfo() {
  const { account, isCorrectChain, disconnect } = useWeb3();
  const [isOpen, setIsOpen] = useState(false)
  const [ connectModalOpen, setConnectModalOpen ] = useState(false)
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
  
  const onClickModalOpen = () => {
    if(account) setIsOpen(!isOpen)
    else setConnectModalOpen(true)
  }

  return (
    <div>
      <ConnectModal open={connectModalOpen} onClose={() => setConnectModalOpen(false)} />
      <button onClick={onClickModalOpen} className="w-full flex items-center justify-center px-6 py-1 border border-transparent text-base font-semibold rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-2 md:text-lg md:px-8 cursor-pointer">
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
