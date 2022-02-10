import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "ethers";
import { useState } from "react";
import { RedeemParamsType } from "../../lib/helpers/NftCollection";
import { useAppDataProvider } from "../../lib/providers/app-data-provider";
import { TxStatus } from "../../modules/NFTDetails";
import { NFT } from "../../types";

interface RedeemPanelParams {
    nft: NFT;
    setTxStatus: (arg0: TxStatus) => void;
}

export function RedeemPanel({ nft, setTxStatus }: RedeemPanelParams) {
    const { library: provider } = useWeb3React();
    const { nftCollectionService } = useAppDataProvider();
    const [formError, setFormError] = useState<string | undefined>(undefined);

    // Trigger redeem transaction
    const redeem = async () => {
        if (nft) {
            const input: RedeemParamsType = { userAddress: nft.owner.id, tokenId: nft.tokenId };
            setFormError(undefined);
            const txs = await nftCollectionService.redeem(input);
            const tx = txs[0];
            const extendedTxData = await tx.tx();
            const { from, ...txData } = extendedTxData;
            const signer = provider.getSigner(from);
            const txResponse = await signer.sendTransaction({
                ...txData,
                value: txData.value ? BigNumber.from(txData.value) : undefined,
            });
            setTxStatus({ submitted: true, confirmed: false, txHash: undefined, action: 'Redeem NFT' });
            const receipt = await txResponse.wait(2);
            setTxStatus({ submitted: false, confirmed: true, txHash: receipt.transactionHash, action: 'Redeem NFT' });
        } else {
            setFormError('No wallet connected');
        }
    };
    return (
        <div className="flex flex-col">
            <div className="font-semibold p-4 text-center">
                This NFT has not yet been redeemed.
            </div>
            <div className="text-center pb-6">
                This is a one time action and cannnot be reversed. Redeeming will modify the on-chain svg. You will still be able to list your redeemed NFT for sale.
            </div>
            <div
                className="w-1/2 mx-auto items-center text-center justify-center px-6 py-1 border border-transparent text-base font-semibold rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-2 md:text-lg md:px-8 cursor-pointer"
                onClick={() => redeem()}
            >
                Redeem
            </div>
            <div className="text-red-500 text-center">{formError}</div>
        </div>
    )
}
