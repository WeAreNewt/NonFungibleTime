import { expect } from "chai";
import { ethers } from "hardhat";
import { TimeCollection } from "../typechain/TimeCollection.d";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { TestToken } from "contracts/typechain";


describe("Tokenized time collection", () => {
  let timeContract: TimeCollection;
  let owner: SignerWithAddress;
  let address1: SignerWithAddress;
  let testToken: TestToken;

  beforeEach(async () => {
    const TimeCollectionFactory = await ethers.getContractFactory(
      "TimeCollection"
    );
    const TestTokenFactory = await ethers.getContractFactory(
        "TestToken"
    );
    [owner, address1] = await ethers.getSigners();
    timeContract = await TimeCollectionFactory.deploy(
      "Tokenized Time",
      "TTime"
    );
    testToken = await TestTokenFactory.deploy();
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
      await timeContract.connect(address1).toggleCurrencyAllowance(testToken.address);
    } catch (error : any) {
      expect(error.message).to.contain('Ownable: caller is not the owner');
    }
  });

  it("Should whitelist a currency to use as payment if you are the owner", async () => {
    await timeContract.toggleCurrencyAllowance(testToken.address);
    expect(await timeContract.isCurrencyAllowed(testToken.address)).to.be.true;
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
      await timeContract.connect(address1).changeTokenBuyingConditions(ethers.constants.Zero, testToken.address, ethers.constants.One);
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

    await timeContract.toggleCurrencyAllowance(testToken.address);
    await timeContract.changeTokenBuyingConditions(ethers.constants.Zero, testToken.address, ethers.constants.One);

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
      testToken.address
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
    await timeContract.toggleCurrencyAllowance(testToken.address);
    await timeContract.changeTokenBuyingConditions(ethers.constants.Zero, testToken.address, ethers.constants.One);
    await timeContract.toggleForSale(ethers.BigNumber.from(0));
    expect(await (await timeContract.tokens(0)).forSale).to.be.true
  });

  it("Should redeem an NFT if you are the owner of it", async () => {
    await timeContract.mint(
        "One dev hour v1",
        "One development hour to be used for any dao",
        "Development",
        "1",
        "26/11/2021 19:00",
        0
      );
      await timeContract.redeem(ethers.BigNumber.from(0));
      expect(await (await timeContract.tokens(0)).redeemed).to.be.true
  });

  it("Should revert the NFT redeem if you are not the owner of it", async () => {
    await timeContract.mint(
        "One dev hour v1",
        "One development hour to be used for any dao",
        "Development",
        "1",
        "26/11/2021 19:00",
        0
      );
      try {
        await timeContract.connect(address1).redeem(ethers.BigNumber.from(0));
      } catch (error : any) {
          expect(error.message).to.contain('OnlyTokenOwner');
      }
    });

    it("Should revert a redeem transaction if the NFT is already redeemed", async() => {
        await timeContract.mint(
            "One dev hour v1",
            "One development hour to be used for any dao",
            "Development",
            "1",
            "26/11/2021 19:00",
            0
          );
          await timeContract.redeem(ethers.BigNumber.from(0));
          try {
            await timeContract.redeem(ethers.BigNumber.from(0));
          } catch (error : any) {
              expect(error.message).to.contain('AlreadyRedeemed');
          }
    });

    it("Should revert a buyToken transaction because the token is not for sale", async() => {
        await timeContract.mint(
            "One dev hour v1",
            "One development hour to be used for any dao",
            "Development",
            "1",
            "26/11/2021 19:00",
            0
          );
          await timeContract.toggleCurrencyAllowance(testToken.address);
          await timeContract.changeTokenBuyingConditions(ethers.constants.Zero, testToken.address, ethers.constants.One);
        try {
            await timeContract.connect(address1).buyToken(ethers.constants.Zero);
        } catch (error : any) {
            expect(error.message).to.contain('NotForSale');
        }
    });

    it("Should revert a buyToken transaction because the buyer doesn't have enough funds", async() => {
        await timeContract.mint(
            "One dev hour v1",
            "One development hour to be used for any dao",
            "Development",
            "1",
            "26/11/2021 19:00",
            0
          );
          await timeContract.toggleCurrencyAllowance(testToken.address);
          await timeContract.changeTokenBuyingConditions(ethers.constants.Zero, testToken.address, ethers.constants.One);
          await timeContract.toggleForSale(ethers.constants.Zero);
        try {
            await timeContract.connect(address1).buyToken(ethers.constants.Zero);
        } catch (error : any) {
            expect(error.message).to.contain('NotEnoughFunds');
        }
    });

    it("Should revert the transaction if someone is trying to buy his own token", async() => {
        await timeContract.mint(
            "One dev hour v1",
            "One development hour to be used for any dao",
            "Development",
            "1",
            "26/11/2021 19:00",
            0
          );
          await timeContract.toggleCurrencyAllowance(testToken.address);
          await timeContract.changeTokenBuyingConditions(ethers.constants.Zero, testToken.address, ethers.constants.One);
          await timeContract.toggleForSale(ethers.constants.Zero);
        try {
            await timeContract.buyToken(ethers.constants.Zero);
        } catch (error : any) {
            expect(error.message).to.contain('CantBuyYourOwnToken');
        }
    });

    it("Should buy a token from someone if you have enough funds", async() => {
        await timeContract.connect(address1).mint(
            "One dev hour v1",
            "One development hour to be used for any dao",
            "Development",
            "1",
            "26/11/2021 19:00",
            0
        ); 
        await timeContract.toggleCurrencyAllowance(testToken.address);
        await timeContract.connect(address1).changeTokenBuyingConditions(ethers.constants.Zero, testToken.address, ethers.constants.One);
        await timeContract.connect(address1).toggleForSale(ethers.constants.Zero);
        await testToken.mint();
        await testToken.increaseAllowance(timeContract.address, ethers.BigNumber.from(100));
        await timeContract.buyToken(ethers.constants.Zero);
        expect(await testToken.balanceOf(owner.address)).to.equal(ethers.BigNumber.from(99));
        expect(await timeContract.ownerOf(ethers.constants.Zero)).to.equal(owner.address);
    });
});