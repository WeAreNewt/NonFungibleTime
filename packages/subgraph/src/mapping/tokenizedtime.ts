import {
  CurrencyAllowanceToggled,
  OwnershipTransferred,
  TokenBought,
  TokenForSaleToggled,
  TokenPriceChanged,
  Transfer,
} from '../../generated/TimeCollection/TimeCollection';

export function handleTokenBought(event: TokenBought): void {}
export function handleTokenPriceChanged(event: TokenPriceChanged): void {}
export function handleTokenForSaleToggled(event: TokenForSaleToggled): void {}
export function handleCurrencyAllowanceToggled(event: CurrencyAllowanceToggled): void {}
export function handleTransfer(event: Transfer): void {}
export function handleOwnershipTransferred(event: OwnershipTransferred): void {}
