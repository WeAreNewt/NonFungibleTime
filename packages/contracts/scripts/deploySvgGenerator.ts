import { ethers } from 'hardhat';

async function main() {
  const OuterRingsSvgGeneratorFactory = await ethers.getContractFactory('OuterRingsSvgGenerator');
  const outerRingsSvgGenerator = await OuterRingsSvgGeneratorFactory.deploy();
  await outerRingsSvgGenerator.deployed();

  const MiddleRingsSvgGeneratorFactory = await ethers.getContractFactory('MiddleRingsSvgGenerator');
  const middleRingsSvgGenerator = await MiddleRingsSvgGeneratorFactory.deploy();
  await middleRingsSvgGenerator.deployed();

  const InnerRingsSvgGeneratorFactory = await ethers.getContractFactory('InnerRingsSvgGenerator');
  const innerRingsSvgGenerator = await InnerRingsSvgGeneratorFactory.deploy();
  await innerRingsSvgGenerator.deployed();

  const SvgGeneratorFactory = await ethers.getContractFactory('SvgGenerator');
  const svgGenerator = await SvgGeneratorFactory.deploy(
    outerRingsSvgGenerator.address,
    middleRingsSvgGenerator.address,
    innerRingsSvgGenerator.address
  );
  await svgGenerator.deployed();

  console.log(
    'svgGenerator: ',
    svgGenerator.address,
    '\nouterRingsSvgGenerator: ',
    outerRingsSvgGenerator.address,
    '\nmiddleRingsSvgGenerator: ',
    middleRingsSvgGenerator.address,
    '\ninnerRingsSvgGenerator: ',
    innerRingsSvgGenerator.address
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
