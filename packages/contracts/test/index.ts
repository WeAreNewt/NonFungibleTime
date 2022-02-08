import { expect } from 'chai';
import { waffle, ethers } from 'hardhat';
import { NonFungibleTimeCollection } from '../typechain/NonFungibleTimeCollection.d';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { SvgGenerator, TestToken } from 'contracts/typechain';
import { BigNumber } from 'ethers';
import { InnerRingsSvgGenerator } from 'contracts/typechain/InnerRingsSvgGenerator';
import { OuterRingsSvgGenerator } from 'contracts/typechain/OuterRingsSvgGenerator';
import { MiddleRingsSvgGenerator } from 'contracts/typechain/MiddleRingsSvgGenerator';
import { getDomainSeparator, getErc721PermitSignature } from './utilities/getErc721PermitSignature';

describe('Tokenized time collection', () => {
  let nftCollection: NonFungibleTimeCollection;
  let outerRingsSvgGenerator: OuterRingsSvgGenerator;
  let middleRingsSvgGenerator: MiddleRingsSvgGenerator;
  let innerRingsSvgGenerator: InnerRingsSvgGenerator;
  let svgGenerator: SvgGenerator;
  let owner: SignerWithAddress;
  let minter: SignerWithAddress;
  let otherAccount: SignerWithAddress;
  let buyer: SignerWithAddress;
  let testToken: TestToken;

  beforeEach(async () => {
    const NftCollectionFactory = await ethers.getContractFactory('NonFungibleTimeCollection');
    const OuterRingsSvgGeneratorFactory = await ethers.getContractFactory('OuterRingsSvgGenerator');
    const MiddleRingsSvgGeneratorFactory = await ethers.getContractFactory(
      'MiddleRingsSvgGenerator'
    );
    const InnerRingsSvgGeneratorFactory = await ethers.getContractFactory('InnerRingsSvgGenerator');
    const SvgGeneratorFactory = await ethers.getContractFactory('SvgGenerator');
    const TestTokenFactory = await ethers.getContractFactory('TestToken');
    [owner, otherAccount, buyer] = await ethers.getSigners();
    minter = owner;
    outerRingsSvgGenerator = await OuterRingsSvgGeneratorFactory.deploy();
    middleRingsSvgGenerator = await MiddleRingsSvgGeneratorFactory.deploy();
    innerRingsSvgGenerator = await InnerRingsSvgGeneratorFactory.deploy();
    svgGenerator = await SvgGeneratorFactory.deploy(
      outerRingsSvgGenerator.address,
      middleRingsSvgGenerator.address,
      innerRingsSvgGenerator.address
    );
    nftCollection = await NftCollectionFactory.deploy();
    nftCollection.initialize(
      'Non Fungible Time',
      'NFTIME',
      false,
      svgGenerator.address,
      owner.address
    );
    testToken = await TestTokenFactory.deploy();
  });

  it('Should initialize the Tokenized Time contract', async () => {
    expect(await nftCollection.name()).to.equal('Non Fungible Time');
  });

  it('Should set the right owner', async () => {
    expect(await nftCollection.owner()).to.equal(await owner.address);
  });

  it('Should mint a NFT with the correct metadata', async () => {
    await nftCollection.mint(
      'One dev hour v1',
      'One development hour to be used for any dao',
      'Development',
      1641342727,
      1651342727,
      10000000,
      300
    );
    expect(await nftCollection.tokens(0)).to.eql([
      BigNumber.from(1641342727),
      BigNumber.from(1651342727),
      BigNumber.from(10000000),
      ethers.constants.Zero,
      BigNumber.from(300),
      minter.address,
      minter.address,
      ethers.constants.AddressZero,
      ethers.constants.AddressZero,
      false,
      false,
      'One dev hour v1',
      'One development hour to be used for any dao',
      'Development',
    ]);
  });

  it('Should success when mint an NFT with duration matching availability range duration', async () => {
    let availabilityFrom = 1641342727;
    let availabilityTo = 1651342727;
    let duration = availabilityTo - availabilityFrom;
    expect(duration).to.be.equals(availabilityTo - availabilityFrom);
    await nftCollection.mint(
      'One dev hour v1',
      'One development hour to be used for any dao',
      'Development',
      availabilityFrom,
      availabilityTo,
      duration,
      300
    );
  });

  it('Should success when mint an NFT with duration being less than availability range duration', async () => {
    let availabilityFrom = 1641342727;
    let availabilityTo = 1651342727;
    let duration = 1000;
    expect(duration).to.be.lessThan(availabilityTo - availabilityFrom);
    await nftCollection.mint(
      'One dev hour v1',
      'One development hour to be used for any dao',
      'Development',
      availabilityFrom,
      availabilityTo,
      duration,
      300
    );
  });

  it('Should success when mint an NFT without availability range', async () => {
    let availabilityFrom = 0;
    let availabilityTo = 0;
    let duration = 10000000;
    expect(availabilityFrom).to.be.equals(0);
    expect(availabilityTo).to.be.equals(0);
    expect(duration).to.be.greaterThan(0);
    await nftCollection.mint(
      'One dev hour v1',
      'One development hour to be used for any dao',
      'Development',
      availabilityFrom,
      availabilityTo,
      duration,
      300
    );
  });

  it('Should success when mint an NFT without lower availability range', async () => {
    let availabilityFrom = 0;
    let availabilityTo = 1651342727;
    let duration = 100000;
    expect(availabilityTo).to.be.greaterThan(0);
    expect(availabilityFrom).to.be.equals(0);
    await nftCollection.mint(
      'One dev hour v1',
      'One development hour to be used for any dao',
      'Development',
      availabilityFrom,
      availabilityTo,
      duration,
      300
    );
  });

  it('Should success when mint an NFT without upper availability range', async () => {
    let availabilityFrom = 1641342727;
    let availabilityTo = 0;
    let duration = 100000;
    expect(availabilityFrom).to.be.greaterThan(0);
    expect(availabilityTo).to.be.equals(0);
    await nftCollection.mint(
      'One dev hour v1',
      'One development hour to be used for any dao',
      'Development',
      availabilityFrom,
      availabilityTo,
      duration,
      300
    );
  });

  it('Should revert when mint an NFT with zero duration', async () => {
    let availabilityFrom = 1641342727;
    let availabilityTo = 1651342727;
    let duration = 0;
    expect(availabilityFrom).to.be.greaterThan(0);
    expect(availabilityTo).to.be.greaterThan(0);
    expect(duration).to.be.equals(0);
    await expect(
      nftCollection.mint(
        'One dev hour v1',
        'One development hour to be used for any dao',
        'Development',
        availabilityFrom,
        availabilityTo,
        duration,
        300
      )
    ).to.be.revertedWith('InvalidTimeParams()');
    availabilityFrom = 0;
    availabilityTo = 0;
    expect(availabilityFrom).to.be.equals(0);
    expect(availabilityTo).to.be.equals(0);
    expect(duration).to.be.equals(0);
    await expect(
      nftCollection.mint(
        'One dev hour v1',
        'One development hour to be used for any dao',
        'Development',
        availabilityFrom,
        availabilityTo,
        duration,
        300
      )
    ).to.be.revertedWith('InvalidTimeParams()');
  });

  it('Should revert when mint an NFT with duration greater than availability range', async () => {
    let availabilityFrom = 1641342727;
    let availabilityTo = 1651342727;
    let duration = availabilityTo - availabilityFrom + 1;
    expect(duration).to.be.greaterThan(availabilityTo - availabilityFrom);
    await expect(
      nftCollection.mint(
        'One dev hour v1',
        'One development hour to be used for any dao',
        'Development',
        availabilityFrom,
        availabilityTo,
        duration,
        300
      )
    ).to.be.revertedWith('InvalidTimeParams()');
  });

  it('Should revert when mint an NFT with availability range with an upper bound less than the lower one', async () => {
    let availabilityFrom = 1600000000;
    let availabilityTo = 1400000000;
    let duration = 100;
    expect(availabilityFrom).to.be.greaterThan(availabilityTo);
    await expect(
      nftCollection.mint(
        'One dev hour v1',
        'One development hour to be used for any dao',
        'Development',
        availabilityFrom,
        availabilityTo,
        duration,
        300
      )
    ).to.be.revertedWith('InvalidTimeParams()');
  });

  it('Should revert if you set buying conditions with an unallowed currency', async () => {
    await nftCollection.mint(
      'One dev hour v1',
      'One development hour to be used for any dao',
      'Development',
      1641342727,
      1651342727,
      10000000,
      300
    );
    await expect(
      nftCollection.changeBuyingConditions(
        ethers.constants.Zero,
        ethers.constants.AddressZero,
        ethers.constants.Zero,
        ethers.constants.AddressZero,
        true
      )
    ).to.be.revertedWith('UnallowedCurrency(0, "0x0000000000000000000000000000000000000000")');
  });

  it('Should revert if you try to whitelist a currency and you are not the owner', async () => {
    await expect(
      nftCollection.connect(otherAccount).toggleCurrencyAllowance(testToken.address)
    ).to.be.revertedWith('Ownable: caller is not the owner');
  });

  it('Should whitelist a currency to use as payment if you are the owner', async () => {
    await nftCollection.toggleCurrencyAllowance(testToken.address);
    expect(await nftCollection.isCurrencyAllowed(testToken.address)).to.be.true;
  });

  it('Should revert if you try to change token buying conditions and you are not the owner', async () => {
    await nftCollection.mint(
      'One dev hour v1',
      'One development hour to be used for any dao',
      'Development',
      1641342727,
      1651342727,
      10000000,
      300
    );
    await expect(
      nftCollection
        .connect(otherAccount)
        .changeBuyingConditions(
          ethers.constants.Zero,
          testToken.address,
          ethers.constants.One,
          ethers.constants.AddressZero,
          true
        )
    ).to.be.revertedWith('OnlyTokenOwner');
  });

  it('Should change token buying conditions', async () => {
    await nftCollection.mint(
      'One dev hour v1',
      'One development hour to be used for any dao',
      'Development',
      1641342727,
      1651342727,
      10000000,
      300
    );

    await nftCollection.toggleCurrencyAllowance(testToken.address);
    await nftCollection.changeBuyingConditions(
      ethers.constants.Zero,
      testToken.address,
      ethers.constants.One,
      ethers.constants.AddressZero,
      false
    );

    expect(await nftCollection.tokens(0)).to.eql([
      BigNumber.from(1641342727),
      BigNumber.from(1651342727),
      BigNumber.from(10000000),
      ethers.constants.One,
      BigNumber.from(300),
      minter.address,
      minter.address,
      testToken.address,
      ethers.constants.AddressZero,
      false,
      false,
      'One dev hour v1',
      'One development hour to be used for any dao',
      'Development',
    ]);
  });

  it('Should revert if you try to change buying conditions and you are not the token owner', async () => {
    await nftCollection.mint(
      'One dev hour v1',
      'One development hour to be used for any dao',
      'Development',
      1641342727,
      1651342727,
      10000000,
      300
    );
    await expect(
      nftCollection
        .connect(otherAccount)
        .changeBuyingConditions(
          ethers.constants.Zero,
          ethers.constants.AddressZero,
          ethers.constants.Zero,
          ethers.constants.AddressZero,
          true
        )
    ).to.be.revertedWith('OnlyTokenOwner(0)');
  });

  it('Should toggle for sale if you are the token owner', async () => {
    await nftCollection.mint(
      'One dev hour v1',
      'One development hour to be used for any dao',
      'Development',
      1641342727,
      1651342727,
      10000000,
      300
    );
    await nftCollection.toggleCurrencyAllowance(testToken.address);
    await nftCollection.changeBuyingConditions(
      ethers.constants.Zero,
      testToken.address,
      ethers.constants.One,
      ethers.constants.AddressZero,
      true
    );
    expect(await (await nftCollection.tokens(0)).forSale).to.be.true;
  });

  it('Should redeem an NFT if you are the owner of it', async () => {
    await nftCollection.mint(
      'One dev hour v1',
      'One development hour to be used for any dao',
      'Development',
      1641342727,
      1651342727,
      10000000,
      300
    );
    await nftCollection.redeem(ethers.BigNumber.from(0));
    expect(await (await nftCollection.tokens(0)).redeemed).to.be.true;
  });

  it('Should revert the NFT redeem if you are not the owner of it', async () => {
    await nftCollection.mint(
      'One dev hour v1',
      'One development hour to be used for any dao',
      'Development',
      1641342727,
      1651342727,
      10000000,
      300
    );
    await expect(
      nftCollection.connect(otherAccount).redeem(ethers.BigNumber.from(0))
    ).to.be.revertedWith('OnlyTokenOwner(0)');
  });

  it('Should revert a redeem transaction if the NFT is already redeemed', async () => {
    await nftCollection.mint(
      'One dev hour v1',
      'One development hour to be used for any dao',
      'Development',
      1641342727,
      1651342727,
      10000000,
      300
    );
    await nftCollection.redeem(ethers.BigNumber.from(0));
    await expect(nftCollection.redeem(ethers.BigNumber.from(0))).to.be.revertedWith(
      'AlreadyRedeemed(0)'
    );
  });

  it('Should revert a buy transaction because the token is not for sale', async () => {
    await nftCollection.mint(
      'One dev hour v1',
      'One development hour to be used for any dao',
      'Development',
      1641342727,
      1651342727,
      10000000,
      300
    );
    await nftCollection.toggleCurrencyAllowance(testToken.address);
    await nftCollection.changeBuyingConditions(
      ethers.constants.Zero,
      testToken.address,
      ethers.constants.One,
      ethers.constants.AddressZero,
      false
    );
    await expect(nftCollection.connect(buyer).buy(ethers.constants.Zero)).to.be.revertedWith(
      'NotForSale(0)'
    );
  });

  it("Should revert a buy transaction because the buyer doesn't have enough funds", async () => {
    await nftCollection.mint(
      'One dev hour v1',
      'One development hour to be used for any dao',
      'Development',
      1641342727,
      1651342727,
      10000000,
      300
    );
    await nftCollection.toggleCurrencyAllowance(testToken.address);
    await nftCollection.changeBuyingConditions(
      ethers.constants.Zero,
      testToken.address,
      ethers.constants.One,
      ethers.constants.AddressZero,
      true
    );
    await expect(nftCollection.connect(buyer).buy(ethers.constants.Zero)).to.be.revertedWith(
      'ERC20: transfer amount exceeds balance'
    );
  });

  it('Should revert the transaction if someone is trying to buy his own token', async () => {
    await nftCollection.mint(
      'One dev hour v1',
      'One development hour to be used for any dao',
      'Development',
      1641342727,
      1651342727,
      10000000,
      300
    );
    await nftCollection.toggleCurrencyAllowance(testToken.address);
    await nftCollection.changeBuyingConditions(
      ethers.constants.Zero,
      testToken.address,
      ethers.constants.One,
      ethers.constants.AddressZero,
      true
    );
    await expect(nftCollection.buy(ethers.constants.Zero)).to.be.revertedWith(
      `CanNotBuyYourOwnToken("${minter.address}", 0)`
    );
  });

  it('Should buy a token from someone if you have enough funds', async () => {
    await nftCollection.mint(
      'One dev hour v1',
      'One development hour to be used for any dao',
      'Development',
      1641342727,
      1651342727,
      10000000,
      300
    );
    await nftCollection.toggleCurrencyAllowance(testToken.address);
    await nftCollection.changeBuyingConditions(
      ethers.constants.Zero,
      testToken.address,
      ethers.constants.One,
      ethers.constants.AddressZero,
      true
    );
    await testToken.connect(buyer).mint(ethers.BigNumber.from(100));
    await testToken
      .connect(buyer)
      .increaseAllowance(nftCollection.address, ethers.BigNumber.from(100));
    await nftCollection.connect(buyer).buy(ethers.constants.Zero);
    expect(await testToken.balanceOf(buyer.address)).to.equal(ethers.BigNumber.from(99));
    expect(await testToken.balanceOf(minter.address)).to.equal(ethers.constants.One);
    expect(await nftCollection.ownerOf(ethers.constants.Zero)).to.equal(buyer.address);
  });

  it('Should buy a token from someone if you are the whitelisted buyer', async () => {
    await nftCollection.mint(
      'One dev hour v1',
      'One development hour to be used for any dao',
      'Development',
      1641342727,
      1651342727,
      10000000,
      300
    );
    await nftCollection.toggleCurrencyAllowance(testToken.address);
    await nftCollection.changeBuyingConditions(
      ethers.constants.Zero,
      testToken.address,
      ethers.constants.One,
      buyer.address,
      true
    );
    await testToken.connect(buyer).mint(ethers.BigNumber.from(100));
    await testToken
      .connect(buyer)
      .increaseAllowance(nftCollection.address, ethers.BigNumber.from(100));
    await nftCollection.connect(buyer).buy(ethers.constants.Zero);
    expect(await testToken.balanceOf(buyer.address)).to.equal(ethers.BigNumber.from(99));
    expect(await testToken.balanceOf(minter.address)).to.equal(ethers.constants.One);
    expect(await nftCollection.ownerOf(ethers.constants.Zero)).to.equal(buyer.address);
  });

  it('Should revert the token buy if you are not the whitelisted buyer', async () => {
    await nftCollection.mint(
      'One dev hour v1',
      'One development hour to be used for any dao',
      'Development',
      1641342727,
      1651342727,
      10000000,
      300
    );
    await nftCollection.toggleCurrencyAllowance(testToken.address);
    await nftCollection.changeBuyingConditions(
      ethers.constants.Zero,
      testToken.address,
      ethers.constants.One,
      minter.address,
      true
    );
    await testToken.connect(buyer).mint(ethers.BigNumber.from(100));
    await testToken
      .connect(buyer)
      .increaseAllowance(nftCollection.address, ethers.BigNumber.from(100));

    await expect(nftCollection.connect(buyer).buy(ethers.constants.Zero)).to.be.revertedWith(
      `UnauthorizedBuyer("${buyer.address}", 0)`
    );
  });

  it('Should buy a token and give royalties to the minter', async () => {
    await nftCollection.connect(owner).toggleCurrencyAllowance(testToken.address);
    await nftCollection
      .connect(minter)
      .mint(
        'One dev hour v1',
        'One development hour to be used for any dao',
        'Development',
        1641342727,
        1651342727,
        10000000,
        1000
      );
    await nftCollection
      .connect(minter)
      .transferFrom(minter.address, otherAccount.address, ethers.constants.Zero);
    await nftCollection
      .connect(otherAccount)
      .changeBuyingConditions(
        ethers.constants.Zero,
        testToken.address,
        ethers.BigNumber.from(100),
        ethers.constants.AddressZero,
        true
      );
    await testToken.connect(buyer).mint(ethers.BigNumber.from(100));
    await testToken
      .connect(buyer)
      .increaseAllowance(nftCollection.address, ethers.BigNumber.from(100));
    await nftCollection.connect(buyer).buy(ethers.constants.Zero);
    expect(await testToken.balanceOf(buyer.address)).to.equal(ethers.constants.Zero);
    expect(await testToken.balanceOf(minter.address)).to.equal(ethers.BigNumber.from(10));
    expect(await testToken.balanceOf(otherAccount.address)).to.equal(ethers.BigNumber.from(90));
    expect(await nftCollection.ownerOf(ethers.constants.Zero)).to.equal(buyer.address);
  });

  describe('transfer', () => {
    it('Should revert transfer of nonexistent token', async () => {
      await expect(nftCollection.connect(minter).transfer(buyer.address, 999)).to.be.revertedWith("ERC721: operator query for nonexistent token");
      await expect(nftCollection.connect(minter).safeTransfer(buyer.address, 999)).to.be.revertedWith("ERC721: operator query for nonexistent token");
    });
    it('Should revert transfer of not your token', async () => {
      await nftCollection
        .connect(minter)
        .mint(
          'One dev hour v1',
          'One development hour to be used for any dao',
          'Development',
          1641342727,
          1651342727,
          10000000,
          1000
        );
      await expect(nftCollection.connect(buyer).transfer(buyer.address, 0)).to.be.revertedWith("ERC721: transfer caller is not owner nor approved");
      await expect(nftCollection.connect(buyer).safeTransfer(buyer.address, 0)).to.be.revertedWith("ERC721: transfer caller is not owner nor approved");
    });
    it('Should transfer tokens', async () => {
      await nftCollection
        .connect(minter)
        .mint(
          'One dev hour v1',
          'One development hour to be used for any dao',
          'Development',
          1641342727,
          1651342727,
          10000000,
          1000
        );
      expect(await nftCollection.ownerOf(0)).eq(minter.address);
      await nftCollection.connect(minter).transfer(buyer.address, 0);
      expect(await nftCollection.ownerOf(0)).eq(buyer.address);
      await nftCollection.connect(buyer).safeTransfer(minter.address, 0);
      expect(await nftCollection.ownerOf(0)).eq(minter.address);
    });
  });

  describe('permit', () => {
    let tokenID = 0;
    const chainId = 31337;
    const provider = waffle.provider;
    const deadline = ethers.constants.MaxUint256;

    beforeEach(async () => {
      await nftCollection.connect(minter).mint('One dev hour v1','One development hour to be used for any dao','Development',1641342727,1651342727,10000000,1000);
      await nftCollection.connect(minter).mint('One dev hour v1','One development hour to be used for any dao','Development',1641342727,1651342727,10000000,1000);
    });
    it("has a permit typehash", async function () {
      // constant across deployments
      let typehash = await nftCollection.PERMIT_TYPEHASH();
      expect(typehash).to.eq("0x137406564cdcf9b40b1700502a9241e87476728da7ae3d0edfcf0541e5b49b3e");
    });
    it("has a domain seperator", async function () {
      // changes across deployments
      let seperator1 = await nftCollection.DOMAIN_SEPARATOR();
      let seperator2 = getDomainSeparator('Non Fungible Time', nftCollection.address, chainId);
      expect(seperator1).to.eq(seperator2);
    });
    it("has a nonce", async function () {
      expect(await nftCollection.nonces(tokenID)).to.equal(0);
    });
    it("cannot permit non existant token", async function () {
      const { v, r, s } = await getErc721PermitSignature(minter, nftCollection, buyer.address, 999);
      await expect(nftCollection.permit(buyer.address, 999, deadline, v, r, s)).to.be.revertedWith("query for nonexistent token");
    });
    it("cannot permit past deadline", async function () {
      // get current timestamp
      await provider.send("evm_mine", []);
      let timestamp = (await provider.getBlock("latest")).timestamp;
      // next block timestamp = prev block timestamp + 1
      const { v, r, s } = await getErc721PermitSignature(minter, nftCollection, buyer.address, tokenID, timestamp);
      await expect(nftCollection.permit(buyer.address, tokenID, timestamp, v, r, s)).to.be.revertedWith("permit expired");
    });
    it("cannot permit to self", async function () {
      const { v, r, s } = await getErc721PermitSignature(minter, nftCollection, minter.address, tokenID);
      await expect(nftCollection.permit(minter.address, tokenID, deadline, v, r, s)).to.be.revertedWith("cannot permit to self");
    });
    it("cannot permit not your token", async function () {
      const { v, r, s } = await getErc721PermitSignature(buyer, nftCollection, buyer.address, tokenID);
      await expect(nftCollection.connect(buyer).permit(buyer.address, tokenID, deadline, v, r, s)).to.be.revertedWith("unauthorized");
    });
    it("cannot use signature for another contract", async function () {
      // new contract and nft
      const NftCollectionFactory = await ethers.getContractFactory('NonFungibleTimeCollection');
      let nftCollection2 = await NftCollectionFactory.deploy();
      await nftCollection2.initialize('Non Fungible Time','NFTIME',false,svgGenerator.address,owner.address);
      await nftCollection2.connect(minter).mint('One dev hour v1','One development hour to be used for any dao','Development',1641342727,1651342727,10000000,1000);
      // permit
      const { v, r, s } = await getErc721PermitSignature(minter, nftCollection2, buyer.address, tokenID);
      await expect(nftCollection.permit(buyer.address, tokenID, deadline, v, r, s)).to.be.revertedWith("unauthorized");
    });
    it("should reject forged signatures", async function () {
      await expect(nftCollection.permit(buyer.address, tokenID, deadline, 27, "0x1234567890123456789012345678901234567890123456789012345678901234", "0x1234567890123456789012345678901234567890123456789012345678901234")).to.be.revertedWith("invalid signature");
    });
    it("should reject modified parameters", async function () {
      const { v, r, s } = await getErc721PermitSignature(minter, nftCollection, buyer.address, tokenID, deadline);
      await expect(nftCollection.permit(otherAccount.address, tokenID, deadline, v, r, s)).to.be.revertedWith("unauthorized");
      await expect(nftCollection.permit(buyer.address, 1, deadline, v, r, s)).to.be.revertedWith("unauthorized");
      await expect(nftCollection.permit(buyer.address, tokenID, deadline.sub(1), v, r, s)).to.be.revertedWith("unauthorized");
    });
    it("should permit EOA signatures", async function () {
      // permit
      const { v, r, s } = await getErc721PermitSignature(minter, nftCollection, buyer.address, tokenID);
      let tx = await nftCollection.permit(buyer.address, tokenID, deadline, v, r, s);
      await expect(tx).to.emit(nftCollection, "Approval").withArgs(minter.address, buyer.address, tokenID);
      // effects
      expect(await nftCollection.getApproved(tokenID)).to.equal(buyer.address);
      await nftCollection.connect(buyer).transferFrom(minter.address, buyer.address, tokenID);
      expect(await nftCollection.ownerOf(tokenID)).to.equal(buyer.address);
      expect(await nftCollection.nonces(tokenID)).to.equal(1);
    });
    it("should revert incorrect nonce", async function () {
      const { v, r, s } = await getErc721PermitSignature(minter, nftCollection, buyer.address, tokenID, deadline, 2);
      await expect(nftCollection.permit(buyer.address, tokenID, deadline, v, r, s)).to.be.revertedWith("unauthorized");
    });
  });
});
