import { Listbox, Transition } from '@headlessui/react'
import { CaretDownIcon } from '@radix-ui/react-icons'
import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'
import { useFetchWorkspaceQuery } from '../../../../../../modules/services/workspaceSlice'

export default function PeopleSelector({
    operations,
    operation,
    handleSetOperation,
    value,
    handleSetValue
}) {
    const params = useParams()
    const { data: workspace } = useFetchWorkspaceQuery(params.workspace)
    return (
        <>
            <Listbox value={operation} onChange={handleSetOperation}>
                <div className="relative mx-2">
                    <Listbox.Button className="relative cursor-pointer w-full h-8 rounded-lg bg-white pl-3 pr-8 text-left border outline-none sm:text-sm">
                        <span className="block truncate">{operation}</span>
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
                            {operations['people'].map((filterType, i) => (
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
            {['Is', 'Is not'].includes(operation) && (
                <Listbox value={value} onChange={handleSetValue}>
                    <div className="relative grow-[2]">
                        <Listbox.Button className="relative cursor-pointer w-full h-8 rounded-lg bg-white pl-3 pr-8 text-left border outline-none sm:text-sm">
                            <div className="flex flex-row items-center">
                                {value?.username && (
                                    <div className="cursor-pointer bg-[#4169e1] text-[10px] min-w-[26px] h-[26px] rounded-full border-2 border-white dark:border-gray-800 flex justify-center items-center text-white">
                                        {value.username.charAt(0).toUpperCase()}
                                        {value.username.charAt(1).toUpperCase()}
                                    </div>
                                )}
                                <span
                                    className="block truncate rounded px-2 min-w-[40px] min-h-[20px]"
                                    style={{
                                        backgroundColor: value?.color
                                    }}
                                >
                                    {value?.username ?? 'Select option'}
                                </span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                    <CaretDownIcon />
                                </span>
                            </div>
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
                                {workspace.members.map(({ user }, i) => (
                                    <Listbox.Option
                                        key={i}
                                        className={({ active }) =>
                                            `mt-1 relative cursor-pointer rounded flex items-center select-none h-8 px-2 mx-2 ${
                                                active
                                                    ? 'bg-[#f3f4f6]'
                                                    : 'text-gray-900'
                                            }`
                                        }
                                        value={user}
                                    >
                                        {({ selected }) => (
                                            <>
                                                <div>
                                                    <div className="flex flex-row items-center">
                                                        {user?.username && (
                                                            <div className="mr-2 cursor-pointer bg-[#4169e1] text-[10px] min-w-[26px] h-[26px] rounded-full border-2 border-white dark:border-gray-800 flex justify-center items-center text-white">
                                                                {user.username
                                                                    .charAt(0)
                                                                    .toUpperCase()}
                                                                {user.username
                                                                    .charAt(1)
                                                                    .toUpperCase()}
                                                            </div>
                                                        )}
                                                        <span
                                                            className={`block truncate text-center ${
                                                                selected
                                                                    ? 'font-medium'
                                                                    : 'font-normal'
                                                            }`}
                                                        >
                                                            {user.username}
                                                        </span>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    </div>
                </Listbox>
            )}
        </>
    )
}
