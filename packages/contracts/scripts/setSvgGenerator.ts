import { ethers } from 'hardhat';

async function main() {
  const NftCollectionFactory = await ethers.getContractFactory('NonFungibleTimeCollection');
  const nftCollection = await NftCollectionFactory.attach('<NonFungibleTimeCollectionAddress>');

  await nftCollection.setSvgGenerator('<SvgGeneratorAddress>');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
