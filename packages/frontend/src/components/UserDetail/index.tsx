export type UserDetailsProps = {
  avatarUrl?: string;
  // Name might be the wallet address or ENS name
  name: string;
  caption: string;
};

export function UserDetail({ avatarUrl, name, caption }: UserDetailsProps) {
  return (
    <div className="flex gap-2 items-center">
      <div className="rounded-full bg-slate-400 w-9 h-9">{/* TODO: use avatarUrl */}</div>
      <div className="flex flex-col">
        <div className="text-gray-800 leading-5 text-sm"> {name}</div>
        <div className="text-gray-500 leading-5 text-sm">{caption}</div>
      </div>
    </div>
  );
}
