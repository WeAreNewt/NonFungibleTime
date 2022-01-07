import { ethers } from 'hardhat';

async function main() {
  const TimeCollection = await ethers.getContractFactory('TimeCollection');
  const timeCollection = await TimeCollection.deploy('Tokenized Time Collection', 'TTC', true);

  await timeCollection.deployed();
  console.log('NFT Collection deployed to:', timeCollection.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
