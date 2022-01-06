import {
  CurrencyAllowanceToggled,
  TimeCollection,
  TokenBought,
  TokenBuyingConditionsChanged,
  TokenRedeemed,
  Transfer,
} from '../../generated/TimeCollection/TimeCollection';
import { NFT, Transfer as TransferEvent } from '../../generated/schema';
import { log } from '@graphprotocol/graph-ts';
import { ERC721 } from '../../generated/TimeCollection/ERC721';

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

export function handleTokenBought(event: TokenBought): void {}

export function handleTokenBuyingConditions(event: TokenBuyingConditionsChanged): void {}

export function handleTokenRedeemed(event: TokenRedeemed): void {}

export function handleCurrencyAllowanceToggled(event: CurrencyAllowanceToggled): void {}

export function handleTransfer(event: Transfer): void {
  const tokenId = event.params.tokenId.toString();
  const transfer = new TransferEvent(event.transaction.hash.toString());
  const to = event.transaction.to ? event.transaction.to.toString() : '';
  const from = event.transaction.from ? event.transaction.from.toString() : '';
  transfer.nft = tokenId;
  transfer.timestamp = event.block.timestamp;
  transfer.blockNumber = event.block.number;
  transfer.to = to;
  transfer.from = from;
  transfer.save();
  const nft = NFT.load(tokenId);
  if (!nft) {
    const nft = new NFT(tokenId);
    const contract = TimeCollection.bind(event.address);
    const token = contract.try_tokens(event.params.tokenId);
    if (!token.reverted) {
      const values = token.value;
      nft.availabilityFrom = values.value0;
      nft.availabilityTo = values.value1;
      nft.duration = values.value2;
      nft.price = values.value3;
      nft.royaltyBasisPoints = values.value4;
      nft.creator = values.value5.toString();
      nft.currency = values.value6.toString();
      nft.redeemed = values.value7;
      nft.forSale = values.value8;
      nft.name = values.value9;
      nft.description = values.value10;
      nft.work = values.value11;
      nft.tokenId = event.params.tokenId;
      const uri = getTokenURI(event);
      nft.tokenURI = uri;
      nft.contractAddress = event.address.toString();
      nft.owner = to;
      nft.save();
    }
  }
}
