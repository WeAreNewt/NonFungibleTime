import { Input } from '../Forms';

export enum Search {
  Owner = 'Owner',
  Creator = 'Creator',
}

type SearchFilterProps = {
  onChange: (value: string) => void;
  selected: string;
  searchType: Search;
  error: string | undefined;
};

const searchPlaceholder = (search: Search) => {
  if (search === Search.Creator) {
    return 'Creator Address';
  } else if (search === Search.Owner) {
    return 'Owner Address';
  } else {
    return '';
  }
};

export default function SearchFilter({ onChange, searchType, selected, error }: SearchFilterProps) {
  return (
    <div className="flex flex-row text-center">
      <div className="w-full">
        <Input
          type="text"
          name="search"
          id="searchText"
          placeholder={searchPlaceholder(searchType)}
          value={selected}
          min={0}
          className="text-black w-full"
          onChange={(e) => {
            onChange(e.target.value);
          }}
        />
        {error && <div className="text-center text-red-500 text-xs">{error}</div>}
      </div>
    </div>
  );
}
