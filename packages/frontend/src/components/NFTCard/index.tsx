import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NFTProps } from '../../types';


export default function NFTCard({ address, name, avatar, category, title, description, cost, currencyAddress, currencySymbol, tokenId, owner, tokenURI, creator, availabilityTo, availablilityFrom, duration, royaltyPercentage }: NFTProps) {
    const navigate = useNavigate()
    return (
        <div className="border p-3 cursor-pointer" onClick={() => navigate('/details/' + tokenId, {
            state: {
                nft: {
                    address,
                    name,
                    avatar,
                    category,
                    title,
                    description,
                    cost,
                    currencyAddress,
                    currencySymbol,
                    tokenId,
                    owner,
                    tokenURI,
                    creator,
                    availabilityTo,
                    availablilityFrom,
                    duration,
                    royaltyPercentage,
                }
            }
        })}>
            {/** Seller name/address + avatar */}
            <div className="text-black dark:text-white" > {name}</div >
            {/** Tag */}
            <div className="text-black dark:text-white" > {category}</div  >
            {/** NFT Description */}
            < div className="text-black dark:text-white" > {title}</ div >
            <div className="text-black dark:text-white">{description}</div>
            {/** Pricing */}
            <div className="text-black dark:text-white">{cost.toString() + ' ' + currencySymbol}</div>
        </div >
    );
}
