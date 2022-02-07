import { ethers } from 'hardhat';

async function main() {
  const NftCollectionFactory = await ethers.getContractFactory('NonFungibleTimeCollection');
  const nftCollection = await NftCollectionFactory.attach('<NonFungibleTimeCollectionAddress>');

  await nftCollection.initialize(
    'NonFungibleTimeCollection',
    'NFTIME',
    true,
    '<SvgGeneratorAddress>',
    '<OwnerAddress>'
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
