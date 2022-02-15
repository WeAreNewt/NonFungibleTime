import { ethers, upgrades } from 'hardhat';
import { DefenderRelayProvider, DefenderRelaySigner } from 'defender-relay-client/lib/ethers';

async function main() {
  const credentials = {
    apiKey: '<API_KEY>',
    apiSecret: '<API_SECRET>',
  };
  const provider = new DefenderRelayProvider(credentials);
  const signer = new DefenderRelaySigner(credentials, provider, { speed: 'fast' });

  const OuterRingsSvgGeneratorFactory = await ethers.getContractFactory(
    'OuterRingsSvgGenerator',
    signer
  );
  const outerRingsSvgGenerator = await OuterRingsSvgGeneratorFactory.deploy();
  await outerRingsSvgGenerator.deployed();

  const MiddleRingsSvgGeneratorFactory = await ethers.getContractFactory(
    'MiddleRingsSvgGenerator',
    signer
  );
  const middleRingsSvgGenerator = await MiddleRingsSvgGeneratorFactory.deploy();
  await middleRingsSvgGenerator.deployed();

  const InnerRingsSvgGeneratorFactory = await ethers.getContractFactory(
    'InnerRingsSvgGenerator',
    signer
  );
  const innerRingsSvgGenerator = await InnerRingsSvgGeneratorFactory.deploy();
  await innerRingsSvgGenerator.deployed();

  const SvgGeneratorFactory = await ethers.getContractFactory('SvgGenerator', signer);
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

  const NonFungibleTimeCollection = await ethers.getContractFactory(
    'NonFungibleTimeCollection',
    signer
  );
  const nonFungibleTimeCollection = await upgrades.deployProxy(NonFungibleTimeCollection, [
    'NonFungibleTimeCollection',
    'NFTIME',
    true,
    svgGenerator.address,
    '0xe8E3589fDC3279dE6fFa36413Edec4128be29904',
  ]);
  await nonFungibleTimeCollection.deployed();
  console.log('NonFungibleTimeCollection deployed to:', nonFungibleTimeCollection.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
