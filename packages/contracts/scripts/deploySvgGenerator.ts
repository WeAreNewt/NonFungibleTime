import { ethers } from 'hardhat';

async function main() {
  const TimeCollection = await ethers.getContractFactory('SvgGenerator');
  const timeCollection = await TimeCollection.deploy();

  await timeCollection.deployed();
  console.log('SvgGenerator deployed to:', timeCollection.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
