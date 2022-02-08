import makeBlockie from 'ethereum-blockies-base64';
import { formatEthAddress } from '../../lib/helpers/format';

export type UserDetailsProps = {
  avatarUrl?: string;
  ensName?: string;
  address: string;
  caption: string;
};

export function UserDetail({ address, ensName, caption }: UserDetailsProps) {
  return (
    <div className="flex gap-2 items-center">
      <div className="rounded-full bg-slate-400 w-9 h-9">
        <img src={makeBlockie(address)} className="rounded-full" alt="blockie or ens avatar" />
      </div>
      <div className="flex flex-col">
        <div className="text-gray-800 dark:text-white leading-5 text-sm">
          {' '}
          {ensName ? ensName : formatEthAddress(address)}
        </div>
        <div className="text-gray-500 leading-5 text-sm">{caption}</div>
      </div>
    </div>
  );
}
