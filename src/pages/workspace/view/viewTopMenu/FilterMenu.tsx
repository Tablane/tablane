import * as Popover from '@radix-ui/react-popover'
import React, { useEffect, useState } from 'react'
import FilterIcon from '../../../../styles/assets/FilterIcon.tsx'
import produce from 'immer'
import { ObjectId } from '../../../../utils'
import Filter from './filterMenu/Filter.tsx'
import {
    useFetchBoardQuery,
    useSetFiltersMutation
} from '../../../../modules/services/boardSlice.ts'

const operations = {
    status: ['Is', 'Is not', 'Is set', 'Is not set'],
    people: ['Is', 'Is not', 'Is set', 'Is not set'],
    text: ['Contains', 'Does not contain', 'Is set', 'Is not set']
}

export default function FilterMenu({ boardId }) {
    const { data: board } = useFetchBoardQuery(boardId)
    const [setFilters] = useSetFiltersMutation()
    const [filters, setFiltersState] = useState([])

    const setColumn = ({ filterId, column }) => {
        setFiltersState(
            produce(filters, draft => {
                const filter = draft.find(x => x._id === filterId)
                filter.column = column._id
                filter.type = column.type
                filter.operation = operations[column.type][0]
                filter.value = null
            })
        )
    }

    const setOperation = ({ filterId, operation }) => {
        setFiltersState(
            produce(filters, draft => {
                draft.find(x => x._id === filterId).operation = operation
            })
        )
    }

    const toggleFilterAnd = ({ filterId }) => {
        setFiltersState(
            produce(filters, draft => {
                const filter = draft.find(x => x._id === filterId)
                filter.filterAnd = !filter.filterAnd
            })
        )
    }

    const setValue = ({ filterId, value }) => {
        setFiltersState(
            produce(filters, draft => {
                draft.find(x => x._id === filterId).value = value._id
            })
        )
    }

    const addFilter = () => {
        setFiltersState(
            produce(filters, draft => {
                draft.push({
                    _id: ObjectId(),
                    column: null,
                    filterAnd: true,
                    operation: null,
                    value: null
                })
            })
        )
    }

    const removeFilter = ({ filterId }) => {
        setFiltersState(
            produce(filters, draft => {
                return [...draft.filter(x => x._id !== filterId)]
            })
        )
    }

    useEffect(() => {
        if (board?.filters) {
            setFiltersState(board.filters)
        }
    }, [board.filters])

    const handleClose = open => {
        if (!open) {
            setFilters({
                boardId,
                filters
            })
        }
    }

    const used = filters.length >= 1
    return (
        <Popover.Root onOpenChange={handleClose}>
            <Popover.Trigger asChild>
                <div
                    className={`group-by ${
                        used ? 'bg-[#eaedfb] text-[#4169e1]' : 'text-[#53575e]'
                    }`}
                >
                    <FilterIcon />
                    <p
                        className={`${
                            used ? 'text-[#4169e1]' : 'text-[#333333]'
                        }`}
                    >
                        Filter
                    </p>
                </div>
            </Popover.Trigger>
            <Popover.Portal className="z-[1300] radix-portal">
                <Popover.Content
                    className="p-6 pb-2 z-[100] outline-none shadow-lg m-3 rounded-md bg-white"
                    sideOffset={5}
                >
                    <div className="w-[720px] bg-[transparent]">
                        <p className="text-[#2a2e34] text-xl font-semibold">
                            Filters
                        </p>
                        <div className="text-sm mt-4 text-[#2a2e34]">
                            {filters.map(
                                (
                                    {
                                        _id,
                                        filterAnd,
                                        operation,
                                        value,
                                        column
                                    },
                                    index
                                ) => (
                                    <Filter
                                        board={board}
                                        _id={_id}
                                        groupId={_id}
                                        value={value}
                                        removeFilter={removeFilter}
                                        key={index}
                                        index={index}
                                        column={board.attributes.find(
                                            x => x._id === column
                                        )}
                                        setColumn={setColumn}
                                        setValue={setValue}
                                        operations={operations}
                                        operation={operation}
                                        setOperation={setOperation}
                                        filterAnd={filterAnd}
                                        toggleFilterAnd={toggleFilterAnd}
                                    />
                                )
                            )}
                        </div>
                        <div className="py-3 group">
                            <span
                                onClick={addFilter}
                                className="cursor-pointer rounded transition-all hover:bg-[#f0f1f3] px-2 py-1 text-[#4f5762] text-xs font-medium"
                            >
                                + Add filter
                            </span>
                        </div>
                    </div>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    )
}
