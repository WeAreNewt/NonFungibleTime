import { ethers } from 'hardhat';

async function main() {
  const NftCollectionFactory = await ethers.getContractFactory('NonFungibleTimeCollection');
  const nftCollection = await NftCollectionFactory.attach('<NonFungibleTimeCollectionAddress>');

  await nftCollection.toggleCurrencyAllowance('0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
