import { ethers, upgrades } from 'hardhat';

async function main() {
  const NonFungibleTimeCollection = await ethers.getContractFactory('NonFungibleTimeCollection');
  const nonFungibleTimeCollection = await upgrades.deployProxy(NonFungibleTimeCollection, [
    'Non Fungible Time',
    'NFTIME',
    true,
    '<SvgGeneratorAddress>',
    '<OwnerAddress>',
  ]);
  await nonFungibleTimeCollection.deployed();
  console.log('NonFungibleTimeCollection deployed to:', nonFungibleTimeCollection.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
