import {
  CurrencyAllowanceToggled,
  TimeCollection,
  TokenBought,
  TokenBuyingConditionsChanged,
  TokenRedeemed,
  Transfer,
  TokenRoyaltyReceiverChanged,
  SvgGeneratorSet,
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
import { ethereum, log, BigInt, dataSource, Address } from '@graphprotocol/graph-ts';
import { ERC721 } from '../../generated/TimeCollection/ERC721';
import { ERC20 } from '../../generated/TimeCollection/ERC20';

export function getTokenURI(event: ethereum.Event, tokenId: BigInt): string {
  const erc721 = ERC721.bind(event.address);
  const tokenURICallResult = erc721.try_tokenURI(tokenId);

  let tokenURI = '';

  if (tokenURICallResult.reverted) {
    log.warning('tokenURI reverted for tokenID: {} contract: {}', [
      tokenId.toString(),
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
  const nft = Nft.load(event.params.tokenId.toString());
  const BASIS_POINTS = 10000;
  if (!token.reverted && nft) {
    const purchase = new Sale(event.transaction.hash.toHexString() + '-sale');
    purchase.txHash = event.transaction.hash.toHexString();
    purchase.nft = event.params.tokenId.toString();
    purchase.timestamp = event.block.timestamp;
    purchase.blockNumber = event.block.number;
    const to = event.params.buyer.toHexString();
    const from = event.params.seller.toHexString();
    const toUser = User.load(to);
    if (!toUser) {
      const user = new User(to);
      user.save();
    }
    purchase.to = to;
    purchase.from = from;
    purchase.price = nftParams.value3;
    purchase.currency = nftParams.value7.toHexString();
    purchase.royaltyAccrued = nftParams.value4
      .times(nftParams.value3)
      .div(BigInt.fromI32(BASIS_POINTS));
    purchase.royaltyReceiver = nftParams.value6.toHexString();
    purchase.save();
    // Only setting `lastPurchaseTimestamp` here; `tokenURI`, `owner` and `forSale` updated when handling Transfer event
    nft.lastPurchaseTimestamp = event.block.timestamp.toI32();
    nft.save();
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
    nft.allowedBuyer = event.params.allowedBuyer.toHexString();
    if (nft.forSale != event.params.forSale) {
      const uri = getTokenURI(event, event.params.tokenId);
      nft.tokenURI = uri;
      nft.forSale = event.params.forSale;
    }
    nft.save();
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
    const nft = Nft.load(event.params.tokenId.toString());
    if (nft) {
      const uri = getTokenURI(event, event.params.tokenId);
      nft.tokenURI = uri;
      nft.redeemed = true;
      nft.save();
    } else {
      log.warning('Token redeem for nft unregistered to subgraph {}', [
        event.params.tokenId.toString(),
      ]);
    }
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
    paymentToken.acceptable = !paymentToken.acceptable;
    paymentToken.save();
  } else if (event.params.currency == Address.zero()) {
    const network = dataSource.network();
    // === does not work for string comparison
    // eslint-disable-next-line eqeqeq
    if (network == 'mumbai' || network == 'polygon') {
      const nativeCurrency = new PaymentToken(event.params.currency.toHexString());
      nativeCurrency.symbol = 'MATIC';
      nativeCurrency.decimals = 18;
      nativeCurrency.acceptable = true;
      nativeCurrency.save();
    } else {
      log.warning(`Event from unexpected network {}`, [network]);
    }
  } else {
    const newPaymentToken = new PaymentToken(event.params.currency.toHexString());
    newPaymentToken.acceptable = true;
    const contract = ERC20.bind(event.params.currency);
    const decimals = contract.try_decimals();
    if (!decimals.reverted) {
      newPaymentToken.decimals = decimals.value;
    } else {
      log.warning(`Failed to fetch decimals for payment currency {}`, [
        event.params.currency.toHexString(),
      ]);
    }
    const symbol = contract.try_symbol();
    if (!symbol.reverted) {
      newPaymentToken.symbol = symbol.value;
    } else {
      log.warning(`Failed to fetch symbol for payment currency {}`, [
        event.params.currency.toHexString(),
      ]);
    }
    newPaymentToken.save();
  }
}

export function handleTransfer(event: Transfer): void {
  const tokenId = event.params.tokenId.toString();
  const transfer = new TransferEvent(event.transaction.hash.toHexString() + '-transfer');
  transfer.txHash = event.transaction.hash.toHexString();
  transfer.nft = tokenId;
  transfer.timestamp = event.block.timestamp;
  transfer.blockNumber = event.block.number;
  const from = event.params.from.toHexString();
  const to = event.params.to.toHexString();
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
      nft.royaltyReceiver = values.value6.toHexString();
      nft.currency = values.value7.toHexString();
      nft.allowedBuyer = values.value8.toHexString();
      nft.redeemed = values.value9;
      nft.forSale = values.value10;
      nft.name = values.value11;
      nft.description = values.value12;
      nft.category = values.value13;
      nft.tokenId = event.params.tokenId;
      const uri = getTokenURI(event, event.params.tokenId);
      nft.tokenURI = uri;
      nft.contractAddress = event.address.toHexString();
      nft.owner = to;
      nft.mintTimestamp = event.block.timestamp.toI32();
      nft.save();
    } else {
      log.warning(`Token transfer event for non-existant tokenId {}`, [
        event.params.tokenId.toString(),
      ]);
    }
  } else {
    nft.owner = to;
    nft.forSale = false;
    const uri = getTokenURI(event, event.params.tokenId);
    nft.tokenURI = uri;
    nft.save();
  }
}

export function handleSvgGeneratorSet(event: SvgGeneratorSet): void {
  const contract = TimeCollection.bind(event.address);
  const totalMintedCall = contract.try_totalMinted();
  if (!totalMintedCall.reverted) {
    const totalMinted = totalMintedCall.value.toI32();
    for (let i = 0; i < totalMinted; i++) {
      const nft = Nft.load(i.toString());
      if (nft && nft.owner !== '0x0000000000000000000000000000000000000000') {
        const uri = getTokenURI(event, BigInt.fromI32(i));
        nft.tokenURI = uri;
        nft.save();
      }
    }
  }
}

export function handleTokenRoyaltyReceiverChanged(event: TokenRoyaltyReceiverChanged): void {
  const tokenId = event.params.tokenId.toString();
  const nft = Nft.load(tokenId);
  if (nft) {
    nft.royaltyReceiver = event.params.royaltyReceiver.toHexString();
    nft.save();
  } else {
    log.warning(`Token royalty receiver changed event for non-existant tokenId {}`, [
      event.params.tokenId.toString(),
    ]);
  }
}
