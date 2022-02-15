import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { useWeb3, WalletType } from '../../lib/providers/web3-provider';


interface Props {
  open: boolean
  onClose: () => void
}

export default function ConnectModal({ open, onClose } : Props) {

  const { connect, account, isCorrectChain, active, requestToSwitchChain, disconnect } = useWeb3();

  const onBrowserWalletClick = () => {
    try {
      connect(WalletType.Values.injected);
      onClose()
    } catch (err) {
      // TODO: Add error toaster
      alert('Error on connecting wallet: ' + (err as Error).message);
    }
  }

  const onWalletConnectClick = async () => {
    try {
      await connect(WalletType.Values.walletConnect);
    } catch (err) {
      // TODO: Add error toaster
      alert('Error on connecting wallet: ' + (err as Error).message);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="fixed z-10 inset-0 overflow-y-auto bg-gray-500 bg-opacity-75 transition-opacity flex justify-center items-center"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="rounded-lg bg-white">
        <button onClick={onClose}>X</button>
        <h2>Connect Wallet</h2>
        <button onClick={onBrowserWalletClick}>Metamask</button>
        <button onClick={onWalletConnectClick}>WalletConnect</button>
      </div>
    </Dialog>
  );
}
