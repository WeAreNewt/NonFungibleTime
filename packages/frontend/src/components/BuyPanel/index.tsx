import { useWeb3React } from "@web3-react/core";
import { FieldLabel } from "../FieldLabel";
import { PriceDisplay } from '../../components/PriceDisplay';
import { BuyTokenParamsType } from "../../lib/helpers/NftCollection";
import { NFT } from "../../types";
import { BigNumber } from "ethers";
import { useState } from "react";
import { useAppDataProvider } from "../../lib/providers/app-data-provider";
import { TxStatus } from '../../modules/NFTDetails/index'

interface BuyPanelParams {
    nft: NFT;
    setTxStatus: (arg0: TxStatus) => void;
}

export function BuyPanel({ nft, setTxStatus }: BuyPanelParams) {
    const { library: provider } = useWeb3React();
    const { nftCollectionService, currentAccount } = useAppDataProvider();
    const [formError, setFormError] = useState<string | undefined>()
    // Trigger buy transaction (+ approval if required)
    const buy = async () => {
        if (nft && currentAccount) {
            const input: BuyTokenParamsType = {
                userAddress: currentAccount,
                tokenId: nft.tokenId,
                currency: nft.currency.id,
                price: BigNumber.from(nft.price),
            };
            setFormError(undefined);
            try {
                const txs = await nftCollectionService.buyToken(input);
                const tx = txs[0];
                const extendedTxData = await tx.tx();
                const { from, ...txData } = extendedTxData;
                const signer = provider.getSigner(from);
                const txResponse = await signer.sendTransaction({
                    ...txData,
                    value: txData.value ? BigNumber.from(txData.value) : undefined,
                });
                setTxStatus({ submitted: true, confirmed: false, txHash: undefined, action: 'Buy NFT' });
                const receipt = await txResponse.wait(2);
                setTxStatus({ submitted: false, confirmed: true, txHash: receipt.transactionHash, action: 'Buy NFT' });
            } catch (error) {
                setFormError('Error submitting transaction (check browser console for full error): ' + error);
            }
        };
    }

    return (
        <div>
            <FieldLabel>Price</FieldLabel>
            <PriceDisplay amount={nft.price} token={nft.currency} />
            <div
                className="items-center text-center w-1/2 mx-auto justify-center px-6 py-1 border border-transparent text-base font-semibold rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-2 md:text-lg md:px-8 cursor-pointer"
                onClick={buy}
            >
                Buy Now
            </div>
            <div className="text-red-500 text-center break-words">{formError}</div>
        </div>
    )
}
