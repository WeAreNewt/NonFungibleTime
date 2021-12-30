import React, { useState } from 'react';

export default function AddressInfo() {

    // TO-DO: Move to libs
    const [currentAccount, setCurrentAccount] = useState<string>('');

    return (
        <div onClick={() => setCurrentAccount(currentAccount === '' ? '0x' : '')}>
            {currentAccount ? <div>Connected</div> : <div>Connect Wallet</div>}
        </div>
    );
}
