import { ethers } from 'hardhat';

async function main() {
  const NftCollectionFactory = await ethers.getContractFactory('NonFungibleTimeCollection');
  const nftCollection = await NftCollectionFactory.attach('<NonFungibleTimeCollectionAddress>');

  console.log('Token URI = ', await nftCollection.tokenURI(0));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
