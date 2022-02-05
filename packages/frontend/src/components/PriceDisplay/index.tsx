import { formatUnits } from '@ethersproject/units';
import { PaymentToken } from '../../lib/graphql';

export type PriceDisplayProps = {
  amount: number | string;
  currency: PaymentToken;
};

export function PriceDisplay({ amount, currency }: PriceDisplayProps) {
  const priceFixed = formatUnits(String(amount), currency.decimals);

  return (
    <div className=" dark:text-white text-lg leading-7 font-semibold text-gray-900">
      {`${priceFixed} ${currency.symbol}`}
    </div>
  );
}
