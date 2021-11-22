import { ethers } from "hardhat";

async function main() {
  const SvgHelper = await ethers.getContractFactory("SvgHelper");
  const svgHelper = await SvgHelper.deploy();

  const TimeCollection = await ethers.getContractFactory("TimeCollection", {
    libraries: {
      SvgHelper: svgHelper.address,
    },
  });
  const timeCollection = await TimeCollection.deploy("Tokenized Time", "TTime");

  await timeCollection.deployed();
  console.log("NFT Collection deployed to:", timeCollection.address);
  await timeCollection.mint(
    `<?xml version="1.0" encoding="UTF-8"?><svg enable-background="new 0 0 800 800" version="1.1" viewBox="0 0 800 800" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><style type="text/css">.st0{clip-path:url(#b);}.st1{fill:url(#a);}.st2{fill:#FFFFFF;}</style><defs><rect id="c" width="800" height="800"/></defs><clipPath id="b"><use xlink:href="#c"/></clipPath><g class="st0"><linearGradient id="a" x1="-597.36" x2="-598.1" y1="900.69" y2="900.06" gradientTransform="matrix(776 0 0 -776 464237 699089)" gradientUnits="userSpaceOnUse"><stop stop-color="#B6509E" offset="0"/><stop stop-color="#2EBAC6" offset="1"/></linearGradient><circle class="st1" cx="400" cy="400" r="388"/><path class="st2" d="m569.8 554.6-131.2-317.2c-7.4-16.4-18.4-24.4-32.9-24.4h-11.6c-14.5 0-25.5 8-32.9 24.4l-57.1 138.2h-43.2c-12.9 0.1-23.4 10.5-23.5 23.5v0.3c0.1 12.9 10.6 23.4 23.5 23.5h23.2l-54.5 131.7c-1 2.9-1.6 5.9-1.6 9 0 7.4 2.3 13.2 6.4 17.7s10 6.7 17.4 6.7c4.9-0.1 9.6-1.6 13.5-4.5 4.2-2.9 7.1-7.1 9.4-11.9l60-148.8h41.6c12.9-0.1 23.4-10.5 23.5-23.5v-0.6c-0.1-12.9-10.6-23.4-23.5-23.5h-22.2l45.8-114.1 124.8 310.4c2.3 4.8 5.2 9 9.4 11.9 3.9 2.9 8.7 4.4 13.5 4.5 7.4 0 13.2-2.2 17.4-6.7s6.4-10.3 6.4-17.7c0.1-3-0.4-6.1-1.6-8.9z"/></g></svg>`,
    "One dev hour",
    "One development hour to be used for any dao"
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
