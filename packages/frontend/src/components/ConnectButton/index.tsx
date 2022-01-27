import React from 'react';
import { formatEthAddress } from '../../lib/format';
import { useWeb3, WalletType } from '../../modules/Web3';

export default function AddressInfo() {
  const { connect, account } = useWeb3();

  const onConnect = async () => {
    try {
      // For now, defaults to metamask
      await connect(WalletType.Values.injected);
    } catch (err) {
      // TODO: Add error toaster
      alert('Error on connecting wallet: ' + (err as Error).message);
    }
  };

  return (
    <div onClick={onConnect} className="px-4">
      <div className="w-full flex items-center justify-center px-6 py-1 border border-transparent text-base font-semibold rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-2 md:text-lg md:px-8 cursor-pointer">
        {account ? formatEthAddress(account) : 'Connect Wallet'}
      </div>
    </div>
  );
}
