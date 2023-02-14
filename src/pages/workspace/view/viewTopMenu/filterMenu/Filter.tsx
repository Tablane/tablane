import { Listbox, Transition } from '@headlessui/react'
import { CaretDownIcon, CaretSortIcon } from '@radix-ui/react-icons'
import React, { Fragment } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { regular } from '@fortawesome/fontawesome-svg-core/import.macro'
import StatusSelector from './filter/StatusSelector.tsx'
import PeopleSelector from './filter/PeopleSelector.tsx'
import { useParams } from 'react-router-dom'
import { useFetchWorkspaceQuery } from '../../../../../modules/services/workspaceSlice'

export default function Filter({
    _id,
    column,
    setColumn,
    setValue,
    filterTypes,
    operations,
    index,
    removeFilter,
    value,
    operation,
    setOperation,
    filterAnd,
    toggleFilterAnd,
    groupId,
    board
}) {
    const params = useParams()
    const { data: workspace } = useFetchWorkspaceQuery(params.workspace)

    const handleSetColumn = column => {
        setColumn({ groupId, filterId: _id, column })
    }

    const handleRemoveFilter = () => {
        removeFilter({ groupId, filterId: _id })
    }

    const handleSetOperation = operation => {
        setOperation({ groupId, filterId: _id, operation })
    }

    const handleSetValue = value => {
        setValue({ groupId, filterId: _id, value })
    }

    const handleToggleFilterAnd = () => {
        toggleFilterAnd({ group: false, groupId, filterId: _id })
    }

    return (
        <div className="mb-2 flex flex-row justify-center items-center">
            {index === 0 ? (
                <span className="w-12">Where</span>
            ) : (
                <div className="w-12 cursor-pointer flex justify-center items-center">
                    <div
                        onClick={handleToggleFilterAnd}
                        className="select-none overflow-hidden rounded border-[#d6d9de] text-xs border flex flex-row h-6 w-full flex justify-center items-center"
                    >
                        <div
                            className={`flex flex-col h-12 transition-all duration-500 relative ${
                                filterAnd ? 'top-[-12px]' : 'top-[12px]'
                            }`}
                        >
                            <div className="flex justify-center items-center pl-1 h-6 font-medium">
                                <span>OR</span>
                            </div>
                            <div className="flex justify-center items-center pl-1 h-6 font-medium">
                                <span>AND</span>
                            </div>
                        </div>
                        <CaretSortIcon />
                    </div>
                </div>
            )}
            <div className="grow mx-3 flex flex-row items-center">
                <Listbox value={column} onChange={handleSetColumn}>
                    <div className={`relative ${column ? 'grow-[2]' : ''}`}>
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
                                {board.attributes
                                    .filter(x =>
                                        ['status', 'people'].includes(x.type)
                                    )
                                    .map((person, personIdx) => (
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
                {column && operation && (
                    <>
                        {column.type === 'status' && (
                            <StatusSelector
                                operations={operations}
                                operation={operation}
                                handleSetOperation={handleSetOperation}
                                value={
                                    column.labels.find(x => x._id === value) ||
                                    null
                                }
                                handleSetValue={handleSetValue}
                                column={column}
                                filterTypes={filterTypes}
                            />
                        )}
                        {column.type === 'people' && (
                            <PeopleSelector
                                operations={operations}
                                operation={operation}
                                handleSetOperation={handleSetOperation}
                                value={
                                    workspace.members.find(
                                        x => x?.user?._id === value
                                    )?.user || null
                                }
                                handleSetValue={handleSetValue}
                                filterTypes={filterTypes}
                            />
                        )}
                    </>
                )}
            </div>
            <div
                onClick={handleRemoveFilter}
                className="h-6 w-6 flex justify-center items-center hover:bg-[#e8eaed] cursor-pointer rounded"
            >
                <FontAwesomeIcon
                    icon={regular('trash-alt')}
                    className="text-pink-400 text-base text-lg"
                />
            </div>
        </div>
    )
}
