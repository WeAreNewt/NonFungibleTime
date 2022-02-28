import { formatUnits } from '@ethersproject/units';
import { PaymentToken } from '../../lib/graphql';
import { TokenIcon } from '@aave/aave-ui-kit';

export type PriceDisplayProps = {
  amount: number | string;
  token: PaymentToken;
};

export function PriceDisplay({ amount, token }: PriceDisplayProps) {
  const priceFixed = formatUnits(String(amount), token.decimals);

  return (
    <div className=" dark:text-white text-lg leading-7 font-semibold text-gray-900">
      {`${priceFixed} ${token.symbol}`}
      <TokenIcon
        className="inline-block align-middle pl-2 pb-1"
        tokenSymbol={token.symbol}
        width={20}
        height={20}
      />
    </div>
  );
}
