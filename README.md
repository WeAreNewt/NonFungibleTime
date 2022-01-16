<p align="center">
    <img src="newt_mayan.svg" width="300" height="300" >
<p>

# Non Fungible Time

Mint and purchase NFTs representing time for performing gig work. Time NFTs represent an on-chain attestation of work for contributors, and a
way for organizations to recruit talent for specialized needs

## Contracts

The smart contracts store the NFT collection on the blockchain. This package uses the hardhat framework.

The [NonFungibleTimeCollection.sol](https://github.com/WeAreNewt/NonFungibleTime/blob/main/packages/contracts/contracts/NonFungibleTimeCollection.sol) contract defines the Time NFT collection

The [SvgGenerator.sol](https://github.com/WeAreNewt/NonFungibleTime/blob/main/packages/contracts/contracts/SvgGenerator.sol) generates and stores the on-chain svg for each NFT, which is updated once an NFT is redeemed

To generate contract abis and typechain artifacts:

```sh
npm install
npx hardhat compile
```

[More Info](https://github.com/WeAreNewt/NonFungibleTime/blob/main/packages/contracts/README.md)

<br />

## Frontend

Main features of the frontend are creating, discovering, purchasing, and redeeming time NFTs

Frontend is build with React + TailwindCSS

TO-DO: Contract query framework
TO-DO: GraphQL Client

[More Info](https://github.com/WeAreNewt/NonFungibleTime/blob/main/packages/frontend/README.md)

<br />

## Subgraph

The subgraph indexes data and provides access to a graphQL endpoint from blockchain data

There is a corresponding subgraph for each network the collection contract is deployed to

The playground links below allow you to view and query the subgraph schema directly from your browser and provide the links for the api endpoint:

- [Mumbai Subgraph](https://thegraph.com/hosted-service/subgraph/wearenewt/non-fungible-time-mumbai)

[More Info](https://github.com/WeAreNewt/NonFungibleTime/blob/main/packages/subgraph/README.md)
