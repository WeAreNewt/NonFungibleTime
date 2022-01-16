<p align="center">
    <img src="newt_mayan.svg" width="300" height="300" >
<p>
<style>@keyframesclockwise-rotation{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}@keyframescounter-clockwise-rotation{from{transform:rotate(360deg);}to{transform:rotate(0deg);}}.rotation-1{animation:counter-clockwise-rotation8slinearinfinite;transform-box:fill-box;transform-origin:center;}.rotation-2{animation:counter-clockwise-rotation5slinearinfinite;transform-box:fill-box;transform-origin:center;}.rotation-3{animation:clockwise-rotation13slinearinfinite;transform-box:fill-box;transform-origin:center;}.rotation-4{animation:counter-clockwise-rotation7slinearinfinite;transform-box:fill-box;transform-origin:center;}.rotation-5{animation:clockwise-rotation3slinearinfinite;transform-box:fill-box;transform-origin:center;}.rotation-6{animation:counter-clockwise-rotation5slinearinfinite;transform-box:fill-box;transform-origin:center;}.rotation-newt{animation:clockwise-rotation15slinearinfinite;transform-box:fill-box;transform-origin:center;}.cls-1,.cls-15,.cls-20,.cls-3,.cls-5{fill:none;}.cls-17,.cls-2{fill:hsla(169,100%,93%,1);}.cls-15,.cls-2,.cls-3,.cls-5{stroke:hsla(262,67%,76%,1);}.cls-16,.cls-17,.cls-18,.cls-19,.cls-2,.cls-3{stroke-miterlimit:10;}.cls-2,.cls-3{stroke-width:4px;}.cls-4{clip-path:url(#clip-path);}.cls-15,.cls-20,.cls-5{stroke-linecap:round;stroke-linejoin:round;}.cls-5{stroke-width:3px;}.cls-6{clip-path:url(#clip-path-2);}.cls-7{clip-path:url(#clip-path-3);}.cls-8{clip-path:url(#clip-path-4);}.cls-9{clip-path:url(#clip-path-5);}.cls-10{clip-path:url(#clip-path-6);}.cls-11{clip-path:url(#clip-path-7);}.cls-12{clip-path:url(#clip-path-8);}.cls-13{clip-path:url(#clip-path-9);}.cls-14{clip-path:url(#clip-path-10);}.cls-15{stroke-width:3px;}.cls-16,.cls-18{fill:#9a7ac6;}.cls-16,.cls-17{stroke:#8c6bb4;}.cls-18,.cls-19,.cls-20{stroke:#9a7ac6;}.cls-19{fill:#fffeff;}</style>

# Non Fungible Time

Mint and purchase NFTs representing time for performing gig work. Time NFTs represent an on-chain attestation of work for contributors, and a
way for organizations to recruit talent for specialized needs

<br />

## Packages:

<br />

## Contracts

<br />

The smart contracts store the NFT collection on the blockchain. This package uses the hardhat framework.

The [NonFungibleTimeCollection.sol](https://github.com/WeAreNewt/TokenizedTimeNFTs/blob/main/packages/contracts/contracts/NonFungibleTimeCollection.sol) contract defines the Time NFT collection

The [SvgGenerator.sol](https://github.com/WeAreNewt/TokenizedTimeNFTs/blob/main/packages/contracts/contracts/SvgGenerator.sol) generates and stores the on-chain svg for each NFT, which is updated once an NFT is redeemed

To generate contract abis and typechain artifacts:

```sh
npm install
npx hardhat compile
```

[More Info](https://github.com/WeAreNewt/TokenizedTimeNFTs/blob/main/packages/contracts/README.md)

<br />
<br />

## Frontend

<br />

Main features of the frontend are creating, discovering, purchasing, and redeeming time NFTs

Frontend is build with React + TailwindCSS

TO-DO: Contract query framework
TO-DO: GraphQL Client

[More Info](https://github.com/WeAreNewt/TokenizedTimeNFTs/blob/main/packages/frontend/README.md)

<br />
<br />

## Subgraph

<br />

The subgraph indexes data and provides access to a graphQL endpoint from blockchain data

There is a corresponding subgraph for each network the collection contract is deployed to

The playground links below allow you to view and query the subgraph schema directly from your browser and provide the links for the api endpoint:

- [Mumbai Subgraph](https://thegraph.com/hosted-service/subgraph/wearenewt/non-fungible-time-mumbai)

[More Info](https://github.com/WeAreNewt/TokenizedTimeNFTs/blob/main/packages/subgraph/README.md)
