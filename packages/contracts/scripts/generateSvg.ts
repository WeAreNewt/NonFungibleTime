import { ethers } from 'hardhat';

async function main() {
  const SvgGeneratorFactory = await ethers.getContractFactory('SvgGenerator');
  const svgGenerator = await SvgGeneratorFactory.attach('<SvgGeneratorAddress>');

  console.log(await svgGenerator.generateSvg(false, 'Design'));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
