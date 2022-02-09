import { Dialog } from '@headlessui/react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatEthAddress } from '../../lib/helpers/format';
import { useWeb3, WalletType } from '../../lib/providers/web3-provider';

export default function AddressInfo() {
  const { connect, account, isCorrectChain, active, requestToSwitchChain, disconnect } = useWeb3();
  const [isOpen, setIsOpen] = useState(false)
  const onClick = async () => {
    console.log('clickd');
    try {
      if (active) {
        if (!isCorrectChain) {
          requestToSwitchChain();
          return;
        } else {
          console.log('actie');
          setIsOpen(true)
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
    <>
    <Dialog
    as="div"
    open={isOpen}
    className="fixed inset-0 z-10 overflow-y-auto"
    onClose={() => setIsOpen(false)}
  >
    <div className="min-h-screen px-4 text-center">
  
      {/* This element is to trick the browser into centering the modal contents. */}
      <span
        className="inline-block h-screen align-middle"
        aria-hidden="true"
      >
        &#8203;
      </span>
        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <Dialog.Title
            as="h3"
            className="text-lg font-medium leading-6 text-gray-900"
          >
            Are you sure you want to disconnect your wallet?
          </Dialog.Title>
  
          <div className="flex flex-row ml-14 mt-5">

  <div className="basis-1/2">
            <button
              type="button"
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
              onClick={() => { 
                disconnect()
                setIsOpen(false)}}
            >
              Yes
            </button>
            </div>
            <div className="basis-1/2">
            <button
              type="button"
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
              onClick={() => setIsOpen(false)}
            >
              No
            </button>
            </div>
          </div>
        </div>
    </div>
  </Dialog>
    <div onClick={onClick} className="px-4">
      <div className="w-full flex items-center justify-center px-6 py-1 border border-transparent text-base font-semibold rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-2 md:text-lg md:px-8 cursor-pointer">
        {account
          ? isCorrectChain
            ? formatEthAddress(account)
            : 'Wrong Network'
          : 'Connect Wallet'}
      </div>
    </div>
    </>
  );
}
