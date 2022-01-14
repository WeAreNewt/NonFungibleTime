import { ethers } from 'hardhat';

async function main() {
  const SvgGeneratorFactory = await ethers.getContractFactory('SvgGenerator');
  const svgGenerator = await SvgGeneratorFactory.deploy();

  await svgGenerator.deployed();
  console.log('SvgGenerator deployed to:', svgGenerator.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
