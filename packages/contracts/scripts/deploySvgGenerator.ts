import { ethers } from 'hardhat';

async function main() {
  const FirstSvgGeneratorFactory = await ethers.getContractFactory('FirstCirclesSvgGenerator');
  const firstSvgGenerator = await FirstSvgGeneratorFactory.deploy();
  await firstSvgGenerator.deployed();

  const ThirdSvgGeneratorFactory = await ethers.getContractFactory('ThirdCircleSvgGenerator');
  const thirdSvgGenerator = await ThirdSvgGeneratorFactory.deploy();
  await thirdSvgGenerator.deployed();

  const LastSvgGeneratorFactory = await ethers.getContractFactory('LastCirclesSvgGenerator');
  const lastSvgGenerator = await LastSvgGeneratorFactory.deploy();
  await lastSvgGenerator.deployed();

  const SvgGeneratorFactory = await ethers.getContractFactory('SvgGenerator');
  const svgGenerator = await SvgGeneratorFactory.deploy(
    firstSvgGenerator.address,
    thirdSvgGenerator.address,
    lastSvgGenerator.address
  );
  await svgGenerator.deployed();

  console.log(
    'SVG: ',
    svgGenerator.address,
    'Fst',
    firstSvgGenerator.address,
    'Trd',
    thirdSvgGenerator.address,
    'Lst',
    lastSvgGenerator.address
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
