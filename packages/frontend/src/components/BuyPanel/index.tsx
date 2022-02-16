import { useWeb3React } from "@web3-react/core";
import { FieldLabel } from "../FieldLabel";
import { PriceDisplay } from '../../components/PriceDisplay';
import { BuyTokenParamsType } from "../../lib/helpers/NftCollection";
import { NFT } from "../../types";
import { BigNumber } from "ethers";
import { useEffect, useState } from "react";
import { useAppDataProvider } from "../../lib/providers/app-data-provider";
import { TxStatus } from '../../modules/NFTDetails/index'
import { ZERO_ADDRESS } from "../../lib/helpers/constants";
import { EthereumTransactionTypeExtended } from "../../lib/helpers/base-service";
import { ERC20Service } from "../../lib/helpers/ERC20";
import { formatUnits } from "ethers/lib/utils";
import ClockSpinner from '../../images/clock-loader.webp';

interface BuyPanelParams {
    nft: NFT;
    setTxStatus: (arg0: TxStatus) => void;
}



export function BuyPanel({ nft, setTxStatus }: BuyPanelParams) {
    const { library: provider } = useWeb3React();
    const { nftCollectionService, currentAccount, jsonRpcProvider } = useAppDataProvider();
    const [formError, setFormError] = useState<string | undefined>()
    const [approved, setApproved] = useState<boolean>(true);
    const [balance, setBalance] = useState<number | undefined>(undefined);
    const [transaction, setTransaction] = useState<EthereumTransactionTypeExtended | undefined>(undefined);

    // Trigger buy or approval transaction
    const buy = async () => {
        if (transaction) {
            setFormError(undefined);
            try {
                const extendedTxData = await transaction.tx();
                const { from, ...txData } = extendedTxData;
                const signer = provider.getSigner(from);
                const txResponse = await signer.sendTransaction({
                    ...txData,
                    value: txData.value ? BigNumber.from(txData.value) : undefined,
                });
                setTxStatus({ submitted: true, confirmed: false, txHash: undefined, action: approved ? 'Buy NFT' : 'Approve ' + nft.currency.symbol });
                const receipt = await txResponse.wait(1);
                setTxStatus({ submitted: false, confirmed: true, txHash: receipt.transactionHash, action: approved ? 'Buy NFT' : 'Approve ' + nft.currency.symbol });
                if (!approved) {
                    setApproved(true);
                }
            } catch (error) {
                setFormError('Error submitting transaction (check browser console for full error): ' + error);
            }
        };
    }


    // Update wallet balances and transaction data on User or NFT change
    useEffect(() => {
        const fetchWalletBalance = async () => {
            if (nft && currentAccount) {
                const erc20Service = new ERC20Service(
                    jsonRpcProvider,
                );
                let balance = 0;
                if (nft.currency.id === ZERO_ADDRESS) {
                    const bnBalance = await jsonRpcProvider.getBalance(currentAccount);
                    balance = Number(formatUnits(bnBalance, nft.currency.decimals));
                } else {
                    balance = await erc20Service.balanceOf({ token: nft.currency.id, user: currentAccount });
                }
                setBalance(balance);
            }
        }

        const fetchTransactionData = async () => {
            if (nft && currentAccount) {
                const input: BuyTokenParamsType = {
                    userAddress: currentAccount,
                    tokenId: nft.tokenId,
                    currency: nft.currency.id,
                    price: BigNumber.from(nft.price),
                }
                const txs = await nftCollectionService.buyToken(input);
                const tx = txs[0];
                if (tx.txType === "COLLECTION_ACTION") {
                    setApproved(true);
                } else {
                    setApproved(false);
                }
                setTransaction(tx);
            }
        }
        fetchWalletBalance();
        fetchTransactionData();
    }, [currentAccount, nft, nftCollectionService, approved, jsonRpcProvider])
    const formattedPrice = Number(formatUnits(nft.price, nft.currency.decimals));

    // Loading wallet balance or transaction data
    if (!transaction || balance === undefined) {
        return (
            <div className="w-1/5 mx-auto p-4 pb-0">
                <img alt="clock spinner" src={ClockSpinner} width={50} height={50} className="mx-auto" />
            </div>
        )
    } else {
        return (
            <div>
                <div className="flex flex-row justify-between">
                    <div className="inline">
                        <FieldLabel>Price</FieldLabel>
                        <PriceDisplay amount={nft.price} token={nft.currency} />
                    </div>
                    {balance > formattedPrice ? <div
                        className="items-center text-center w-1/3 justify-center border border-transparent text-base font-semibold rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-2 md:text-lg md:px-8 cursor-pointer"
                        onClick={buy}
                    >
                        {approved ? 'Buy Now' : 'Approve'}
                    </div> : <div className="text-red-500 my-auto">Insufficient wallet balance: {balance.toFixed(2)}</div>}
                </div>
                <div className="text-red-500 text-center break-words">{formError}</div>
            </div >
        )
    }
}
