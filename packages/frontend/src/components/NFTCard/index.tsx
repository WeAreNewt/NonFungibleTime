import React from 'react';
import { NFTProps } from '../../types';


export default function NFTCard({ address, name, avatar, date, category, title, description, cost, currencyAddress, currencySymbol }: NFTProps) {

    return (
        <div className="border p-3">
            {/** Seller name/address + avatar */}
            <div className="text-black dark:text-white">{name}</div>
            {/** Tag */}
            <div className="text-black dark:text-white">{category}</div>
            {/** NFT Description */}
            <div className="text-black dark:text-white">{title}</div>
            <div className="text-black dark:text-white">{description}</div>
            {/** Pricing */}
            <div className="text-black dark:text-white">{cost.toString() + ' ' + currencySymbol}</div>
        </div>
    );
}
