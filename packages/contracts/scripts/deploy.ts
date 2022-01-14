import { ethers } from 'hardhat';

async function main() {
  const TimeCollection = await ethers.getContractFactory('NonFungibleTimeCollection');
  const timeCollection = await TimeCollection.deploy(
    'Non Fungible Time',
    'NFTIME',
    true,
    '<SvgGeneratorAddress>'
  );

  await timeCollection.deployed();
  console.log('NonFungibleTimeCollection deployed to:', timeCollection.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
