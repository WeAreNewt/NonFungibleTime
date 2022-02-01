import React from 'react';
import { formatEthAddress } from '../../lib/helpers/format';
import { useWeb3, WalletType } from '../../lib/providers/web3-provider';

export default function AddressInfo() {
  const { connect, account, isCorrectChain, active, requestToSwitchChain } = useWeb3();

  const onConnect = async () => {
    try {
      if (active && !isCorrectChain) {
        requestToSwitchChain();
        return;
      }

      // For now, defaults to metamask
      connect(WalletType.Values.injected);
    } catch (err) {
      // TODO: Add error toaster
      alert('Error on connecting wallet: ' + (err as Error).message);
    }
  };

  return (
    <div onClick={onConnect} className="px-4">
      <div className="w-full flex items-center justify-center px-6 py-1 border border-transparent text-base font-semibold rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-2 md:text-lg md:px-8 cursor-pointer">
        {account
          ? isCorrectChain
            ? formatEthAddress(account)
            : 'Wrong Network'
          : 'Connect Wallet'}
      </div>
    </div>
  );
}
