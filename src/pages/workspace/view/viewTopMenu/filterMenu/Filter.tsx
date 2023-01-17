import { Listbox, Transition } from '@headlessui/react'
import { CaretDownIcon } from '@radix-ui/react-icons'
import React, { Fragment, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { regular } from '@fortawesome/fontawesome-svg-core/import.macro'

export default function Filter({
    column,
    setColumn,
    setValue,
    people,
    filterTypes,
    index,
    removeFilter,
    value
}) {
    const [filterType, setFilterType] = useState(filterTypes[0])

    const handleSetColumn = column => {
        setFilterType(filterTypes[0])
        setValue(null, index)
        setColumn(column, index)
    }

    const handleRemoveFilter = () => {
        removeFilter(index)
    }

    const handleSetValue = value => {
        setValue(value, index)
    }

    const items = column?.labels

    return (
        <div className="mb-2 flex flex-row justify-center items-center">
            <span className="w-10">Where</span>
            <div className="flex-grow mx-3 flex flex-row items-center">
                <Listbox value={column} onChange={handleSetColumn}>
                    <div className="relative">
                        <Listbox.Button className="relative cursor-pointer w-full h-8 rounded-lg bg-white pl-3 pr-8 text-left bg-[#F7F8F9] border-[#d6d9de] border outline-none sm:text-sm">
                            <span className="block truncate">
                                {column?.name ?? 'Select filter'}
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <CaretDownIcon />
                            </span>
                        </Listbox.Button>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Listbox.Options className="z-10 w-[220px] max-h-[300px] py-2 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {people.map((person, personIdx) => (
                                    <Listbox.Option
                                        key={personIdx}
                                        className={({ active }) =>
                                            `relative cursor-pointer rounded flex items-center select-none h-8 px-2 mx-2 ${
                                                active
                                                    ? 'bg-[#f3f4f6]'
                                                    : 'text-gray-900'
                                            }`
                                        }
                                        value={person}
                                    >
                                        {({ selected }) => (
                                            <>
                                                <span
                                                    className={`block truncate ${
                                                        selected
                                                            ? 'font-medium'
                                                            : 'font-normal'
                                                    }`}
                                                >
                                                    {person.name}
                                                </span>
                                            </>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    </div>
                </Listbox>
                {column && (
                    <>
                        <Listbox value={filterType} onChange={setFilterType}>
                            <div className="relative mx-2">
                                <Listbox.Button className="relative cursor-pointer w-full h-8 rounded-lg bg-white pl-3 pr-8 text-left border outline-none sm:text-sm">
                                    <span className="block truncate">
                                        {filterType}
                                    </span>
                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                        <CaretDownIcon />
                                    </span>
                                </Listbox.Button>
                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Listbox.Options className="z-10 w-[220px] max-h-[300px] py-2 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                        {filterTypes.map((filterType, i) => (
                                            <Listbox.Option
                                                key={i}
                                                className={({ active }) =>
                                                    `relative cursor-pointer rounded flex items-center select-none h-8 px-2 mx-2 ${
                                                        active
                                                            ? 'bg-[#f3f4f6]'
                                                            : 'text-gray-900'
                                                    }`
                                                }
                                                value={filterType}
                                            >
                                                {({ selected }) => (
                                                    <>
                                                        <span
                                                            className={`block truncate ${
                                                                selected
                                                                    ? 'font-medium'
                                                                    : 'font-normal'
                                                            }`}
                                                        >
                                                            {filterType}
                                                        </span>
                                                    </>
                                                )}
                                            </Listbox.Option>
                                        ))}
                                    </Listbox.Options>
                                </Transition>
                            </div>
                        </Listbox>
                        <Listbox value={value} onChange={handleSetValue}>
                            <div className="relative">
                                <Listbox.Button className="relative cursor-pointer w-full h-8 rounded-lg bg-white pl-3 pr-8 text-left border outline-none sm:text-sm">
                                    <span
                                        className="block truncate rounded px-2 min-w-[40px] min-h-[20px]"
                                        style={{
                                            backgroundColor: value?.color
                                        }}
                                    >
                                        {value?.name ?? 'Select option'}
                                    </span>
                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                        <CaretDownIcon />
                                    </span>
                                </Listbox.Button>
                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Listbox.Options className="z-10 w-[220px] max-h-[300px] py-2 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                        {items.map((label, i) => (
                                            <Listbox.Option
                                                key={i}
                                                style={{
                                                    backgroundColor: label.color
                                                }}
                                                className={({ active }) =>
                                                    `mt-1 relative cursor-pointer rounded flex items-center select-none h-8 px-2 mx-2 ${
                                                        active
                                                            ? 'bg-[#f3f4f6]'
                                                            : 'text-gray-900'
                                                    }`
                                                }
                                                value={label}
                                            >
                                                {({ selected }) => (
                                                    <>
                                                        <span
                                                            className={`block truncate text-center ${
                                                                selected
                                                                    ? 'font-medium'
                                                                    : 'font-normal'
                                                            }`}
                                                        >
                                                            {label.name}
                                                        </span>
                                                    </>
                                                )}
                                            </Listbox.Option>
                                        ))}
                                    </Listbox.Options>
                                </Transition>
                            </div>
                        </Listbox>
                    </>
                )}
            </div>
            <div
                onClick={handleRemoveFilter}
                className="h-6 w-6 flex justify-center items-center hover:bg-[#e8eaed] cursor-pointer rounded"
            >
                <FontAwesomeIcon
                    icon={regular('trash-alt')}
                    className="text-pink-400 text-base"
                />
            </div>
        </div>
    )
}
