import React, { useState } from 'react';

export default function AddressInfo() {

    // TO-DO: Move to libs
    const [currentAccount, setCurrentAccount] = useState<string>('');

    return (
        <div onClick={() => setCurrentAccount(currentAccount === '' ? '0x' : '')} className="px-4">
            <div className="w-full flex items-center justify-center px-6 py-1 border border-transparent text-base font-semibold rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-2 md:text-lg md:px-8 cursor-pointer">
                {currentAccount ?
                    "Connected" : "Connect Wallet"}
            </div>
        </div>
    );
}
