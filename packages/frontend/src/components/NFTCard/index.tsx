import React from 'react';
import { NFTProps } from '../../types';


export default function NFTCard({ address, name, avatar, date, category, title, description, cost, currencyAddress, currencySymbol }: NFTProps) {

    return (
        <div className="border p-3">
            {/** Seller name/address + avatar */}
            <div>{name}</div>
            {/** Tag */}
            <div>{category}</div>
            {/** NFT Description */}
            <div>{title}</div>
            <div>{description}</div>
            {/** Pricing */}
            <div>{cost.toString() + ' ' + currencySymbol}</div>
        </div>
    );
}
