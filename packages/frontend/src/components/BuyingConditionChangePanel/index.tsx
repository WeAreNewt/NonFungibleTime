import { useWeb3React } from "@web3-react/core";
import classNames from "classnames";
import { BigNumber } from "ethers";
import { formatUnits, isAddress, parseUnits } from "ethers/lib/utils";
import { useEffect, useState } from "react";
import { PaymentToken } from "../../lib/graphql";
import { MaxUint256, ZERO_ADDRESS } from "../../lib/helpers/constants";
import { ChangeBuyingConditionsParamsType } from "../../lib/helpers/NftCollection";
import { useAppDataProvider } from "../../lib/providers/app-data-provider";
import { TxStatus } from "../../modules/NFTDetails";
import { NFT } from "../../types";
import { Input, Select } from "../Forms";

interface BuyingConditionChangePanelProps {
    nft: NFT;
    setTxStatus: (arg0: TxStatus) => void;
}

interface BuyingConditions {
    forSale: boolean;
    price: number;
    token: PaymentToken;
    reservedBuyer: string;
}

export function BuyingConditionChangePanel({ nft, setTxStatus }: BuyingConditionChangePanelProps) {
    const { library: provider } = useWeb3React();
    const { currentAccount, nftCollectionService, availablePaymentTokens } = useAppDataProvider();
    // TO-DO: Condense like MintModal
    const [formError, setFormError] = useState<string | undefined>(undefined);
    const [mainTxError, setMainTxError] = useState<string | undefined>(undefined);
    const [reservedBuyer, setreservedBuyer] = useState<boolean>(true);
    const [buyingConditions, setBuyingConditions] = useState<BuyingConditions>({
        forSale: nft.forSale,
        price: Number(formatUnits(nft.price.toString(), nft.currency.decimals)),
        token: {
            ...nft.currency
        },
        reservedBuyer: nft.allowedBuyer,
    })

    useEffect(() => {
        // All of these fields will come from nft once fetching from subgraph
        setBuyingConditions({
            forSale: nft.forSale,
            price: Number(formatUnits(nft.price.toString(), nft.currency.decimals)),
            token: {
                ...nft.currency
            },
            reservedBuyer: nft.allowedBuyer,
        });
    }, [nft])

    // Trigger changeBuyingConditions transaction
    const changeBuyingConditions = async () => {
        if (nft && currentAccount && buyingConditions) {
            if (isAddress(buyingConditions.reservedBuyer)) {
                const formattedPrice = parseUnits(
                    buyingConditions.price.toString(),
                    buyingConditions.token.decimals
                );
                const input: ChangeBuyingConditionsParamsType = {
                    userAddress: currentAccount,
                    tokenId: nft.tokenId,
                    currency: buyingConditions.token.id,
                    price: formattedPrice,
                    allowedBuyer: buyingConditions.reservedBuyer,
                    forSale: buyingConditions.forSale,
                };
                setFormError(undefined);
                try {
                    const txs = await nftCollectionService.changeBuyingConditions(input);
                    const tx = txs[0];
                    const extendedTxData = await tx.tx();
                    const { from, ...txData } = extendedTxData;
                    const signer = provider.getSigner(from);
                    const txResponse = await signer.sendTransaction({
                        ...txData,
                        value: txData.value ? BigNumber.from(txData.value) : undefined,
                    });
                    setTxStatus({ submitted: true, confirmed: false, txHash: undefined, action: 'Change Listing Conditions' });
                    const receipt = await txResponse.wait(2);
                    setTxStatus({ submitted: false, confirmed: true, txHash: receipt.transactionHash, action: 'Change Listing Conditions' });
                } catch (error) {
                    setMainTxError('Error submitting transaction (check browser console for full error): ' + error);
                }
            } else {
                setFormError('Reserved buyer must be valid ethereum address');
            }
        } else {
            setMainTxError('No wallet connected');
        }
    };


    return (
        <div className="flex flex-col">
            {/** For sale toggle */}
            <label className="relative flex justify-between items-center p-2 text-xl">
                For Sale
                <div
                    className={classNames("md:w-14 md:h-7 w-12 h-6 flex items-center rounded-full p-1 cursor-pointer", { "bg-gray-300": !buyingConditions.forSale }, { "bg-indigo-500": buyingConditions.forSale })}
                    onClick={() => {
                        setBuyingConditions({
                            ...buyingConditions,
                            forSale: !buyingConditions.forSale
                        })
                    }}
                >
                    <div
                        className={
                            classNames('bg-white md:w-6 md:h-6 h-5 w-5 rounded-full shadow-md transform', { 'transform translate-x-6': buyingConditions.forSale })
                        }
                    />
                </div>
            </label>
            {buyingConditions.forSale && <div>
                <label className="relative flex justify-between items-center p-2 text-xl">
                    Reserve for buyer
                    <div
                        className={classNames("md:w-14 md:h-7 w-12 h-6 flex items-center rounded-full p-1 cursor-pointer", { "bg-gray-300": !reservedBuyer }, { "bg-indigo-500": reservedBuyer })}
                        onClick={() => {
                            setreservedBuyer(!reservedBuyer)
                            setBuyingConditions({
                                ...buyingConditions,
                                reservedBuyer: reservedBuyer ? buyingConditions.reservedBuyer : ZERO_ADDRESS,
                            })
                        }}
                    >
                        <div
                            className={
                                classNames('bg-white md:w-6 md:h-6 h-5 w-5 rounded-full shadow-md transform', { 'transform translate-x-6': reservedBuyer })
                            }
                        />
                    </div>
                </label>
                {
                    reservedBuyer && <div><div className="w-full p-2">
                        <Input
                            type="text"
                            name="reservedBuyer"
                            id="reservedBuyer"
                            placeholder={"Address"}
                            value={buyingConditions.reservedBuyer}
                            min={0}
                            className='text-black w-full'
                            onChange={(e) => {
                                setBuyingConditions({ ...buyingConditions, reservedBuyer: e.target.value })
                            }
                            }
                        />
                    </div>
                        <div className="text-red-500 text-center">{formError}</div>
                    </div>
                }


                {/** Price and currency */}
                <div className="flex gap-4 p-2 pb-6">
                    <div className="w-1/2">
                        <div className="font-semibold">Price</div>
                        <Input
                            type="number"
                            name="price"
                            id="price"
                            placeholder=""
                            value={buyingConditions.price.toString()}
                            min={0}
                            className='text-black'
                            onChange={(e) => {
                                const price = Number(e.target.value)
                                let priceRestricted = price > 0 ? price : 0;
                                priceRestricted = priceRestricted < MaxUint256 ? priceRestricted : MaxUint256;
                                setBuyingConditions({ ...buyingConditions, price: priceRestricted })
                            }
                            }
                        />
                    </div>

                    <div className="w-1/2">
                        <div className="font-semibold">Token</div>
                        <Select
                            id="acceptedCurrencies"
                            name="acceptedCurrencies"
                            className="text-black w-full"
                            value={buyingConditions.token.symbol}
                            onChange={(e) => {
                                setBuyingConditions({
                                    ...buyingConditions,
                                    token: availablePaymentTokens[e.target.value]
                                });
                            }}
                        >
                            {Object.entries(availablePaymentTokens).map((token) => (
                                <option key={token[1].id}>{token[0]}</option>
                            ))}
                        </Select>
                    </div>
                </div>
            </div>
            }

            <div
                className="items-center text-center w-1/2 mx-auto justify-center px-6 py-1 border border-transparent text-base font-semibold rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-2 md:text-lg md:px-8 cursor-pointer"
                onClick={() => changeBuyingConditions()}
            >
                Update
            </div>
            {mainTxError && <div className="text-red-500 text-center break-words">{mainTxError}</div>}
        </div>
    )
}
