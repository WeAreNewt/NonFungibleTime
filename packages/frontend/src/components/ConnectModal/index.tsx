import { Dialog } from "@headlessui/react";
import metamaskLogo from '../../images/metamask_logo.svg';
import walletConnectLogo from '../../images/walletconnect_logo.svg';
import { useWeb3, WalletType } from '../../lib/providers/web3-provider';


interface Props {
  open: boolean
  onClose: () => void
}

export default function ConnectModal({ open, onClose } : Props) {

  const { connect, isCorrectChain, requestToSwitchChain, active } = useWeb3();

  const onBrowserWalletClick = () => {
    try {
      if (active) {
        if (!isCorrectChain) {
          requestToSwitchChain();
          return;
        } else {
          onClose()
        }
      } else {
        // For now, defaults to injected provider
        connect(WalletType.Values.injected).then(() => onClose());
      }
    } catch (err) {
      // TODO: Add error toaster
      alert('Error on connecting wallet: ' + (err as Error).message);
    }
  }

  const onWalletConnectClick = () => {
    try {
      connect(WalletType.Values.walletConnect);
      onClose()
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
      <div className="rounded-lg bg-white w-[90%] sm:w-[500px] min-h-[300px] p-2 flex flex-col">
        <button className="ml-auto" onClick={onClose}>X</button>
        <h2 className="text-lg leading-6 font-semibold text-gray-900 self-center">Connect Your Wallet</h2>
        <div className="flex items-center justify-center mt-auto mb-auto gap-10">
          <button className="border-2 h-20 w-28 flex flex-col items-center p-2 active:ring-indigo-500 active:border-indigo-500 border-gray-300 rounded-md" onClick={onBrowserWalletClick}>
            <img className="h-10 mt-auto mb-auto" src={metamaskLogo} alt="metamask" />
            <span className="text-sm">Metamask</span>
          </button>
          <button className="border-2 h-20 w-28 flex flex-col justify-end items-center p-2 active:ring-indigo-500 active:border-indigo-500 border-gray-300 rounded-md" onClick={onWalletConnectClick}>
            <img className="w-10 mt-auto mb-auto" src={walletConnectLogo} alt="walletconnect" />
            <span className="text-sm">WalletConnect</span>
          </button>
        </div>
      </div>
    </Dialog>
  );
}
