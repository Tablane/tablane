import * as Popover from '@radix-ui/react-popover'
import React, { useState } from 'react'
import FilterIcon from '../../../../styles/assets/FilterIcon.tsx'
import produce from 'immer'
import { ObjectId } from '../../../../utils'
import FilterGroup from './filterMenu/FilterGroup.tsx'

const operations = {
    status: ['Is', 'Is not', 'Is set', 'Is not set'],
    people: ['Is', 'Is not', 'Is set', 'Is not set'],
    text: ['Contains', 'Does not contain', 'Is set', 'Is not set']
}

export default function FilterMenu({ boardId }) {
    const [filters, setFilters] = useState([
        {
            _id: ObjectId(),
            group: false,
            filterAnd: true,
            filters: [
                {
                    _id: ObjectId(),
                    filterAnd: true,
                    column: null,
                    operation: null,
                    value: null
                }
            ]
        },
        {
            _id: ObjectId(),
            group: true,
            filterAnd: true,
            filters: [
                {
                    _id: ObjectId(),
                    filterAnd: true,
                    column: null,
                    operation: null,
                    value: null
                },
                {
                    _id: ObjectId(),
                    filterAnd: true,
                    column: null,
                    operation: null,
                    value: null
                }
            ]
        },
        {
            _id: ObjectId(),
            group: false,
            filterAnd: true,
            filters: [
                {
                    _id: ObjectId(),
                    filterAnd: true,
                    column: null,
                    operation: null,
                    value: null
                }
            ]
        }
    ])

    const setColumn = ({ groupId, filterId, column }) => {
        setFilters(
            produce(filters, draft => {
                const filter = draft
                    .find(x => x._id === groupId)
                    .filters.find(x => x._id === filterId)
                filter.column = column
                filter.operation = operations[column.type][0]
                filter.value = null
            })
        )
    }

    const setOperation = ({ groupId, filterId, operation }) => {
        setFilters(
            produce(filters, draft => {
                draft
                    .find(x => x._id === groupId)
                    .filters.find(x => x._id === filterId).operation = operation
            })
        )
    }

    const toggleFilterAnd = ({ group, groupId, filterId }) => {
        if (group) {
            setFilters(
                produce(filters, draft => {
                    const group = draft.find(x => x._id === groupId)
                    group.filterAnd = !group.filterAnd
                })
            )
        } else {
            setFilters(
                produce(filters, draft => {
                    const filter = draft
                        .find(x => x._id === groupId)
                        .filters.find(x => x._id === filterId)
                    filter.filterAnd = !filter.filterAnd
                })
            )
        }
    }

    const setValue = ({ groupId, filterId, value }) => {
        setFilters(
            produce(filters, draft => {
                draft
                    .find(x => x._id === groupId)
                    .filters.find(x => x._id === filterId).value = value
            })
        )
    }

    const addFilter = (group: boolean, groupId = null) => {
        const filter = {
            _id: ObjectId(),
            column: null,
            filterAnd: true,
            operation: null,
            value: null
        }

        if (groupId) {
            setFilters(
                produce(filters, draft => {
                    draft.find(x => x._id === groupId).filters.push(filter)
                })
            )
        } else {
            setFilters(
                produce(filters, draft => {
                    draft.push({
                        _id: ObjectId(),
                        group,
                        filterAnd: true,
                        filters: [filter]
                    })
                })
            )
        }
    }

    const removeFilter = ({ groupId, filterId }) => {
        setFilters(
            produce(filters, draft => {
                const group = draft.find(x => x._id === groupId)
                if (group.filters.length <= 1) {
                    return [...draft.filter(x => x._id !== groupId)]
                } else {
                    group.filters = group.filters.filter(
                        x => x._id !== filterId
                    )
                }
            })
        )
    }

    return (
        <Popover.Root>
            <Popover.Trigger asChild>
                <div className="group-by text-[#53575e]">
                    <FilterIcon />
                    <p className="text-[#333333]">Filter</p>
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
                                ({ _id, group, filterAnd, filters }, index) => (
                                    <FilterGroup
                                        boardId={boardId}
                                        _id={_id}
                                        group={group}
                                        filterAnd={filterAnd}
                                        filters={filters}
                                        index={index}
                                        operations={operations}
                                        removeFilter={removeFilter}
                                        addFilter={addFilter}
                                        setColumn={setColumn}
                                        setValue={setValue}
                                        setOperation={setOperation}
                                        toggleFilterAnd={toggleFilterAnd}
                                        key={_id}
                                    />
                                )
                            )}
                        </div>
                        <div className="py-3 group">
                            <span
                                onClick={() => addFilter(false)}
                                className="cursor-pointer rounded transition-all hover:bg-[#f0f1f3] px-2 py-1 text-[#4f5762] text-xs font-medium"
                            >
                                + Add filter
                            </span>
                            {filters.length >= 1 && (
                                <span
                                    onClick={() => addFilter(true)}
                                    className="opacity-0 group-hover:opacity-100 cursor-pointer rounded transition-all hover:bg-[#f0f1f3] px-2 py-1 text-[#4f5762] text-xs font-medium"
                                >
                                    + Add group
                                </span>
                            )}
                        </div>
                    </div>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    )
}
