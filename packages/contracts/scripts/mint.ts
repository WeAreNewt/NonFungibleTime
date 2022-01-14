import { ethers } from 'hardhat';

async function main() {
  const NftCollectionFactory = await ethers.getContractFactory('NonFungibleTimeCollection');
  const nftCollection = await NftCollectionFactory.attach('<NonFungibleTimeCollectionAddress>');

  await nftCollection.mint(
    'One hour of randomdeveloper.eth',
    'I would love to code Solidity for a DAO',
    'Development',
    0,
    0,
    3600,
    100
  );
  await nftCollection.mint(
    'Two hours of design',
    'I have knowdlege about UI/UX and design',
    'Design',
    0,
    0,
    7200,
    100
  );
  await nftCollection.mint(
    'Two hours of brainstorming',
    'I can help you to get ideas on how to growth your community',
    'Community',
    0,
    0,
    7200,
    100
  );
  await nftCollection.mint(
    'One hour of otherdev.eth',
    'I would love to help with frontend :)',
    'Development',
    0,
    0,
    3600,
    100
  );
  await nftCollection.mint(
    'Three hours of Spanish lessons',
    'I am a native Spanish speaker willing to teach',
    'Lessons',
    0,
    0,
    10800,
    100
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
