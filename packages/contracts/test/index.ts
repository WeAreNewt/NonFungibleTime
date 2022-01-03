import { expect } from "chai";
import { ethers } from "hardhat";
import { TimeCollection } from "../typechain/TimeCollection.d";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";


describe("Tokenized time collection", () => {
  let timeContract: TimeCollection;
  let owner: SignerWithAddress;
  let address1: SignerWithAddress;

  beforeEach(async () => {
    const TimeCollectionFactory = await ethers.getContractFactory(
      "TimeCollection"
    );
    [owner, address1] = await ethers.getSigners();
    timeContract = await TimeCollectionFactory.deploy(
      "Tokenized Time",
      "TTime"
    );
  });

  it("Should initialize the Tokenized Time contract", async () => {
    expect(await timeContract.name()).to.equal('Tokenized Time');
  });

  it("Should set the right owner", async () => {
    expect(await timeContract.owner()).to.equal(await owner.address);
  });

  it("Should mint a NFT with the correct metadata", async () => {
    await timeContract.mint(
      "One dev hour v1",
      "One development hour to be used for any dao",
      "Development",
      "1",
      "26/11/2021 19:00",
      0
    );

    expect(await timeContract.tokens(0)).to.eql( [
      ethers.constants.Zero,
      ethers.constants.Zero,
      ethers.constants.Zero,
      "One dev hour v1",
      "One development hour to be used for any dao",
      "Development",
      "1",
      "26/11/2021 19:00",
      false,
      false,
      owner.address,
      ethers.constants.AddressZero
    ]);
  });


  it("Should revert if you try to put on sale a NFT with an unallowed currency", async () => {
    await timeContract.mint(
      "One dev hour v1",
      "One development hour to be used for any dao",
      "Development",
      "1",
      "26/11/2021 19:00",
      0
    );
    try {
      await timeContract.toggleForSale(ethers.BigNumber.from(0));
    } catch (error : any) {
      expect(error.message).to.contain('UnallowedCurrency');
    }
  });

  it("Should revert if you try to whitelist a currency and you are not the owner", async () => {
    try {
      await timeContract.connect(address1).toggleCurrencyAllowance(ethers.constants.AddressZero);
    } catch (error : any) {
      expect(error.message).to.contain('Ownable: caller is not the owner');
    }
  });

  it("Should whitelist a currency to use as payment if you are the owner", async () => {
    await timeContract.toggleCurrencyAllowance(ethers.constants.AddressZero);
    expect(await timeContract.isCurrencyAllowed(ethers.constants.AddressZero)).to.be.true;
  });

  it("Should revert if you try to change token buying conditions and you are not the owner", async () => {
    await timeContract.mint(
      "One dev hour v1",
      "One development hour to be used for any dao",
      "Development",
      "1",
      "26/11/2021 19:00",
      0
    );
    try {
      await timeContract.connect(address1).changeTokenBuyingConditions(ethers.constants.Zero, ethers.constants.AddressZero, ethers.constants.One);
    } catch (error : any) {
      expect(error.message).to.contain('OnlyTokenOwner');
    }
  });

  it("Should change token buying conditions", async () => {
    await timeContract.mint(
      "One dev hour v1",
      "One development hour to be used for any dao",
      "Development",
      "1",
      "26/11/2021 19:00",
      0
    );

    await timeContract.toggleCurrencyAllowance(ethers.constants.AddressZero);
    await timeContract.changeTokenBuyingConditions(ethers.constants.Zero, ethers.constants.AddressZero, ethers.constants.One);

    expect(await timeContract.tokens(0)).to.eql( [
      ethers.constants.Zero,
      ethers.constants.One,
      ethers.constants.Zero,
      "One dev hour v1",
      "One development hour to be used for any dao",
      "Development",
      "1",
      "26/11/2021 19:00",
      false,
      false,
      owner.address,
      ethers.constants.AddressZero
    ]);
  });

  it("Should revert if you try to toggle from sale and you are not the owner", async () => {
    await timeContract.mint(
      "One dev hour v1",
      "One development hour to be used for any dao",
      "Development",
      "1",
      "26/11/2021 19:00",
      0
    );
    try {
      await timeContract.connect(address1).toggleForSale(ethers.BigNumber.from(0));
    } catch (error : any) {
      expect(error.message).to.contain('OnlyTokenOwner');
    }
  });

  it("Should toggle for sale if you are the token owner", async () => {

    await timeContract.mint(
      "One dev hour v1",
      "One development hour to be used for any dao",
      "Development",
      "1",
      "26/11/2021 19:00",
      0
    );
    await timeContract.toggleCurrencyAllowance(ethers.constants.AddressZero);
    await timeContract.toggleForSale(ethers.BigNumber.from(0));
    expect(await (await timeContract.tokens(0)).forSale).to.be.true
  });
});