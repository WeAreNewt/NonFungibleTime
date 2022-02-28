import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import classNames from 'classnames';
import { Fragment } from 'react';

export enum ToggleState {
  All = 'Show All',
  Yes = 'Yes',
  No = 'No',
}

type ListOptionProps = {
  label: string;
  value: string;
};

export const ListOption = ({ label, value }: ListOptionProps) => {
  return (
    <Listbox.Option
      className={({ active }) =>
        classNames(`cursor-default select-none relative py-2 pl-10 pr-4`, {
          'text-indigo-900 bg-indigo-100': active,
          'text-gray-900': !active,
        })
      }
      value={value}
    >
      {({ selected }) => (
        <>
          <span
            className={classNames('block truncate', {
              'font-medium': selected,
              'font-normal': !selected,
            })}
          >
            {label}
          </span>
          {selected ? (
            <span
              className={classNames(
                `absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600`
              )}
            >
              <CheckIcon className="w-5 h-5" aria-hidden="true" />
            </span>
          ) : null}
        </>
      )}
    </Listbox.Option>
  );
};

type ToggleFilterProps = {
  onSelect: (value: string) => void;
  selected: string;
};

// For Sale and Redeemed toggles
export default function ToggleFilter({ onSelect, selected }: ToggleFilterProps) {
  // bg-white hover:bg-gray-100 text-gray-700 border border-gray-300
  return (
    <Listbox value={selected} onChange={onSelect}>
      <div className="relative mt-1">
        <Listbox.Button className="relative border border-gray-300 w-full py-2 px-4  text-left font-medium bg-white rounded-lg  cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
          <span className="block truncate">{selected}</span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <SelectorIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {Object.values(ToggleState).map((category, index) => (
              <ListOption key={index} value={category} label={category} />
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
