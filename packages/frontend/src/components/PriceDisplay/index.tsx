import { formatUnits } from '@ethersproject/units';
import { PaymentToken } from '../../lib/graphql';

export type PriceDisplayProps = {
  amount: number | string;
  token: PaymentToken;
};

export function PriceDisplay({ amount, token }: PriceDisplayProps) {
  const priceFixed = formatUnits(String(amount), token.decimals);

  return (
    <div className=" dark:text-white text-lg leading-7 font-semibold text-gray-900">
      {`${priceFixed} ${token.symbol}`}
    </div>
  );
}
