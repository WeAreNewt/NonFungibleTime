import {
  CurrencyAllowanceToggled,
  TimeCollection,
  TokenBought,
  TokenBuyingConditionsChanged,
  TokenRedeemed,
  Transfer,
} from '../../generated/TimeCollection/TimeCollection';
import {
  BuyingConditionChange,
  Nft,
  PaymentToken,
  Redeem,
  Sale,
  Transfer as TransferEvent,
  User,
} from '../../generated/schema';
import { Address, log } from '@graphprotocol/graph-ts';
import { ERC721 } from '../../generated/TimeCollection/ERC721';
import { ERC20 } from '../../generated/TimeCollection/ERC20';

export function getTokenURI(event: Transfer): string {
  const erc721 = ERC721.bind(event.address);
  const tokenURICallResult = erc721.try_tokenURI(event.params.tokenId);

  let tokenURI = '';

  if (tokenURICallResult.reverted) {
    log.warning('tokenURI reverted for tokenID: {} contract: {}', [
      event.params.tokenId.toString(),
      event.address.toHexString(),
    ]);
  } else {
    tokenURI = tokenURICallResult.value;
  }

  return tokenURI;
}

export function handleTokenBought(event: TokenBought): void {
  const contract = TimeCollection.bind(event.address);
  const token = contract.try_tokens(event.params.tokenId);
  const nftParams = token.value;
  if (!token.reverted) {
    const purchase = new Sale(event.transaction.hash.toHexString() + '-sale');
    purchase.txHash = event.transaction.hash.toHexString();
    purchase.nft = event.params.tokenId.toString();
    purchase.timestamp = event.block.timestamp;
    purchase.blockNumber = event.block.number;
    const toEvent = event.transaction.to;
    const to: string = toEvent ? toEvent.toHex() : Address.zero().toHex();
    const from = event.transaction.from.toHex();
    const toUser = User.load(to);
    if (!toUser) {
      const user = new User(to);
      user.save();
    }
    purchase.to = to;
    purchase.from = from;
    purchase.price = nftParams.value3;
    purchase.currency = nftParams.value6.toHexString();
    purchase.royaltyAccrued = nftParams.value4.times(nftParams.value3);
    purchase.save();
  } else {
    log.warning(`Token purchase event for non-existant tokenId {}`, [
      event.params.tokenId.toString(),
    ]);
  }
}

export function handleTokenBuyingConditionsChanged(event: TokenBuyingConditionsChanged): void {
  const buyingConditionChange = new BuyingConditionChange(
    event.transaction.hash.toHexString() + '-conditionChange'
  );
  buyingConditionChange.nft = event.params.tokenId.toString();
  buyingConditionChange.txHash = event.transaction.hash.toHexString();
  buyingConditionChange.timestamp = event.block.timestamp;
  buyingConditionChange.blockNumber = event.block.number;
  const nft = Nft.load(event.params.tokenId.toString());
  if (nft) {
    nft.price = event.params.price;
    nft.currency = event.params.currency.toHexString();
    nft.forSale = event.params.forSale;
    nft.allowedBuyer = event.params.allowedBuyer.toHexString();
  } else {
    log.warning(`Buying condition update for non-existant tokenId {}`, [
      event.params.tokenId.toString(),
    ]);
  }
  buyingConditionChange.currency = event.params.currency.toHexString();
  buyingConditionChange.price = event.params.price;
  buyingConditionChange.forSale = event.params.forSale;
  buyingConditionChange.allowedBuyer = event.params.allowedBuyer.toHexString();
  const from = event.transaction.from ? event.transaction.from.toHexString() : '';
  buyingConditionChange.owner = from;
  buyingConditionChange.save();
}

export function handleTokenRedeemed(event: TokenRedeemed): void {
  const contract = TimeCollection.bind(event.address);
  const token = contract.try_tokens(event.params.tokenId);
  const nftParams = token.value;
  if (!token.reverted) {
    const redeemed = new Redeem(event.transaction.hash.toHexString() + '-redeem');
    redeemed.txHash = event.transaction.hash.toHexString();
    redeemed.nft = event.params.tokenId.toString();
    redeemed.timestamp = event.block.timestamp;
    redeemed.blockNumber = event.block.number;
    const from = event.transaction.from ? event.transaction.from.toHexString() : '';
    redeemed.redeemedBy = from;
    redeemed.creator = nftParams.value5.toHexString();
    redeemed.save();
  } else {
    log.warning(`Token redeem event for non-existant tokenId {}`, [
      event.params.tokenId.toString(),
    ]);
  }
}

export function handleCurrencyAllowanceToggled(event: CurrencyAllowanceToggled): void {
  const paymentToken = PaymentToken.load(event.params.currency.toHexString());
  if (paymentToken) {
    paymentToken.acceptable = false;
    paymentToken.save();
  } else {
    const token = new PaymentToken(event.params.currency.toHexString());
    const contract = ERC20.bind(event.address);
    const decimals = contract.try_decimals();
    if (!decimals.reverted) {
      token.decimals = decimals.value;
    }
    log.warning(`Failed to fetch decimals for payment currency {}`, [
      event.params.currency.toHexString(),
    ]);
    token.save();
  }
}

export function handleTransfer(event: Transfer): void {
  const tokenId = event.params.tokenId.toString();
  const transfer = new TransferEvent(event.transaction.hash.toHexString() + '-transfer');
  transfer.txHash = event.transaction.hash.toHexString();
  transfer.nft = tokenId;
  transfer.timestamp = event.block.timestamp;
  transfer.blockNumber = event.block.number;
  const from = event.params.from.toHex();
  const to = event.params.to.toHex();
  const toUser = User.load(to);
  if (!toUser) {
    const user = new User(to);
    user.save();
  }
  const fromUser = User.load(from);
  if (!fromUser) {
    const user = new User(from);
    user.save();
  }
  transfer.to = to;
  transfer.from = from;
  transfer.save();
  const nft = Nft.load(tokenId);
  if (!nft) {
    const nft = new Nft(tokenId);
    const contract = TimeCollection.bind(event.address);
    const token = contract.try_tokens(event.params.tokenId);
    if (!token.reverted) {
      const values = token.value;
      nft.availabilityFrom = values.value0;
      nft.availabilityTo = values.value1;
      nft.duration = values.value2;
      nft.price = values.value3;
      nft.royaltyBasisPoints = values.value4;
      nft.creator = values.value5.toHexString();
      nft.currency = values.value6.toHexString();
      nft.allowedBuyer = values.value7.toHexString();
      nft.redeemed = values.value8;
      nft.forSale = values.value9;
      nft.name = values.value10;
      nft.description = values.value11;
      nft.work = values.value12;
      nft.tokenId = event.params.tokenId;
      const uri = getTokenURI(event);
      nft.tokenURI = uri;
      nft.contractAddress = event.address.toHexString();
      nft.owner = to;
      nft.save();
    } else {
      log.warning(`Token transfer event for non-existant tokenId {}`, [
        event.params.tokenId.toString(),
      ]);
    }
  } else {
    nft.owner = to;
    nft.save();
  }
}
