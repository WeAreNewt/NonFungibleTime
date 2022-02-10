import { expect } from 'chai';
import { ethers } from 'hardhat';
import { NonFungibleTimeCollection } from '../typechain/NonFungibleTimeCollection.d';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { SvgGenerator, TestToken } from 'contracts/typechain';
import { BigNumber } from 'ethers';
import { InnerRingsSvgGenerator } from 'contracts/typechain/InnerRingsSvgGenerator';
import { OuterRingsSvgGenerator } from 'contracts/typechain/OuterRingsSvgGenerator';
import { MiddleRingsSvgGenerator } from 'contracts/typechain/MiddleRingsSvgGenerator';

describe('Tokenized time collection', () => {
  let nftCollection: NonFungibleTimeCollection;
  let outerRingsSvgGenerator: OuterRingsSvgGenerator;
  let middleRingsSvgGenerator: MiddleRingsSvgGenerator;
  let innerRingsSvgGenerator: InnerRingsSvgGenerator;
  let svgGenerator: SvgGenerator;
  let owner: SignerWithAddress;
  let newOwner: SignerWithAddress;
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
    [owner, otherAccount, buyer, newOwner] = await ethers.getSigners();
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
      'NonFungibleTimeCollection',
      'NFTIME',
      false,
      svgGenerator.address,
      owner.address
    );
    testToken = await TestTokenFactory.deploy();
  });

  it('Should initialize the Tokenized Time contract properly', async () => {
    expect(await nftCollection.name()).to.equal('NonFungibleTimeCollection');
    expect(await nftCollection.symbol()).to.equal('NFTIME');
    expect(await nftCollection.owner()).to.equal(owner.address);
    expect(await nftCollection.svgGenerator()).to.equal(svgGenerator.address);
    expect(await nftCollection.isCurrencyAllowed(ethers.constants.AddressZero)).to.be.false;
    const NftCollectionFactory = await ethers.getContractFactory('NonFungibleTimeCollection');
    const otherNftCollectionInstance = await NftCollectionFactory.deploy();
    otherNftCollectionInstance.initialize(
      'OtherNonFungibleTimeCollection',
      'OTHER',
      true,
      svgGenerator.address,
      otherAccount.address
    );
    expect(await otherNftCollectionInstance.name()).to.equal('OtherNonFungibleTimeCollection');
    expect(await otherNftCollectionInstance.symbol()).to.equal('OTHER');
    expect(await otherNftCollectionInstance.owner()).to.equal(otherAccount.address);
    expect(await nftCollection.svgGenerator()).to.equal(svgGenerator.address);
    expect(await otherNftCollectionInstance.isCurrencyAllowed(ethers.constants.AddressZero)).to.be
      .true;
  });

  it('Should mint a NFT with the correct metadata', async () => {
    expect(await nftCollection.totalMinted()).to.equal(0);
    expect(await nftCollection.totalSupply()).to.equal(0);
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
    expect(await nftCollection.totalMinted()).to.equal(1);
    expect(await nftCollection.totalSupply()).to.equal(1);
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

  it('Should revert when mint an NFT with royalty basis points parameter above the maximum basis points', async () => {
    const maxBasisPoints = 10000;
    const royaltyBasisPoints = maxBasisPoints + 1;
    await expect(
      nftCollection.mint(
        'One dev hour v1',
        'One development hour to be used for any dao',
        'Development',
        1641342727,
        1651342727,
        10000000,
        royaltyBasisPoints
      )
    ).to.be.revertedWith('InvalidRoyalty()');
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

  it('Should turn forSale false after being buyed', async () => {
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
    expect((await nftCollection.tokens(ethers.constants.Zero)).forSale).to.be.true;
    await testToken.connect(buyer).mint(ethers.BigNumber.from(100));
    await testToken
      .connect(buyer)
      .increaseAllowance(nftCollection.address, ethers.BigNumber.from(100));
    await nftCollection.connect(buyer).buy(ethers.constants.Zero);
    expect(await nftCollection.ownerOf(ethers.constants.Zero)).to.equal(buyer.address);
    expect((await nftCollection.tokens(ethers.constants.Zero)).forSale).to.be.false;
  });

  it('Should turn forSale false after being tranferred through transferFrom', async () => {
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
    expect((await nftCollection.tokens(ethers.constants.Zero)).forSale).to.be.true;
    await nftCollection.transferFrom(minter.address, otherAccount.address, ethers.constants.Zero);
    expect(await nftCollection.ownerOf(ethers.constants.Zero)).to.equal(otherAccount.address);
    expect((await nftCollection.tokens(ethers.constants.Zero)).forSale).to.be.false;
  });

  it('Should revert when trying to burn an unexistent token', async () => {
    await expect(nftCollection.burn(0)).to.be.revertedWith('TokenDoesNotExist(0)');
  });

  it('Should revert when trying to burn an token without being the owner of it', async () => {
    await nftCollection.mint(
      'One dev hour v1',
      'One development hour to be used for any dao',
      'Development',
      1641342727,
      1651342727,
      10000000,
      300
    );
    await expect(nftCollection.connect(otherAccount).burn(0)).to.be.revertedWith(
      'OnlyTokenOwner(0)'
    );
  });

  it('Should revert when calling ownerOf after being burned', async () => {
    await nftCollection.mint(
      'One dev hour v1',
      'One development hour to be used for any dao',
      'Development',
      1641342727,
      1651342727,
      10000000,
      300
    );
    expect(await nftCollection.ownerOf(0)).to.equal(minter.address);
    await nftCollection.burn(0);
    await expect(nftCollection.ownerOf(0)).to.be.revertedWith(
      'ERC721: owner query for nonexistent token'
    );
  });

  it('Should reduce totalSupply but not totalMinted after being burned', async () => {
    await nftCollection.mint(
      'One dev hour v1',
      'One development hour to be used for any dao',
      'Development',
      1641342727,
      1651342727,
      10000000,
      300
    );
    expect(await nftCollection.totalMinted()).to.equal(1);
    expect(await nftCollection.totalSupply()).to.equal(1);
    await nftCollection.burn(0);
    expect(await nftCollection.totalMinted()).to.equal(1);
    expect(await nftCollection.totalSupply()).to.equal(0);
  });

  it('Should return the correct royalty information when calling royaltyInfo', async () => {
    await nftCollection.mint(
      'One dev hour v1',
      'One development hour to be used for any dao',
      'Development',
      1641342727,
      1651342727,
      10000000,
      100
    );
    expect(await nftCollection.royaltyInfo(0, ethers.utils.parseEther('3'))).to.eql([
      minter.address,
      ethers.utils.parseEther('0.03'),
    ]);
  });

  it('Should return the correct royalty information after changing royalty receiver', async () => {
    await nftCollection.mint(
      'One dev hour v1',
      'One development hour to be used for any dao',
      'Development',
      1641342727,
      1651342727,
      10000000,
      100
    );
    await nftCollection.changeRoyaltyReceiver(0, otherAccount.address);
    expect(await nftCollection.royaltyInfo(0, ethers.utils.parseEther('3'))).to.eql([
      otherAccount.address,
      ethers.utils.parseEther('0.03'),
    ]);
  });

  it('Should revert when calling changeRoyaltyReceiver for an nonexistent token', async () => {
    await expect(nftCollection.changeRoyaltyReceiver(0, otherAccount.address)).to.be.revertedWith(
      'TokenDoesNotExist(0)'
    );
  });

  it('Should revert when calling changeRoyaltyReceiver from an address different than current receiver', async () => {
    await nftCollection.mint(
      'One dev hour v1',
      'One development hour to be used for any dao',
      'Development',
      1641342727,
      1651342727,
      10000000,
      100
    );
    await nftCollection.changeRoyaltyReceiver(0, otherAccount.address);
    await nftCollection.transferFrom(minter.address, newOwner.address, 0);
    await expect(
      nftCollection.connect(newOwner).changeRoyaltyReceiver(0, newOwner.address)
    ).to.be.revertedWith('OnlyCurrentRoyaltyReceiver(0)');
    await expect(
      nftCollection.connect(minter).changeRoyaltyReceiver(0, minter.address)
    ).to.be.revertedWith('OnlyCurrentRoyaltyReceiver(0)');
  });

  it('Should revert when trying to buy a token that was listed with a currency that now is unallowed', async () => {
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
      0,
      testToken.address,
      ethers.constants.One,
      ethers.constants.AddressZero,
      true
    );
    await nftCollection.toggleCurrencyAllowance(testToken.address);
    await expect(nftCollection.connect(buyer).buy(ethers.constants.Zero)).to.be.revertedWith(
      `UnallowedCurrency(0, "${testToken.address}")`
    );
  });

  it('Should revert when trying to buy a token without enough funds using native currency', async () => {
    await nftCollection.mint(
      'One dev hour v1',
      'One development hour to be used for any dao',
      'Development',
      1641342727,
      1651342727,
      10000000,
      300
    );
    await nftCollection.toggleCurrencyAllowance(ethers.constants.AddressZero);
    await nftCollection.changeBuyingConditions(
      0,
      ethers.constants.AddressZero,
      ethers.utils.parseEther('3'),
      ethers.constants.AddressZero,
      true
    );
    await expect(
      nftCollection
        .connect(buyer)
        .buy(ethers.constants.Zero, { value: ethers.utils.parseEther('1') })
    ).to.be.revertedWith('TransferFailed()');
  });

  it('Should buy token when native currency', async () => {
    const price = ethers.utils.parseEther('3');
    await nftCollection.mint(
      'One dev hour v1',
      'One development hour to be used for any dao',
      'Development',
      1641342727,
      1651342727,
      10000000,
      300
    );
    await nftCollection.toggleCurrencyAllowance(ethers.constants.AddressZero);
    await nftCollection.changeBuyingConditions(
      0,
      ethers.constants.AddressZero,
      price,
      ethers.constants.AddressZero,
      true
    );
    await nftCollection.connect(buyer).buy(ethers.constants.Zero, { value: price });
    expect(await nftCollection.ownerOf(0)).to.equal(buyer.address);
  });

  it('Should return new SVG generator address after calling setSvgGenerator', async () => {
    expect(await nftCollection.svgGenerator()).to.equal(svgGenerator.address);
    await nftCollection.setSvgGenerator(innerRingsSvgGenerator.address);
    expect(await nftCollection.svgGenerator()).to.equal(innerRingsSvgGenerator.address);
  });

  it('Should support EIP-165 Standard Interface Detection interface', async () => {
    const eip165InterfaceId = '0x01ffc9a7';
    expect(await nftCollection.supportsInterface(eip165InterfaceId)).to.be.true;
  });

  it('Should support EIP-2981 NFT Royalty Standard interface', async () => {
    const eip2981InterfaceId = '0x2a55205a';
    expect(await nftCollection.supportsInterface(eip2981InterfaceId)).to.be.true;
  });

  it('Should support EIP-165 Standard Interface Detection interface', async () => {
    const eip165InterfaceId = '0x01ffc9a7';
    expect(await nftCollection.supportsInterface(eip165InterfaceId)).to.be.true;
  });

  it('Should match expected tokenURI', async () => {
    await nftCollection.mint(
      'One dev hour v1',
      'One development hour to be used for any dao',
      'Development',
      1641342727,
      1651342727,
      10000000,
      300
    );
    const expectedTokenURIHash =
      '0xe354196f81fab3ae7c34adba410cfbf3c96f8ece0fe16ae1c1dc5969331d3a28';
    const tokenURIHash = ethers.utils.hashMessage(await nftCollection.tokenURI(0));
    expect(tokenURIHash).to.be.equal(expectedTokenURIHash);
  });

  it('Should match expected tokenURI after being put for sale', async () => {
    await nftCollection.mint(
      'One dev hour v1',
      'One development hour to be used for any dao',
      'Development',
      1641342727,
      1651342727,
      10000000,
      300
    );
    await nftCollection.toggleCurrencyAllowance(ethers.constants.AddressZero);
    await nftCollection.changeBuyingConditions(
      0,
      ethers.constants.AddressZero,
      ethers.utils.parseEther('3'),
      ethers.constants.AddressZero,
      true
    );
    const expectedTokenURIHash =
      '0x735ea356d7ef31ce778dbb45f5f1d0ccc155ce62f19723c8f4af9db34cd4f026';
    const tokenURIHash = ethers.utils.hashMessage(await nftCollection.tokenURI(0));
    expect(tokenURIHash).to.be.equal(expectedTokenURIHash);
  });

  it('Should match expected tokenURI after redemption', async () => {
    await nftCollection.mint(
      'One dev hour v1',
      'One development hour to be used for any dao',
      'Development',
      1641342727,
      1651342727,
      10000000,
      300
    );
    await nftCollection.redeem(0);
    const expectedTokenURIHash =
      '0xe56979b77cea4407a8cece0cd8d1b45a9f220a3a5967b27639fcb6bf51af27bd';
    const tokenURIHash = ethers.utils.hashMessage(await nftCollection.tokenURI(0));
    expect(tokenURIHash).to.be.equal(expectedTokenURIHash);
  });
});
