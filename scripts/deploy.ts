import { ethers } from "hardhat";

async function main() {

  const TimeCollection = await ethers.getContractFactory("TimeCollection");
  const timeCollection = await TimeCollection.deploy("Tokenized Time", "TTime");

  await timeCollection.deployed();
  console.log("NFT Collection deployed to:", timeCollection.address);
  await timeCollection.mint(
    "One dev hour v1",
    "One development hour to be used for any dao",
    "Development",
    "1",
    "26/11/2021 19:00"
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});