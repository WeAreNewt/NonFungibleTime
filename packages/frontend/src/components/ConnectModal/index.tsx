import { Dialog } from "@headlessui/react";
import { UnsupportedChainIdError } from "@web3-react/core";
import { useState } from "react";
import { PROTOCOL_CHAIN, useWeb3, WalletType } from '../../lib/providers/web3-provider';
import { ChainId } from '../../lib/config';
import { UserRejectedRequestError } from "@web3-react/injected-connector";
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from "../../lib/connectors/WalletConnect";
import { FaRegWindowClose } from 'react-icons/fa';
import { getSupportedWallets } from '../../lib/providers/web3-provider';

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function ConnectModal({ open, setOpen } : Props) {

  const { connect } = useWeb3();

  const [error, setError] = useState<string | undefined>(undefined)

  const onClose = () => {
    setError(undefined)
    setOpen(false)
  }

  const supportedWallets = getSupportedWallets()

  const onWalletClick = (walletType: WalletType) => {
      onClose()
      connect(walletType).then(() => onClose())
      .catch(error => {
        if(error instanceof UnsupportedChainIdError) setError(`Error on connecting wallet: Unsupported chain, supported chains are: ${ChainId[PROTOCOL_CHAIN]}`)
        else if(error instanceof UserRejectedRequestErrorWalletConnect || error instanceof UserRejectedRequestError) setError('Error on conecting wallet: Request rejected')
        else setError('Error on connecting wallet: ' + (error as Error).message)
        setOpen(true)
      });
  }

  interface WalletOptionProps {
    name: string,
    logo: string,
    onClick: () => void
  }

  const WalletOption : React.FC<WalletOptionProps> = ({ name, logo, onClick }) => (
    <button className="border-2 h-20 w-28 flex flex-col items-center p-2 active:ring-indigo-500 active:border-indigo-500 border-gray-300 rounded-md" onClick={onClick}>
      <img className="w-10 mt-auto mb-auto" src={logo} alt={name} />
      <span className="text-sm">{name}</span>
    </button>
  )

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="fixed z-10 inset-0 overflow-y-auto bg-gray-500 bg-opacity-75 transition-opacity flex justify-center items-center"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="rounded-lg bg-white w-[90%] sm:w-[500px] min-h-[300px] p-5 flex flex-col dark:bg-gray-800 dark:text-white">
        <button className="ml-auto" onClick={onClose}>
          <FaRegWindowClose className="hover:text-red-500" />
        </button>
        <h2 className="text-lg leading-6 font-semibold text-gray-900 self-center mt-0 dark:text-white">Connect Your Wallet</h2>
        <div className="flex flex-col sm:flex-row items-center justify-center mt-auto mb-auto gap-5 sm:gap-10">
          {
            supportedWallets.map( wallet => <WalletOption key={wallet.name} name={wallet.name} logo={wallet.icon} onClick={() => onWalletClick(wallet.type)} />)
          }
        </div>
        <div className="text-sm text-gray-700 self-center mt-0 dark:text-white p-4">Don't have an Ethereum wallet? <a href="https://ethereum.org/en/wallets/" target="_blank" rel="noopener noreferrer" className="text-indigo-600">Click Here</a></div>
        {error && <span className="text-sm text-red-500 text-center">{error}</span>}
      </div>
    </Dialog>
  );
}
